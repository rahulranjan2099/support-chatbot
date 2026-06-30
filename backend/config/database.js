require('dotenv').config();

function parseDatabaseUrl(databaseUrl) {
  if (!databaseUrl) {
    return {};
  }

  const parsed = new URL(databaseUrl);
  return {
    database: parsed.pathname.replace(/^\//, ''),
    username: decodeURIComponent(parsed.username),
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : undefined,
    ssl: parsed.searchParams.get('sslmode') === 'require',
  };
}

function getConfig(databaseName) {
  const urlConfig = parseDatabaseUrl(process.env.DATABASE_URL);
  const dialect = process.env.DB_DIALECT || 'postgres';
  const database = databaseName || process.env.DB_NAME || urlConfig.database;
  const username = process.env.DB_USERNAME || process.env.DB_USER || urlConfig.username;
  const password = process.env.DB_PASSWORD ?? urlConfig.password ?? null;
  const host = process.env.DB_HOST || urlConfig.host || 'localhost';
  const port = Number(process.env.DB_PORT || urlConfig.port || 5432);
  const ssl = process.env.DB_SSL === 'true' || Boolean(urlConfig.ssl);

  if (!database) {
    throw new Error('DB_NAME or DATABASE_URL is required for Sequelize CLI');
  }

  if (!username) {
    throw new Error('DB_USERNAME, DB_USER, or DATABASE_URL username is required for Sequelize CLI');
  }

  return {
    username,
    password,
    database,
    host,
    port,
    dialect,
    logging: process.env.SEQUELIZE_LOGGING === 'true' ? console.log : false,
    ...(ssl ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } } : {}),
  };
}

const development = getConfig();

module.exports = {
  development,
  test: getConfig(process.env.DB_TEST_NAME || `${development.database}_test`),
  production: getConfig(),
};
