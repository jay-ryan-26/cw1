const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const app = express();
const Port = process.env.PORT;
const cors = require("cors");
const ConnectionString = process.env.CONNECTION_STRING;
app.use(express.json());
app.set("port", Port);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(cors());

app.use((req, res, next) => {
  console.log("Req IP: ", req.url);
  console.log("Req Date: ", new Date());
  next();
});

const ObjectID = require("mongodb").ObjectId;
const MongoClient = require("mongodb").MongoClient;

let db;
MongoClient.connect(ConnectionString, (err, client) => {
  // mongo = client;
  db = client.db("webstore");
});

app.use(express.static("public"));

app.get("/lessons", (req, res, next) => {
  db.collection("lessons")
    .find({})
    .toArray((e, result) => {
      if (e) return next(e);
      res.send(result);
      console.log("Got Lessons");
    });
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

app.listen(Port, () => {
  console.log(`app on port: localhost:${Port}`);
});
