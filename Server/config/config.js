require('dotenv').config();

const config = {
  development: {
    dialect: 'postgres',
    dialectModule: require('pg'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      sslmode: 'require'
    },
    seederStorage: 'sequelize',
    seederStorageTableName: 'seeders',
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'migrations'
  },
  test: {
    dialect: 'postgres',
    dialectModule: require('pg'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      sslmode: 'require'
    },
    seederStorage: 'sequelize',
    seederStorageTableName: 'seeders',
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'migrations'
  },
  production: {
    dialect: 'postgres',
    dialectModule: require('pg'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      sslmode: 'require'
    },
    seederStorage: 'sequelize',
    seederStorageTableName: 'seeders',
    migrationStorage: 'sequelize',
    migrationStorageTableName: 'migrations'
  }
};

module.exports = config;
