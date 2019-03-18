const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const keys = require("./keys");
const path = require("path");

const app = express();

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

const PORT = 5000;

//Configure our app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Configure Mongoose
mongoose.connect(keys.mongo.connection);

require("./models/Notes");

app.use(require("./routes"));

//Static file declaration
app.use(express.static(path.join(__dirname, "client/build")));

//production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  //
  app.get("*", (req, res) => {
    res.sendfile(path.join((__dirname = "client/build/index.html")));
  });
}
//build mode
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/public/index.html"));
});

// YOLO
app.listen(PORT, () => console.log(`RUNNING on ${PORT}`));
