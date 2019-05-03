import * as cheerio from 'cheerio';

import {
  getTheEndOfTheDayDate,
} from '../utils';

import {
  FFMEDataUrl,
} from '../types';

export default class Parser {
  static getDataUrlsFromHTML(html: string): FFMEDataUrl {
    const $ = cheerio.load(html);
    const urls = $('#cadreTableauOngletGU > fieldset:nth-child(19) > ul:nth-child(5)');

    return {
      competition: urls.find('li:contains("Compétition")').find('a[href$=".json"]').get()[0],
      formation: urls.find('li:contains("Formation")').find('a[href$=".json"]').get()[0],
      stage: urls.find('li:contains("Stage")').find('a[href$=".json"]').get()[0],
    };
  }

  static getCompetitionRegistrationLimitDateFromHTML(html: string): Date {
    const $ = cheerio.load(html);
    const text = $('span:contains("Date limite d\'inscription :")').parent().text();

    const [date, month, year] = text
      .substr(text.indexOf(':') + 1)
      .trim()
      .split('/')
      .map(Number);

    return getTheEndOfTheDayDate(date, month, year);
  }

  static getFormationRegistrationLimitDateFromHTML(html: string): Date {
    const $ = cheerio.load(html);
    const text = $('h3:contains("Date limite d\'inscription :")').next().text();

    const [date, month, year] = text
      .split('/')
      .map(Number);

    return getTheEndOfTheDayDate(date, month, year);
  }
}
