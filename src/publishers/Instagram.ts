import * as fs from 'fs';
import * as config from 'config';

import Publisher from './Publisher';
import FFMEEvent from '../ffme/FFMEEvent';

export default class Instagram extends Publisher {
  constructor() {
    super(
      fs.readFileSync('./template/instagram/formation.mustache').toString(),
      fs.readFileSync('./template/instagram/competition.mustache').toString(),
      fs.readFileSync('./template/instagram/stage.mustache').toString(),
      config.get('publishers.instagram.formations.publishInDays'),
      config.get('publishers.instagram.competitions.publishInDays'),
      config.get('publishers.instagram.stages.publishInDays'),
    );
  }

  public async post(message: string, event: FFMEEvent): Promise<void> {
    return;
  }
}
