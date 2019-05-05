import * as got from 'got';
import FFMEEvent from './FFMEEvent';
import Parser from './Parser';
import * as config from 'config';

export default class Competition extends FFMEEvent {
  private readonly ffmeUrl: string;

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
    this.ffmeUrl = config.get('ffme.url');
  }

  getRegistrationLimitDate(): Date {
    return Parser.getCompetitionRegistrationLimitDate(this.html);
  }

  async getFullness(): Promise<boolean> {
    const maxRegistration = Parser.getCompetitionMaxRegistration(this.html);

    if (typeof maxRegistration === 'undefined') {
      return false;
    }

    const {
      body,
    } = await got(`${this.ffmeUrl}/competition/liste-participants/${this.id}.html?UTI_SEXE=2&CATEGORIE=0`);

    const registrationsCount = Parser.getCompetitionRegistration(body);
    return registrationsCount >= maxRegistration;
  }
}
