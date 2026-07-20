import { AlertType } from '../enums/alert-type';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert } from '../models/alert';
import { computed, signal } from '@angular/core';
import { Confirmation } from '../models/confirmation';

/** Amusix component base. */
export abstract class AmxComponentBase {
  //region fields

  private static alertBS = new BehaviorSubject<Alert | undefined>(undefined);
  private static confirmBS = new BehaviorSubject<Confirmation | undefined>(undefined);
  private static screenWidth = signal<number | undefined>(undefined);

  /**
   * Get if the current user's device has a mobile or desktop screen size.<br>
   * Based on the screen width provided with {@link setScreenWidth}.
   */
  protected isPhoneScreen = computed(() => (AmxComponentBase.screenWidth() ?? 500) <= 767);

  //endregion

  //region methods

  /**
   * Get an observable of the current alert to display in the application.
   * @returns An observable of the corresponding alert.
   */
  protected get alertObservable(): Observable<Alert | undefined> {
    return AmxComponentBase.alertBS.asObservable();
  }

  /**
   * Show an alert in the application.
   * @param type Alert type.
   * @param text Text displayed within the alert.
   * @param duration Time (in seconds) before the alert automatically dismiss.
   *        If no duration provided, the alert will not automatically dismiss.
   */
  protected showAlert(type: AlertType, text: string, duration = NaN) {
    AmxComponentBase.alertBS.next({type, text, duration});
  }

  /**
   * Get an observable of the current confirm message to display in the application.
   * @return An observable of the corresponding confirmation.
   */
  protected get confirmObservable(): Observable<Confirmation | undefined> {
    return AmxComponentBase.confirmBS.asObservable();
  }

  /**
   * Show a modal with a message to confirm before executing an action.
   * @param confirmMessage Confirmation message.
   * @param onConfirm Action to execute after the message is confirmed.
   */
  protected showConfirm(confirmMessage: string, onConfirm: Function) {
    AmxComponentBase.confirmBS.next({text: confirmMessage, onConfirm});
  }

  /**
   * Delay current thread instructions for a specified amount of time.
   * @param ms Time to wait in milliseconds.
   */
  protected delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Set screen width as reference for inheriting components.
   * @param screenWidth Current app screen width.
   */
  protected setScreenWidth(screenWidth: number) {
    AmxComponentBase.screenWidth.set(screenWidth);
  }

  //endregion
}
