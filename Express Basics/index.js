const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.status(200).send("<h1> Hello, Server Started (Success) </h1>");
});
app.get("/ramesh", (req, res) => {
  res.send("Hello Ramesh");
});
app.get("/insta", (req, res) => {
  const insta = {
    userName: "Ramesh Kunwar",
    followers: 300,
    following: 300,
  };
  res.status(200).jsonp(insta);
});
app.get("/features", (req, res) => {
  res.send("This is a feature section");
});
app.get("/v1/twitter", (req, res) => {
  const twitter = {
    userName: "Ramesh",
    followers: 500,
    following: 400,
  };
  res.status(200).jsonp(twitter);
});

// route params
app.get("/user/:userId/", (req, res) => {
  res.status(200).jsonp({ pram: req.params.userId });
});
app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
