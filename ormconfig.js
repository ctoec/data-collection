module.exports = {
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    // https://github.com/tediousjs/node-mssql#6x-to-7x-changes-pre-release
    trustServerCertificate: true,
  },
  username: process.env.DB_USER || 'SA',
  password: process.env.DB_PASSWORD || 'TestPassword1',

  type: 'mssql',
  database: process.env.DB_NAME || 'master',
  synchronize: false,
  migrationsRun: true,
  // logging: true,
  entities: ['dist/src/entity/**/*.js'],
  migrations: ['dist/src/migration/*.js'],
  subscribers: ['dist/src/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
