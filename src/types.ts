import Stage from './ffme/Stage';
import Formation from './ffme/Formation';
import Competition from './ffme/Competition';

export interface RawCompetition {
  ID: string;
  LIBELLE: string;
  TYPE: string;
  DATE: string;
  COMMUNE: string;
  DISCIPLINE: string;
  LIEN: string;
}

export interface RawFormation {
  ID: string;
  STAGE: string;
  'DATE DEBUT': string;
  'DATE FIN': string;
  COMMUNE: string;
  LIEN: string;
}

export interface RawStage {
  ID: string;
  LIEN: string;
}

export interface FFMERawData {
  competitions?: RawCompetition[];
  formations?: RawFormation[];
  stages?: RawStage[];
}

export interface FFMEDataUrl {
  competition?: string;
  formation?: string;
  stage?: string;
}

export interface FFMEData {
  competitions: Competition[];
  formations: Formation[];
  stages: Stage[];
}
