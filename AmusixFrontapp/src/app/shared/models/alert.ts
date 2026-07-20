import { AlertType } from '../enums/alert-type';

export class Alert {
  public type = AlertType.DEFAULT;
  public text = '';
  public duration = NaN;
}
