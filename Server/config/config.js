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
    // same configuration as development
  },
  production: {
    // same configuration as development
  }
};

module.exports = config;
