'use strict';

const config = require('config');
const secret = require(__dirname+'/secrets');

class Knexfile {
  /*
  * These functions are named to explicitly represent the allowed environments for knex
  */
  static get development() { return Knexfile.get(); }
  static get jenkins1() { return Knexfile.get(); }
  static get jenkins2() { return Knexfile.get(); }
  static get prod() { return Knexfile.get(); }
  static get sandbox() { return Knexfile.get(); }
  static get stage() { return Knexfile.get(); }
  static get test() { return Knexfile.get(); }
  static get beta() { return Knexfile.get(); }

  /**
  * This determines the database connection values base on
  * the NODE_ENV environment variable or requested environemnt.
  */
  static get() {
    // Get the base connection information using the `config` module methodology.
    let dbConfig = config.util.cloneDeep(config.get('db'));

    // Get the value for the requested environment. Should mimic the `config` module.
    let env = config.util.getEnv('NODE_ENV'); // defaults for 'development';


    // Set the user and database names based on the environment
    dbConfig.connection.user = `${env}_user`;
    dbConfig.connection.database = `${env}_${dbConfig.suffix}`;

    // Print out the information about the connection being used.
    console.log('Using Knex Configuration:\n', dbConfig);

    // Set the password based on the environment from the secrets file.
    dbConfig.connection.password = secret[`${env}_sql_password`];

    return dbConfig;
  }
}

module.exports = Knexfile;
