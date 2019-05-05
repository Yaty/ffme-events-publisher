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

  getRegistrationLimitDate(): Date {
    return Parser.getFormationRegistrationLimitDate(this.html);
  }

  getFullness(): boolean {
    return Parser.getFormationRemainingRegistrations(this.html) === 0;
  }
}
