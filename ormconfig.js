module.exports = {
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT) || 1433,
  username: process.env.DB_USER || 'SA',
  password: process.env.DB_PASSWORD || 'TestPassword1',

  type: 'mssql',
  database: process.env.DB_NAME || 'master',
  synchronize: false,
  migrationsRun: true,
  entities: ['dist/src/entity/**/*.js'],
  migrations: ['dist/src/migration/*.js'],
  subscribers: ['dist/src/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
