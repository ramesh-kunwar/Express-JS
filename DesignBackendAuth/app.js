require("dotenv").config(); // config do all the configuration written inside ditenv
const express = require("express");

//  importing User
const User = require("./model/user");
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Welcome To Homepage.</h1>");
});

app.post("/signup", async (req, res) => {
  // we are using post because we are sending the data
  //  get all the information
  const { firstname, lastname, email, password } = req.body; // all the details are coming from req.body

  // check if the data are entered or not
  if (!(email && password && firstname && lastname)) {
    res.status(400).send("All the fields are required.");
  }

  // check if mail is unique or not
  // here to check unique email it has to go to database - it takes time so use async await
  const extuser = await User.findOne(email); // User is from User model
  if (extusr) {
    res.status(400).send("User Already Exist");
  }

  // Password (use bcrypt to encrypt the password)
});

// exporting the whole thing with the name of app
module.exports = app;
