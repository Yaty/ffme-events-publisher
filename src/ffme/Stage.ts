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

  getRegistrationLimitDate(): Date {
    return new Date();
  }

  getFullness(): boolean {
    // no way to have this info
    return false;
  }
}
