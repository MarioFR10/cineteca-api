
const functions = require("firebase-functions");
const express = require('express');
const sql = require('mssql');
const app = express();

const config = {
  user: process.env.DB_USER || 'Cineteca',
  password: process.env.DB_PASSWORD || '1234',
  server: process.env.DB_SERVER || 'DESKTOP-MCI75IP',
  database: process.env.DB_DATABASE || 'cineteca',
}

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// Call the connectToDatabase function to establish the connection
connectToDatabase();

app.get("/test-db-connection", async (request, response) => {
  try {
    // Query the database (you can replace this with your own query)
    const result = await sql.query`SELECT 'Database connection test successful' AS message`;

    // Send the query result as a response
    response.json(result.recordset);
  } catch (error) {
    console.error("Error testing database connection:", error);
    response.status(500).json({ error: "Error testing database connection" });
  }
});

app.get('/', (request, response) => { 
  response.send("Hola mundo nuevos");
});

app.get('/test', (request, response) => { 
  response.send("Esto es un test");
});

app.post('/test', (request, response) => { 
  response.send("Esto es un test");
});


exports.app = functions.https.onRequest(app);