import * as cheerio from 'cheerio';

import {
  getTheEndOfTheDayDate,
} from '../utils';

import {
  FFMEDataUrl,
} from '../types';

export default class Parser {
  static getDataUrls(html: string): FFMEDataUrl {
    const $ = cheerio.load(html);
    const urls = $('#cadreTableauOngletGU > fieldset:nth-child(19) > ul:nth-child(5)');

    return {
      competition: urls.find('li:contains("Compétition")').find('a[href$=".json"]').get()[0],
      formation: urls.find('li:contains("Formation")').find('a[href$=".json"]').get()[0],
      stage: urls.find('li:contains("Stage")').find('a[href$=".json"]').get()[0],
    };
  }

  static getCompetitionRegistrationLimitDate(html: string): Date {
    const $ = cheerio.load(html);
    const text = $('span:contains("Date limite d\'inscription :")').parent().text();

    const [date, month, year] = text
      .substr(text.indexOf(':') + 1)
      .trim()
      .split('/')
      .map(Number);

    return getTheEndOfTheDayDate(date, month, year);
  }

  static getFormationRegistrationLimitDate(html: string): Date {
    const $ = cheerio.load(html);
    const text = $('h3:contains("Date limite d\'inscription :")').next().text();

    const [date, month, year] = text
      .split('/')
      .map(Number);

    return getTheEndOfTheDayDate(date, month, year);
  }

  static getCompetitionMaxRegistration(html: string): number | void {
    const $ = cheerio.load(html);
    const el = $('span:contains("Nombre de places :")');

    if (el) {
      return Number(el.parent().text());
    }
  }

  static getCompetitionRegistration(html: string): number {
    const $ = cheerio.load(html);
    const text = $('.infos_colonne_box > p:nth-child(2) > b:nth-child(1)').text();
    return Number(text.split(':').pop().trim());
  }

  static getFormationRemainingRegistrations(html: string): number {
    const $ = cheerio.load(html);
    const text = $('h3:contains("Nombre de places restantes :")').next().text();
    return Number(text);
  }
}
