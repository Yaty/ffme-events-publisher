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

interface Wordpress extends Publisher {
  apiUrl: string;
  username: string;
  password: string;
}

interface Facebook extends Publisher {
  apiUrl: string;
  accessToken: string;
  pageId: string;
}

interface Instagram extends Publisher {
  url: string;
  username: string;
  password: string;
}

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
      apiUrl: 'https://escalade-normandie.com/wp-json',
      username: process.env.WORDPRESS_USERNAME,
      password: process.env.WORDPRESS_PASSWORD,
      formations: {
        publishOnDays: [60],
      },
      competitions: {
        publishOnDays: [14],
      },
      stages: {
        publishOnDays: [60],
      },
    },
    facebook: {
      apiUrl: 'https://graph.facebook.com',
      accessToken: process.env.FB_ACCESS_TOKEN,
      pageId: process.env.FB_PAGE_ID,
      formations: {
        publishOnDays: [30, 60],
      },
      competitions: {
        publishOnDays: [7, 30],
      },
      stages: {
        publishOnDays: [30, 60],
      },
    },
    instagram: {
      url: 'https://www.instagram.com',
      username: process.env.INSTAGRAM_USERNAME,
      password: process.env.INSTAGRAM_PASSWORD,
      formations: {
        publishOnDays: [30, 60],
      },
      competitions: {
        publishOnDays: [7, 30],
      },
      stages: {
        publishOnDays: [30, 60],
      },
    },
  },
};

export default config;
