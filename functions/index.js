const functions = require("firebase-functions");
const express = require('express');
const axios = require('axios');
const app = express();


const databaseURL = "https://cineteca-api-v2-default-rtdb.firebaseio.com";

app.get('/', (request, response) => {
  response.send("Hola mundo");
});

app.get('/test', (request, response) => {
  return axios.put(`${databaseURL}/users/user.json`, {
    username: 'Pepito 1234', 
    password: 'Password1'
  })
    .then((dbResponse) => {
      response.send('termino exitoso');
      console.log(dbResponse);
    })
    .catch((error) => {
      response.send('error');
      console.log(error);
    });
});


exports.app = functions.https.onRequest(app);