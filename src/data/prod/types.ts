export type Config = {
  app: {
    db: DBConnectionOpts;
  };

  wingedKeys: {
    db: DBConnectionOpts;
    site: SiteConnectionOpts;
    passwordFile?: string;
  };

  orgFile: string;
  siteFile: string;
  userFile: string;
  reportingPeriodFile: string;
};

export type SiteConnectionOpts = {
  url: string;
  user: string;
  password: string;
};

export type DBConnectionOpts = {
  server: string;
  port: number;
  user: string;
  password: string;
};
