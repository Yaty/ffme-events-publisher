import Formation from '../ffme/Formation';
import Competition from '../ffme/Competition';
import Publisher from './Publisher';
import Stage from '../ffme/Stage';

export default class PublisherOrchestrator {
  private readonly publishers: Publisher[];

  constructor(...publishers: Publisher[]) {
    this.publishers = publishers;
  }

  async publishStages(stages: Stage[]): Promise<void> {
    await Promise.all(
      stages.map(
        (stage) => this.publishers.map(
          (publisher) => publisher.publishStage(stage),
        ),
      ),
    );
  }

  async publishFormations(formations: Formation[]): Promise<void> {
    await Promise.all(
      formations.map(
        (formation) => this.publishers.map(
          (publisher) => publisher.publishFormation(formation),
        ),
      ),
    );
  }

  async publishCompetitions(competitions: Competition[]): Promise<void> {
    await Promise.all(
      competitions.map(
        (competition) => this.publishers.map(
          (publisher) => publisher.publishCompetition(competition),
        ),
      ),
    );
  }
}
