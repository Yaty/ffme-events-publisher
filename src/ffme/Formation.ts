import * as got from 'got';
import Parser from './Parser';
import FFMEEvent from './FFMEEvent';

export default class Formation extends FFMEEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly city: string,
    link: string,
  ) {
    super(link);
  }

  async getRegistrationLimitDate(): Promise<Date> {
    const {
      body,
    } = await got(this.link);

    return Parser.getFormationRegistrationLimitDateFromHTML(body);
  }
}
