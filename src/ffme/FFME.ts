import Crawler from './Crawler';
import Parser from './Parser';
import chalk from 'chalk';
import * as got from 'got';

import {
  FFMEData,
  FFMERawData,
  FFMEDataUrl,
} from '../types';

import Formation from './Formation';
import Competition from './Competition';
import Stage from './Stage';

export default class FFME {
  private readonly crawler: Crawler;

  private readonly mapping = {
    competition: 'competitions',
    formation: 'formations',
    stage: 'stages',
  };

  constructor() {
    this.crawler = new Crawler();
  }

  private async fetchRawData(dataUrls: FFMEDataUrl): Promise<FFMERawData> {
    const data: FFMERawData = {};

    await Promise.all(Object.entries(dataUrls)
      .map(async ([key, uri]) => {
        if (!key) {
          console.log(chalk.yellow(key, 'non traité car JSON introuvable'));
          return;
        }

        try {
          const {body} = await got(uri, {
            json: true,
          });

          data[this.mapping[key]] = body.Listing;
          console.log(chalk.green(key, 'en mémoire !'));
        } catch (err) {
          console.log(chalk.red(key, 'non traité car :', err.name, err.message));
        }
      }),
    );

    return data;
  }

  private async getRawData(): Promise<FFMERawData> {
    const ligueManagementPageHTML = await this.crawler.getLigueManagementPageHTML();
    const dataUrls = Parser.getDataUrls(ligueManagementPageHTML);
    return this.fetchRawData(dataUrls);
  }

  private async mapRawData(rawData: FFMERawData): Promise<FFMEData> {
    const getFormations = () => Promise.all(rawData.formations && rawData.formations.map((formation) => {
      const newFormation = new Formation(
        formation.ID,
        formation.STAGE,
        formation['DATE DEBUT'],
        formation['DATE FIN'],
        formation.COMMUNE,
        formation.LIEN,
      );

      return newFormation.build();
    }) || []);

    const getCompetitions = () => Promise.all(rawData.competitions && rawData.competitions.map((competition) => {
      const newCompetition = new Competition(
        competition.ID,
        competition.LIBELLE,
        competition.TYPE,
        competition.DATE,
        competition.COMMUNE,
        competition.DISCIPLINE,
        competition.LIEN,
      );

      return newCompetition.build();
    }) || []);

    const getStages = () => Promise.all(rawData.stages && rawData.stages.map((stage) => {
      const newStage = new Stage(
        // TODO
        stage.ID,
        '',
        '',
      );

      return newStage.build();
    }) || []);

    const [
      formations,
      competitions,
      stages,
    ] = await Promise.all([
      getFormations(),
      getCompetitions(),
      getStages(),
    ]);

    return {
      formations,
      competitions,
      stages,
    };
  }

  public async getData(): Promise<FFMEData> {
    const rawData = await this.getRawData();
    return this.mapRawData(rawData);
  }
}
