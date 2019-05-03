import * as fs from 'fs';
import * as config from 'config';
import Publisher from './Publisher';
import FFMEEvent from '../ffme/FFMEEvent';

export default class Wordpress extends Publisher {
  constructor() {
    super(
      fs.readFileSync('./template/wordpress/formation.mustache').toString(),
      fs.readFileSync('./template/wordpress/competition.mustache').toString(),
      fs.readFileSync('./template/wordpress/stage.mustache').toString(),
      config.get('publishers.wordpress.formations.publishInDays'),
      config.get('publishers.wordpress.competitions.publishInDays'),
      config.get('publishers.wordpress.stages.publishInDays'),
    );
  }

  public async post(message: string, event: FFMEEvent): Promise<void> {
    return;
  }
}
