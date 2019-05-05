import * as got from 'got';
import * as config from 'config';
import Publisher from './Publisher';
import FFMEEvent from '../ffme/FFMEEvent';
import Competition from '../ffme/Competition';
import Formation from '../ffme/Formation';
import Stage from '../ffme/Stage';

export default class Wordpress extends Publisher {
  private readonly accessToken: string;
  private readonly apiUrl: string;

  constructor() {
    super();
    const username = config.get('publishers.wordpress.username');
    const password = config.get('publishers.wordpress.password');
    this.accessToken = Buffer.from(`${username}:${password}`).toString('base64');
    this.apiUrl = config.get('publishers.wordpress.apiUrl');
  }

  public async post(message: string, event: FFMEEvent): Promise<void> {
    const categories = [];

    if (event instanceof Competition) {
      categories.push(8);
    } else if (event instanceof Formation) {
      categories.push(6);
    } else if (event instanceof Stage) {
      categories.push(16);
    }

    let featuredMediaId;

    if (event.mediaUrl) {
      const form = new FormData();
      form.append('file', got.stream(event.mediaUrl));

      // https://developer.wordpress.org/rest-api/reference/media/#create-a-media-item
      const {body} = await got.post(this.apiUrl + '/wp/v2/media', {
        body: form,
        json: true,
      });

      featuredMediaId = body.id;
    }

    // https://developer.wordpress.org/rest-api/reference/posts/#create-a-post
    await got.post(this.apiUrl + '/wp/v2/posts', {
      json: {
        title: event.title,
        status: 'publish',
        content: message,
        categories,
        author: 1,
        featured_media: featuredMediaId,
      },
    });
  }
}
