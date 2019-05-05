import * as got from 'got';
import * as config from 'config';
import Publisher from './Publisher';
import FFMEEvent from '../ffme/FFMEEvent';

export default class Facebook extends Publisher {
  private readonly accessToken: string;
  private readonly apiUrl: string;

  constructor() {
    super();
    this.apiUrl = config.get('facebook.apiUrl') + '/' + config.get('facebook.pageId');
    this.accessToken = config.get('facebook.accessToken');
  }

  public async post(message: string, event: FFMEEvent): Promise<boolean> {
    // https://developers.facebook.com/docs/graph-api/reference/v3.3/post
    await got.post(this.apiUrl + '/feed', {
      query: {
        access_token: this.accessToken,
        message,
        link: event.link,
        picture: event.mediaUrl,
      },
    });

    return true;
  }
}
