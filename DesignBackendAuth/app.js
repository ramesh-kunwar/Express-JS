require("dotenv").config(); // config do all the configuration written inside ditenv
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Welcome To Homepage.</h1>");
});

// exporting the whole thing with the name of app
module.exports = app;
