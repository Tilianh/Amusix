import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AlertType } from '../../../shared/enums/alert-type';
import { AmxComponentBase } from '../../../shared/components/amx-component-base';
import { Alert } from '../../../shared/models/alert';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-alert-display',
  imports: [],
  templateUrl: './alert-display.html',
  styleUrl: './alert-display.scss'
})
export class AlertDisplay extends AmxComponentBase implements OnInit {
  //region fields

  protected alertInfo = signal(new Alert());
  protected isVisible = signal(false);

  //endregion

  //region injections

  protected readonly AlertType = AlertType;
  protected readonly destroyRef = inject(DestroyRef);

  //endregion

  //region methods

  ngOnInit() {
    this.alertObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (alert) => {
      if (alert) {
        this.alertInfo.set(alert);
        await this.displayAlertAsync();
      }
    });
  }

  protected async displayAlertAsync() {
    this.isVisible.set(true);
    if (!isNaN(this.alertInfo().duration)) {
      for (let i = this.alertInfo().duration; i > 0; i--) await this.delay(1000);
      this.dismissAlert();
    }
  }

  protected dismissAlert() {
    this.isVisible.set(false);
  }

  //endregion
}
