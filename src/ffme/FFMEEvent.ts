import {
  getDateDiffInDaysFromNow,
} from '../utils';

export default abstract class FFMEEvent {
  public registrationLimitDate: Date;
  public remainingDaysUntilRegistrationLimitDate: number;

  protected constructor(
    public title: string,
    public link: string,
    public mediaUrl?: string,
  ) {}

  public async build(): Promise<this> {
    this.registrationLimitDate = await this.getRegistrationLimitDate();
    this.remainingDaysUntilRegistrationLimitDate = getDateDiffInDaysFromNow(this.registrationLimitDate);
    return this;
  }

  abstract getRegistrationLimitDate(): Promise<Date>;
}
