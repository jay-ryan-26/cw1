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

// Logger
app.use((req, res, next) => {
  console.log("Req IP: ", req.url);
  console.log("Req Date: ", new Date());
  next();
});

const ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;

// Connect to webstore db
let db;
MongoClient.connect(ConnectionString, (err, client) => {
  db = client.db("webstore");
});

app.use(express.static("public"));
// });

// Display all lessons
app.get("/lessons", (req, res, next) => {
  db.collection("lessons")
    .find({})
    .toArray((e, result) => {
      if (e) return next(e);
      res.send(result);
      console.log("Got Lessons");
    });
});

app.post("/orders", (req, res, next) => {
  db.collection("orders").insertOne(req.body, (e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});

app.get("/lesson/:id", (req, res, next) => {
  // find the object with the given object id
  req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e);
    res.send(result);
  });
});

// update a specific item from a collection (lesson spaces)
app.put("/lessons/:id", (req, res, next) => {
  db.collection("lessons").updateOne(
    { _id: new ObjectID(req.params.id) },
    { $set: req.body },
    { safe: true, multi: false },
    (e, result) => {
      if (e) return next(e);
      res.send(result ? { msg: "success" } : { msg: "error" });
    }
  );
});

app.post("/lessons/:search", (req, res, next) => {
  db.collection("lessons")
    .find({})
    .toArray((e, results) => {
      if (e) return next(e);
      let searchResult = results.filter((item) => {
        return item.subject
          .toLowerCase()
          .match(req.params.search.toLowerCase());
      });
      res.send(searchResult);
    });
});

app.use((req, res, next) => {
  var filePath = path.join(__dirname, "img", req.url);
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
