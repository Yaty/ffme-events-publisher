import * as got from 'got';

import {
  getDateDiffInDaysFromNow,
} from '../utils';

export default abstract class FFMEEvent {
  public isFull: boolean;
  public registrationLimitDate: Date;
  public remainingDaysUntilRegistrationLimitDate: number;

  protected html: string;

  protected constructor(
    public title: string,
    public link: string,
    public mediaUrl?: string,
  ) {}

  public async build(): Promise<this> {
    const {
      body,
    } = await got(this.link);

    this.html = body;
    this.isFull = await this.getFullness();
    this.registrationLimitDate = this.getRegistrationLimitDate();
    this.remainingDaysUntilRegistrationLimitDate = getDateDiffInDaysFromNow(this.registrationLimitDate);
    return this;
  }

  abstract getFullness(): Promise<boolean> | boolean;
  abstract getRegistrationLimitDate(): Date;
}
