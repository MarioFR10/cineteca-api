const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const MD5 = require("crypto-js/md5");

const app = express();
const databaseURL = "https://cineteca-api-v2-default-rtdb.firebaseio.com";

app.get("/", (request, response) => {
  response.send("Server running");
});

app.post("/login", (request, response) => {
  const { username, password } = request.body;

  const encrypted = MD5(`${username}_${password}`).toString();

  return axios
    .get(`${databaseURL}/users/${encrypted}.json`)
    .then((dbResponse) => {
      if (dbResponse.data) {
        response.status(200).send({
          status: 200,
          isRegistered: true,
        });

        return;
      }

      response.status(404).send({
        status: 404,
        isRegistered: false,
      });
    })
    .catch((error) => {
      response.send("error");
      console.log(error);
    });
});

app.post("/register-user", (request, response) => {
  const { username, password } = request.body;

  const encrypted = MD5(`${username}_${password}`).toString();

  return axios
    .put(`${databaseURL}/users/${encrypted}.json`, {
      username,
      password,
    })
    .then(() => {
      response.send("termino exitoso");
    })
    .catch((error) => {
      response.send("error");
      console.log(error);
    });
});

app.post("/upload-image", (request, response) => {
  const { uuid, base64Image } = request.body;

  return axios
    .put(`${databaseURL}/images/${uuid}.json`, {
      base64Image,
    })
    .then(() => {
      response.send("termino exitoso");
    })
    .catch((error) => {
      response.send("error");
      console.log(error);
    });
});

exports.app = functions.https.onRequest(app);
