require("./config/database").connect();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// import model - User
const User = require("./model/user");

const app = express();
// app.use() is a middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("<h1> Hello auth system </h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    // validate the data, if exists
    if (!(firstname && lastname && email && password)) {
      res.status(400).send("All the fields are required");
    }
    // check if email is in correct format

    // check if user exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).send("User already found in database.");
    }

    // encrypt the password
    const myEnnyPassword = await bcrypt.hash(password, 10);

    // create a new enrty in database.
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: myEnnyPassword,
    });

    // create a token and send it to the user
   const token =  jwt.sign(
      {
        id: user._id,
      },
      "shhhhh",
      { expiresIn: "2h" }
    );
  } catch (error) {
    console.log(error);
  }
});
