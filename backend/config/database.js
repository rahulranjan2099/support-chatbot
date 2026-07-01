require('dotenv').config();

function getConfig(databaseUrl) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Sequelize CLI');
  }

  return {
    url: databaseUrl,
    dialect: 'postgres',
    logging: process.env.SEQUELIZE_LOGGING === 'true' ? console.log : false,
    dialectOptions: {
      connectionTimeoutMillis: 15000,
      ...(databaseUrl.includes('sslmode=require') || process.env.DB_SSL === 'true'
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {}),
    },
  };
}

module.exports = {
  development: getConfig(process.env.DATABASE_URL),
  test: getConfig(process.env.DB_TEST_URL || process.env.DATABASE_URL),
  production: getConfig(process.env.DATABASE_URL),
};
