import Stage from '../ffme/Stage';
import Formation from '../ffme/Formation';
import Competition from '../ffme/Competition';
import chalk from 'chalk';
import * as fs from 'fs';
import * as config from 'config';
import * as mustache from 'mustache';
import FFMEEvent from '../ffme/FFMEEvent';

export default abstract class Publisher {
  private readonly publisherName: string;
  abstract post(message: string, event: FFMEEvent): Promise<void>;

  protected readonly formationTemplate: string;
  protected readonly competitionTemplate: string;
  protected readonly stageTemplate: string;
  protected readonly publishFormationInDays: number[];
  protected readonly publishCompetitionInDays: number[];
  protected readonly publishStageInDays: number[];

  protected constructor() {
    this.publisherName = this.constructor.name;
    const lowerCasedPublisherName = this.publisherName.toLowerCase();

    this.formationTemplate = fs.readFileSync(`./template/${lowerCasedPublisherName}/formation.mustache`).toString();
    this.competitionTemplate = fs.readFileSync(`./template/${lowerCasedPublisherName}/competition.mustache`).toString();
    this.stageTemplate = fs.readFileSync(`./template/${lowerCasedPublisherName}/stage.mustache`).toString();
    this.publishFormationInDays = config.get(`publishers.${lowerCasedPublisherName}.formations.publishOnDays`);
    this.publishCompetitionInDays = config.get(`publishers.${lowerCasedPublisherName}.competitions.publishOnDays`);
    this.publishStageInDays = config.get(`publishers.${lowerCasedPublisherName}.stages.publishOnDays`);
  }

  private shouldPublishFormation(formation: Formation): boolean {
    return this.publishFormationInDays.includes(formation.remainingDaysUntilRegistrationLimitDate);
  }

  private shouldPublishCompetition(competition: Competition): boolean {
    return this.publishCompetitionInDays.includes(competition.remainingDaysUntilRegistrationLimitDate);
  }

  private shouldPublishStage(stage: Stage): boolean {
    return this.publishStageInDays.includes(stage.remainingDaysUntilRegistrationLimitDate);
  }

  public async publishFormation(formation: Formation): Promise<void> {
    const shouldPublish = this.shouldPublishFormation(formation);

    if (!shouldPublish) {
      console.log(chalk.yellow(
        `La compétition [${formation.title}] ne sera pas publiée aujourd'hui dans ${this.publisherName}.`,
      ));

      return;
    }

    const message = mustache.render(this.formationTemplate, formation);
    await this.post(message, formation);

    console.log(chalk.green(`Compétition [${formation.title}] publiée dans ${this.publisherName} !`));
  }

  public async publishCompetition(competition: Competition): Promise<void> {
    const shouldPublish = this.shouldPublishCompetition(competition);

    if (!shouldPublish) {
      console.log(chalk.yellow(
        `La compétition [${competition.title}] ne sera pas publiée aujourd'hui dans ${this.publisherName}.`,
      ));

      return;
    }

    const message = mustache.render(this.competitionTemplate, competition);
    await this.post(message, competition);

    console.log(chalk.green(`Compétition [${competition.title}] publiée dans ${this.publisherName} !`));
  }

  public async publishStage(stage: Stage): Promise<void> {
    const shouldPublish = this.shouldPublishStage(stage);

    if (!shouldPublish) {
      console.log(chalk.yellow(
        `Le stage [${stage.title}] ne sera pas publié aujourd'hui dans ${this.publisherName}.`,
      ));

      return;
    }

    const message = mustache.render(this.stageTemplate, stage);
    await this.post(message, stage);

    console.log(chalk.green(`Stage [${stage.title}] publié dans ${this.publisherName} !`));
  }
}
