const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const app = express();
const Port = process.env.PORT;
const ConnectionString = process.env.CONNECTION_STRING;

app.use(express.json());
app.set("port", 3000);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
const ObjectID = require("mongodb").ObjectId;
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(ConnectionString, (err, client) => {
  db = client.db("webstore");
});

app.use((req, res, next) => {
  console.log("Req IP: ", req.url);
  console.log("Req Date: ", new Date());
  next();
});

app.use((req, res, next) => {
  var filePath = path.join(__dirname, "static", req.url);
  fs.stat(filePath, (err, fileInfo) => {
    if (err) {
      next();
      return;
    }

    if (fileInfo.isFile()) {
      res.sendFile(filePath);
    } else {
      next;
    }
  });
});

app.use((req, res) => {
  res.status(404);
  res.send("File Not Found!");
});

app.listen(3000, () => {
  console.log("app on port: localhost:3000");
});
