const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const MD5 = require("crypto-js/md5");
const cors = require("cors");

const app = express();
app.use(cors());

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

app.get("/get-all-images", (request, response) => {
  return axios
    .get(`${databaseURL}/images.json`)
    .then((dbResponse) => {
      response.send({ ...dbResponse.data });
      console.log(dbResponse);
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
      response.status(200).send({
        status: 200
      });
    })
    .catch((error) => {
      response.send("error");
      console.log(error);
    });
});

exports.app = functions.https.onRequest(app);
