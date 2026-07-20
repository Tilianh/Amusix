import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  OnInit,
  signal,
  TemplateRef,
  viewChild
} from '@angular/core';
import { AmxComponentBase } from '../amx-component-base';
import { PaginatedListPage } from '../../models/paginated-list-page';
import { Loading } from '../loading/loading';
import { NgTemplateOutlet } from '@angular/common';

/** Component to dynamically list items with automatic pagination. */
@Component({
  selector: 'app-dynamic-paginated-list',
  imports: [
    Loading,
    NgTemplateOutlet
  ],
  templateUrl: './dynamic-paginated-list.html',
  styleUrl: './dynamic-paginated-list.scss'
})
export class DynamicPaginatedList<T> extends AmxComponentBase implements OnInit, AfterViewInit {
  //region parameters

  /** Function to call to retrieve a paginated list of the items to list. */
  public itemSource = input.required<(pageToken?: string) => Promise<PaginatedListPage<T> | undefined>>();

  /**
   * Reference of the optional list header template.<br>
   * `ng-template` context parameter:
   * - `pageNumber`: number of the current page
   * - `pageItemCount`: number of items listed in the current page
   * - `totalItemCount`: total number of items across all pages
   */
  public headerTemplateRef = input<TemplateRef<any>>();

  /**
   * Reference of the listed items' template.<br>
   * `ng-template` context parameters:
   * - `item`: item object
   * - `index`: index of the item in the list
   */
  public itemTemplateRef = input.required<TemplateRef<any>>();

  /** Text to display if there's no item to list. */
  public noItemText = input<string>();

  //endregion

  //region fields

  // Component

  protected isLoading = signal(true);
  protected isBigScreen = signal(false);
  protected showFadeInGradient = signal(false);
  protected itemContainer = viewChild<ElementRef>('itemContainer');

  // Items

  protected paginatedItems = signal(new PaginatedListPage<T>());
  protected areAllItemsLoaded = computed(() => this.paginatedItems().items.length == this.paginatedItems().totalItemCount);

  //endregion

  //region methods

  async ngOnInit() {
    this.paginatedItems.set((await this.itemSource().call(this.itemSource()))!);
    this.isLoading.set(false);
  }

  ngAfterViewInit() {
    this.setIsBigScreen();
  }

  protected async loadMoreItems() {
    if (!this.areAllItemsLoaded()) {
      const paginatedItems = (await this.itemSource().call(this.itemSource(), this.paginatedItems().nextPageToken))!;
      this.paginatedItems.set({
        ...paginatedItems,
        items: this.paginatedItems().items.concat(paginatedItems.items)
      });
    }
    this.setIsBigScreen();
  }

  protected async onScrollEnd() {
    const element = (this.itemContainer()?.nativeElement as HTMLElement);
    if (element.scrollTop + element.offsetHeight >= element.scrollHeight - 25) await this.loadMoreItems();
  }

  protected onScroll() {
    this.showFadeInGradient.set(this.itemContainer()?.nativeElement.scrollTop > 0);
  }

  @HostListener('window:resize')
  protected setIsBigScreen() {
    const element = (this.itemContainer()?.nativeElement as HTMLElement);
    if (element) {
      this.isBigScreen.set(
        !this.areAllItemsLoaded() &&
        element.scrollTop == 0 &&
        element.offsetHeight == element.scrollHeight
      );
    }
  }

  //endregion
}
