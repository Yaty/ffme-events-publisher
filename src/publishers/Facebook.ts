import * as fs from 'fs';
import * as got from 'got';
import * as config from 'config';
import Publisher from './Publisher';
import FFMEEvent from '../ffme/FFMEEvent';

export default class Facebook extends Publisher {
  private readonly accessToken: string;
  private readonly apiUrl: string;

  constructor() {
    super(
      fs.readFileSync('./template/facebook/formation.mustache').toString(),
      fs.readFileSync('./template/facebook/competition.mustache').toString(),
      fs.readFileSync('./template/facebook/stage.mustache').toString(),
      config.get('publishers.facebook.formations.publishInDays'),
      config.get('publishers.facebook.competitions.publishInDays'),
      config.get('publishers.facebook.stages.publishInDays'),
    );

    this.apiUrl = config.get('facebook.uri') + '/' + config.get('facebook.pageId');
    this.accessToken = config.get('facebook.accessToken');
  }

  public async post(message: string, event: FFMEEvent): Promise<void> {
    await got.post(this.apiUrl + '/feed', {
      query: {
        access_token: this.accessToken,
        message,
        link: event.link,
      },
    });
  }
}
