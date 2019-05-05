import FFMEEvent from './FFMEEvent';

export default class Stage extends FFMEEvent {
  constructor(
    public readonly id: string,
    link: string,
    title: string,
    mediaUrl?: string,
  ) {
    super(link, title, mediaUrl);
  }

  async getRegistrationLimitDate(): Promise<Date> {
    return new Date();
  }
}
