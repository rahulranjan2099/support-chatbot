import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

function createSequelize(): Sequelize {
  const logging =
    process.env.SEQUELIZE_LOGGING === 'true' ? console.log : false;
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  return new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging,
    dialectOptions: {
      connectionTimeoutMillis: 15000,
      ...(databaseUrl.includes('sslmode=require') || process.env.DB_SSL === 'true'
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {}),
    },
  });
}

export const sequelize = createSequelize();

export async function closeDatabase(): Promise<void> {
  await sequelize.close();
}
