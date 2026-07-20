import { Component, input, OnInit, output, signal } from '@angular/core';

/** Display a modal in the application. */
@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal implements OnInit {
  //region parameters

  /** Modal title. */
  public title = input<string>();

  /** Notify when the modal is closed. */
  public onClose = output();

  /** If the modal can be closed. */
  public closable = input(true);

  /** If `true`, the modal will be open by default. */
  public defaultOpen = input(false);

  //endregion

  //region fields

  protected isVisible = signal(false);

  //endregion

  //region methods

  ngOnInit() {
    if (this.defaultOpen()) this.open();
  }

  /** Open modal. */
  public open() {
    this.isVisible.set(true);
  }

  /** Close modal/ */
  public close() {
    this.isVisible.set(false);
    this.onClose.emit();
  }

  //endregion
}
