import { Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { Modal } from '../../../shared/components/modal/modal';
import { AmxComponentBase } from '../../../shared/components/amx-component-base';
import { Confirmation } from '../../../shared/models/confirmation';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-confirm-modal',
  imports: [
    Modal
  ],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModal extends AmxComponentBase implements OnInit {
  //region fields

  protected confirmation = signal(new Confirmation());
  protected confirmModal = viewChild<Modal>('confirmModal');

  //endregion

  //region injections

  protected readonly destroyRef = inject(DestroyRef);

  //endregion

  //region methods

  ngOnInit() {
    this.confirmObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(confirmation => {
      if (confirmation) {
        this.confirmation.set(confirmation);
        this.confirmModal()?.open();
      }
    })
  }

  protected confirm() {
    this.confirmModal()?.close();
    this.confirmation().onConfirm();
  }

  //endregion
}
