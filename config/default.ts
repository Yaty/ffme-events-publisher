interface Event {
  publishOnDays: number[];
}

// tslint:disable-next-line:no-empty-interface
interface Formation extends Event {}

// tslint:disable-next-line:no-empty-interface
interface Competition extends Event {}

// tslint:disable-next-line:no-empty-interface
interface Stage extends Event {}

interface Publisher {
  formations: Formation;
  competitions: Competition;
  stages: Stage;
}

// tslint:disable-next-line:no-empty-interface
interface Wordpress extends Publisher {}

interface Facebook extends Publisher {
  uri: string;
  accessToken: string;
  pageId: string;
}

// tslint:disable-next-line:no-empty-interface
interface Instagram extends Publisher {}

interface Config {
  ffme: {
    credentials: {
      login: string;
      password: string;
    },
    intranetUrl: string;
  };
  publishers: {
    wordpress: Wordpress;
    facebook: Facebook;
    instagram: Instagram;
  };
}

const config: Config = {
  ffme: {
    credentials: {
      login: process.env.FFME_LOGIN,
      password: process.env.FFME_PASSWORD,
    },
    intranetUrl: 'https://www.montagne-escalade.com',
  },
  publishers: {
    wordpress: {
      formations: {
        publishOnDays: [],
      },
      competitions: {
        publishOnDays: [],
      },
      stages: {
        publishOnDays: [],
      },
    },
    facebook: {
      uri: 'https://graph.facebook.com',
      accessToken: process.env.FB_ACCESS_TOKEN,
      pageId: process.env.FB_PAGE_ID,
      formations: {
        publishOnDays: [],
      },
      competitions: {
        publishOnDays: [],
      },
      stages: {
        publishOnDays: [],
      },
    },
    instagram: {
      formations: {
        publishOnDays: [],
      },
      competitions: {
        publishOnDays: [],
      },
      stages: {
        publishOnDays: [],
      },
    },
  },
};

export default config;
