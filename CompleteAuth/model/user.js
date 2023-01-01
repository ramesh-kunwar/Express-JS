const mongoose = require("mongoose");

const userSchema = new mongoose.userSchema({
  firstname: {
    type: String,
    defaultt: null,
  },
  lastname: {
    type: String,
    defaultt: null,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
