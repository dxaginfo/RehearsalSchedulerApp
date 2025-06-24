require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/rehearsal_scheduler_dev',
    dialect: 'postgres',
    logging: console.log,
  },
  test: {
    url: process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/rehearsal_scheduler_test',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};