const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const crypto = require("crypto-js");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json({ limit: "500mb" }));
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection string

const mongoURI =
  "mongodb+srv://Sebas1498:1234@cineteca.fqyv7wo.mongodb.net/?retryWrites=true&w=majority";

app.get("/", (request, response) => {
  response.send("Server running");
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;

  // Connect to MongoDB Atlas using the connection string
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();

    const db = client.db("Cineteca");
    const usersCollection = db.collection("Users");

    // Check if the user exists in the MongoDB collection
    const user = await usersCollection.findOne({ username });

    if (user.password == password) {
      response.status(200).send({
        status: 200,
        isRegistered: true,
      });
    } else {
      response.status(404).send({
        status: 404,
        isRegistered: false,
      });
    }
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.post("/register-user", async (request, response) => {
  const { username, password } = request.body;

  // Connect to MongoDB Atlas using the connection string
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();

    const db = client.db("Cineteca");
    const usersCollection = db.collection("Users");

    // Check if the user already exists in the MongoDB collection
    //const existingUser = await usersCollection.findOne({ username });

    //if (existingUser) {
    //response.status(409).send({
    //status: 409,
    //message: "User already exists",
    //});
    // } else {
    // Insert the new user into the MongoDB collection
    await usersCollection.insertOne({ username, password });

    response.status(200).send({
      status: 200,
      message: "User registered successfully",
    });
    //}
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.get("/get-all-images", async (request, response) => {
  // Connect to MongoDB Atlas using the connection string
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();

    const db = client.db("Cineteca");
    const imagesCollection = db.collection("images");

    // Retrieve all images from the MongoDB collection
    const images = await imagesCollection.find().toArray();

    response.status(200).json(images);
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.get("/get-all-videos", async (request, response) => {
  // Connect to MongoDB Atlas using the connection string
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();

    const db = client.db("Cineteca");
    const videoCollection = db.collection("videos");

    // Retrieve all images from the MongoDB collection
    const video = await videoCollection.find().toArray();

    response.status(200).json(video);
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.post("/delete-image", async (request, response) => {
  const { uuid } = request.body;
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();

    const db = client.db("Cineteca");
    const imagesCollection = db.collection("images");

    await imagesCollection.findOneAndDelete({ uuid });

    response.status(200).send({
      status: 200,
      message: "Image deleted successfully",
    });
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.post("/upload-image", async (request, response) => {
  const { uuid, base64Image } = request.body;

  // Connect to MongoDB Atlas using the connection string
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();

    const db = client.db("Cineteca");
    const imagesCollection = db.collection("images");

    // Insert the image into the MongoDB collection
    await imagesCollection.insertOne({ uuid, base64Image });

    response.status(200).send({
      status: 200,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.post("/delete-video", async (request, response) => {
  const { uuid } = request.body;
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();

    const db = client.db("Cineteca");
    const videosCollection = db.collection("videos");

    await videosCollection.findOneAndDelete({ uuid });

    response.status(200).send({
      status: 200,
      message: "Video deleted successfully",
    });
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.post("/upload-video", async (request, response) => {
  const { uuid, base64Image } = request.body;
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();

    const db = client.db("Cineteca");
    const videoCollection = db.collection("videos");

    await videoCollection.insertOne({ uuid, base64Image });

    response.status(200).send({
      status: 200,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.put("/modificar-usuario", async (request, response) => {
  const { user, password } = request.body;
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();

    const db = client.db("Cineteca");
    const usersCollection = db.collection("Users");

    const filter = { username: user };

    const updateDocument = {
      $set: {
        password: password,
      },
    };

    const result = await usersCollection.updateOne(filter, updateDocument);
    response.status(200).send({
      status: 200,
      isModified: true,
    });
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.get("/get-all-material", async (request, response) => {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    const db = client.db("Cineteca");
    const materialCollection = db.collection("material");
    const material = await materialCollection.find().toArray();

    response.status(200).json(material);
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.post("/upload-material", async (request, response) => {
  const { uuid, title, url, base64Icon } = request.body;
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();

    const db = client.db("Cineteca");
    const materialCollection = db.collection("material");
    await materialCollection.insertOne({ uuid, title, url, base64Icon });

    response.status(200).send({
      status: 200,
      message: "Uploaded successfully",
    });
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

app.post("/delete-material", async (request, response) => {
  const { uuid } = request.body;
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();

    const db = client.db("Cineteca");
    const materialCollection = db.collection("material");

    await materialCollection.findOneAndDelete({ uuid });

    response.status(200).send({
      status: 200,
      message: "Material deleted successfully",
    });
  } catch (error) {
    response.status(500).send("error");
    console.error(error);
  } finally {
    await client.close();
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
