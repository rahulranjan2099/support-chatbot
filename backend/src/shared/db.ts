import { sequelize } from './database';

export async function initDb(): Promise<void> {
  await sequelize.authenticate();
}

export async function closeDb(): Promise<void> {
  await sequelize.close();
}
