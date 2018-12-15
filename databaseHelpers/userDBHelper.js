'use strict';

const uuidv4 = require('uuid/v4');
const Model = require('objection').Model;

module.exports = class User extends Model {
  /**
    CREATE TABLE `users` (
      `id` varchar(36) NOT NULL,
      `username` varchar(50) DEFAULT NULL,
      `user_password` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`id`)
    )
  */

  static get tableName() {
    return 'users';
  }

  /**
   * attempts to register a user in the DB with the specified details.
   * it provides the results in the specified callback which takes a
   * DataResponseObject as its only parameter
   *
   * @param username
   * @param password
   */
  static registerUserInDB(username, password){
    let id = uuidv4();
    return this.query().insert({
      id, username, user_password: this.knex().raw(`SHA('${password}')`)
    });
  }

  /**
   * Gets the user with the specified username and password.
   * It provides the results in a callback which takes an:
   * an error object which will be set to null if there is no error.
   * and a user object which will be null if there is no user
   *
   * @param username
   * @param password
   */
  static getUserFromCrentials(username, password) {
    return this.query().findOne({
      username,
      user_password: this.knex().raw(`SHA('${password}')`)
    });
  }

  /**
   * Determines whether or not user with the specified userName exists.
   * It provides the results in a callback which takes 2 parameters:
   * an error object which will be set to null if there is no error, and
   * secondly a boolean value which says whether or the user exists.
   * The boolean value is set to true if the user exists else it's set
   * to false or it will be null if the results object is null.
   *
   * @param username
   */
  static doesUserExist(username) {
    return this.query().findOne({
      username
    }).then(exists => !!(exists))
  }
};
