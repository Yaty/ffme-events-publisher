import * as got from 'got';
import Parser from './Parser';
import FFMEEvent from './FFMEEvent';

export default class Formation extends FFMEEvent {
  constructor(
    public readonly id: string,
    title: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly city: string,
    link: string,
    mediaUrl?: string,
  ) {
    super(link, title, mediaUrl);
  }

  async getRegistrationLimitDate(): Promise<Date> {
    const {
      body,
    } = await got(this.link);

    return Parser.getFormationRegistrationLimitDateFromHTML(body);
  }
}
