
const functions = require("firebase-functions");
const express = require('express');
const app = express();

app.get('/', (request, response) => { 
  response.send("Hola mundo nuevo");
});

app.get('/test', (request, response) => { 
  response.send("Esto es un test");
});

app.post('/test', (request, response) => { 
  response.send("Esto es un test");
});


exports.app = functions.https.onRequest(app);