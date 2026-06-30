require('dotenv').config();

const { Client } = require('pg');

function parseDatabaseUrl(databaseUrl) {
  if (!databaseUrl) {
    return {};
  }

  const parsed = new URL(databaseUrl);
  return {
    database: parsed.pathname.replace(/^\//, ''),
    user: decodeURIComponent(parsed.username),
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : undefined,
    ssl: parsed.searchParams.get('sslmode') === 'require',
  };
}

function quoteIdentifier(identifier) {
  return `"${identifier.replace(/"/g, '""')}"`;
}

function getDatabaseConfig() {
  const urlConfig = parseDatabaseUrl(process.env.DATABASE_URL);
  const database = process.env.DB_NAME || urlConfig.database;
  const user = process.env.DB_USERNAME || process.env.DB_USER || urlConfig.user;
  const password = process.env.DB_PASSWORD ?? urlConfig.password;
  const host = process.env.DB_HOST || urlConfig.host || 'localhost';
  const port = Number(process.env.DB_PORT || urlConfig.port || 5432);
  const ssl = process.env.DB_SSL === 'true' || Boolean(urlConfig.ssl);

  if (!database) {
    throw new Error('DB_NAME or DATABASE_URL is required');
  }

  if (!user) {
    throw new Error('DB_USERNAME, DB_USER, or DATABASE_URL username is required');
  }

  return {
    database,
    user,
    password,
    host,
    port,
    ssl: ssl ? { rejectUnauthorized: false } : undefined,
    maintenanceDatabase: process.env.DB_MAINTENANCE_DATABASE || 'postgres',
  };
}

async function ensureDatabase() {
  const config = getDatabaseConfig();
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.maintenanceDatabase,
    ssl: config.ssl,
  });

  await client.connect();

  try {
    const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [config.database]);
    if (result.rowCount > 0) {
      console.log(`Database "${config.database}" already exists`);
      return;
    }

    await client.query(`CREATE DATABASE ${quoteIdentifier(config.database)}`);
    console.log(`Database "${config.database}" created`);
  } finally {
    await client.end();
  }
}

ensureDatabase().catch((error) => {
  console.error('Failed to ensure database exists:', error);
  process.exit(1);
});
