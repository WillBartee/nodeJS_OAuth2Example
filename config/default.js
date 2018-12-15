'use strict';

module.exports = {
  db: {
    suffix: 'nova_users',
    debug: false,
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      charset: 'utf8',
      timezone: 'UTC',
    },
  }
};
