'use strict';

const port = 8080

/**
 * Create the knex singletom and bind it to the objection models
 */
const knexfile = require('./knexfile').get();
const knex = require('knex')(knexfile);
const Model = require('objection').Model;
Model.knex(knex);

const oAuthModel = require('./authorisation/accessTokenModel');
const oAuth2Server = require('node-oauth2-server')
const express = require('express')
const expressApp = express()
expressApp.oauth = oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
})


const bodyParser = require('body-parser')

//MARK: --- REQUIRE MODULES

//MARK: --- INITIALISE MIDDLEWARE & ROUTES

//set the bodyParser to parse the urlencoded post data
expressApp.use(bodyParser.urlencoded({ extended: true }));

//set the oAuth errorHandler
expressApp.use(expressApp.oauth.errorHandler());

//set the authRoutes for registration and & login requests
expressApp.use('/auth', (() => {

  const router = express.Router();
  const authRoutesMethods = require('./authorisation/authRoutesMethods');

  //route for registering new users
  router.post('/registerUser', authRoutesMethods.registerUser);

  //route for allowing existing users to login
  router.post('/login', expressApp.oauth.grant(), authRoutesMethods.login);

  return router;

})());

//set the restrictedAreaRoutes used to demo the accesiblity or routes that ar OAuth2 protected
expressApp.use('/restrictedArea', (() => {
  const router = express.Router();

  //route for entering into the restricted area.
  router.post('/enter',  expressApp.oauth.authorise(), (req, res) => {
    res.send('You have gained access to the area');
  });

  return router
})());

//MARK: --- INITIALISE MIDDLEWARE & ROUTES

//init the server
expressApp.listen(port, () => {

   console.log(`listening on port ${port}`)
})
