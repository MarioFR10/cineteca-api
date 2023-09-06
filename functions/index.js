import * as functions from "firebase-functions";
import express from "express";

import { createImage } from "./database/requests/createImage";

const app = express();

app.get("/", (request, response) => {
  response.send("Hola mundo");
});

app.get("/test", (request, response) => {
  return createImage();
});

exports.app = functions.https.onRequest(app);
