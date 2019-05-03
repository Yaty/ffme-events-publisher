import FFMEEvent from './FFMEEvent';

export default class Stage extends FFMEEvent {
  constructor(
    public readonly id: string,
    link: string,
  ) {
    super(link);
  }

  async getRegistrationLimitDate(): Promise<Date> {
    return new Date();
  }
}
