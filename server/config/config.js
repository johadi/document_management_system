const dotenv = require('dotenv');

dotenv.config();

const config = {
  development: {
    username: 'postgres',
    password: null,
    database: 'docman_dev',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: 'postgres',
    password: null,
    database: 'docman_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false
  }
};
module.exports = config[process.env.NODE_ENV || 'development'];
