import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

function createSequelize(): Sequelize {
  const logging = process.env.SEQUELIZE_LOGGING === 'true' ? console.log : false;
  const dialect = 'postgres';
  const ssl = process.env.DB_SSL === 'true';

  if (process.env.DB_NAME) {
    return new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USERNAME || process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        dialect,
        logging,
        ...(ssl ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } } : {}),
      }
    );
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DB_NAME or DATABASE_URL environment variable is required');
  }

  return new Sequelize(connectionString, {
    dialect,
    logging,
    ...(ssl ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } } : {}),
  });
}

export const sequelize = createSequelize();

export async function closeDatabase(): Promise<void> {
  await sequelize.close();
}
