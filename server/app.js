const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const routes = require('./routes');

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection (ingredients and restrictions)
mongoose.connect('mongodb://db:27017/WSIE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//test
app.get("/", (req, res) => {
  res.json({ msg: "data goes here" });
});

app.use('/api/v1', routes);

module.exports = app;