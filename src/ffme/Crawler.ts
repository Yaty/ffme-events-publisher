import * as puppeteer from 'puppeteer';
import * as config from 'config';

import {
  Page,
  Browser,
} from 'puppeteer';

export default class Crawler {
  private browser: Browser;
  private page: Page;
  private readonly username: string;
  private readonly password: string;
  private readonly intranetUrl: string;

  constructor() {
    this.username = config.get('ffme.credentials.login');
    this.password = config.get('ffme.credentials.password');
    this.intranetUrl = config.get('ffme.intranetUrl');
  }

  private async init(): Promise<void> {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    await this.page.goto(this.intranetUrl + '/site/BO/index.php');
  }

  private async login(): Promise<void> {
    await this.page.type('#UTI_LOGIN', this.username);
    await this.page.type('#UTI_MOTPASSE', this.password);

    await Promise.all([
      this.page.click('.bouton_right'),
      this.page.waitForSelector('#ID_PROFIL'),
    ]);
  }

  private async selectProfile(): Promise<void> {
    await this.page.click('#ID_PROFIL > option:nth-child(2)');

    await Promise.all([
      this.page.click('.bouton_right'),
      this.page.waitForSelector('#menu31'),
    ]);
  }

  private async selectLigueManagement(): Promise<void> {
    await Promise.all([
      this.page.click('#menu31 > p:nth-child(1) > a:nth-child(5)'),
      this.page.waitForSelector('#cadreTableauOngletGU'),
    ]);
  }

  private getHTML(): Promise<string> {
    return this.page.evaluate(() => document.body.innerHTML);
  }

  private async close(): Promise<void> {
    await this.browser.close();
  }

  async getLigueManagementPageHTML(): Promise<string> {
    await this.init();
    await this.login();
    await this.selectProfile();
    await this.selectLigueManagement();
    const html = await this.getHTML();
    await this.close();
    return html;
  }
}
