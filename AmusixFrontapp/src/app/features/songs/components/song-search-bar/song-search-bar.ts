import { ChangeDetectorRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { SongSearchForm } from '../../models/song-search-form';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { ActivationEnd, Router } from '@angular/router';
import { AmxComponentBase } from '../../../../shared/components/amx-component-base';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** Song search bar. */
@Component({
  selector: 'app-song-search-bar',
  imports: [FormsModule, FormField],
  templateUrl: './song-search-bar.html',
  styleUrl: './song-search-bar.scss'
})
export class SongSearchBar extends AmxComponentBase {
  //region fields

  protected editedSearch = signal(new SongSearchForm());
  protected searchForm = form(this.editedSearch, x => {
    required(x.searchText);
    maxLength(x.searchText, 100);
  });

  //endregion

  //region injections

  protected readonly router = inject(Router);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly changeDetectorRef = inject(ChangeDetectorRef);

  //endregion

  //region methods

  ngOnInit() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      if (event instanceof ActivationEnd) {
        const searchText = event.snapshot.params['searchText'];
        if (searchText) {
          this.searchForm().controlValue.set({searchText});
          this.changeDetectorRef.detectChanges();
        }
      }
    });
  }

  protected async searchSongs() {
    await this.router.navigateByUrl('/', {skipLocationChange: true}); // Refresh song search page
    await this.router.navigateByUrl(`/search-songs/${this.editedSearch().searchText}`);
  }

  //endregion
}
