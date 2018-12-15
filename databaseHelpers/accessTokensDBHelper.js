'use strict';

const Model = require('objection').Model;

class AccessTokens extends Model {
  /**
    CREATE TABLE `access_tokens` (
    `user_id` varchar(36) DEFAULT NULL,
    `access_token` varchar(255) DEFAULT NULL
    )
  */
  static get tableName() {
    return 'access_tokens';
  }

  /**
   * Saves the accessToken against the user with the specified userID
   * It provides the results in a callback which takes 2 parameters:
   *
   * @param accessToken
   * @param userID
   */
  static saveAccessToken(accessToken, userID) {
    return this.query().findOne({ user_id: userID })
      .then(exists => exists
        ? this.query().insert({ access_token: accessToken, user_id: userID })
        : this.query().update({ access_token: accessToken }).where({ user_id: userID })
      );
  }

  /**
   * Retrieves the userID from the row which has the spcecified bearerToken. It passes the userID
   * to the callback if it has been retrieved else it passes null
   *
   * @param bearerToken
   */
  static getUserIDFromBearerToken(bearerToken, callback){
    return this.query().findOne({ access_token: bearerToken })
      .then(exists => exists
        ? exists.user_id
        : null
      )
  }
}

module.exports = AccessTokens
