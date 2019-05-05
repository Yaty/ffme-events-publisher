import * as got from 'got';
import FFMEEvent from './FFMEEvent';
import Parser from './Parser';

export default class Competition extends FFMEEvent {
  constructor(
    public readonly id: string,
    title: string,
    public readonly type: string,
    public readonly date: string,
    public readonly city: string,
    public readonly discipline: string,
    link: string,
    mediaUrl?: string,
  ) {
    super(title, link, mediaUrl);
  }

  async getRegistrationLimitDate(): Promise<Date> {
    const {
      body,
    } = await got(this.link);

    return Parser.getCompetitionRegistrationLimitDateFromHTML(body);
  }
}
