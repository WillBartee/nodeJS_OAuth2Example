'use strict';

const accessTokenDBHelper = require('../databaseHelpers/accessTokensDBHelper');
const userDBHelper = require('../databaseHelpers/userDBHelper');

// sends a response created out of the specified parameters to the client.
// The typeOfCall is the purpose of the client's api call
function sendResponse (res, message, error) {
  if (error) {
    message = !message ?
      error.stack ?
        error.stack.split('\n').toString() :
        error.toString() :
      '';
  }
  res
    .status(error !== null ? error !== null ? 400 : 200 : 400)
    .json({ message, error });
}

class AuthController {

  static login(registerUserQuery, res) {
    
  }

  /* handles the api call to register the user and insert them into the users table.
    The req body should contain a username and password. */
  static registerUser(req, res) {
    console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);

    const username = req.body.username;
    const password = req.body.password;

    //query db to see if the user exists already
    return userDBHelper.doesUserExist(username)
      .then(userExist => {
        // check if the user exists
        if (userExist) {
          throw 'Username exists in the database'// this should have thrown an error
        } else { // register the user in the db
          return userDBHelper.registerUserInDB(username, password)
        }
      })
      .then(dataResponseObject => {
        console.log('dataResponseObject', dataResponseObject);
        sendResponse(res, 'Registration was successful')
      })
      .catch(err => sendResponse(res, '', err));
  }
}

module.exports = AuthController;
