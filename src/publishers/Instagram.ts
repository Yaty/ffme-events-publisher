import Publisher from './Publisher';
import FFMEEvent from '../ffme/FFMEEvent';
import chalk from 'chalk';
import * as puppeteer from 'puppeteer';
import * as config from 'config';

import {
  Browser,
  Page,
} from 'puppeteer';

import {
  deleteFile,
  downloadMedia,
} from '../utils';

export default class Instagram extends Publisher {
  private readonly userAgent: string =
    'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Version/4.0 ' +
    'Chrome/67.0.3396.87 ' +
    'Mobile Safari/537.3';

  private readonly selector = {
    login: 'input[name="username"]',
    password: 'input[name="password"]',
    connectButton: '//div[contains(text(), "Connexion")]/parent::button',
    doNotSaveCredentials: '//button[contains(text(), "Plus tard")]',
    inputFile: 'input[type="file"]',
    newPost: 'span[aria-label="Nouvelle publication"',
    next: '//button[contains(text(), "Suivant")]',
    textarea: 'textarea',
    shareButton: '//button[contains(text(), "Partager")]',
    publishConfirmation: '//p[contains(text(), "Votre photo a été publiée.")]',
  };

  private readonly locals = ['fr-FR', 'fr'];

  private readonly url: string;
  private readonly username: string;
  private readonly password: string;
  private logged: boolean = false;
  private browser: Browser;
  private page: Page;

  constructor() {
    super();
    this.url = config.get('publishers.instagram.url');
    this.username = config.get('publishers.instagram.username');
    this.password = config.get('publishers.instagram.password');
  }

  private async initCrawler(): Promise<void> {
    this.browser = this.browser || await puppeteer.launch({
      args: ['--lang=' + this.locals.join(',')],
    });

    this.page = this.page || await this.browser.newPage();
    await this.page.setUserAgent(this.userAgent);
  }

  private async login(): Promise<void> {
    if (this.logged) {
      await this.page.goto(this.url);
      return;
    }

    await this.page.goto(this.url + '/accounts/login');
    await this.page.waitForSelector(this.selector.login);

    const usernameInput = await this.page.$(this.selector.login);
    await usernameInput.type(this.username);

    const passwordInput = await this.page.$(this.selector.password);
    await passwordInput.type(this.password);

    await this.page.waitFor(1000);

    const [connectButton] = await this.page.$x(this.selector.connectButton);
    await connectButton.click();

    const doNotSaveCredentials = await this.page.waitForXPath(this.selector.doNotSaveCredentials);
    await doNotSaveCredentials.click();

    await this.page.waitForSelector(this.selector.newPost);
    this.logged = true;
  }

  public async post(message: string, event: FFMEEvent): Promise<boolean> {
    if (!event.mediaUrl) {
      console.log(
        chalk.yellow(`L'evénement ${event.title} ne sera pas publié sur Instagram car il ne possède pas de média.`),
      );

      return false;
    }

    const filePath = await downloadMedia(event.mediaUrl);

    await this.initCrawler();
    await this.login();
    await this.page.click(this.selector.newPost);

    const input = await this.page.$(this.selector.inputFile);
    await input.uploadFile(filePath);

    const nextButton = await this.page.waitForXPath(this.selector.next);
    await nextButton.click();

    const textarea = await this.page.waitForSelector(this.selector.textarea);
    await textarea.type(message);

    const [shareButton] = await this.page.$x(this.selector.shareButton);
    await shareButton.click();

    await this.page.waitForXPath(this.selector.publishConfirmation);
    await deleteFile(filePath);
    return true;
  }
}
