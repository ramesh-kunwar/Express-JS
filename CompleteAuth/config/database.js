const mongoose = require("mongoose");

const MONGODB_URL = "something";
exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(console.log("DB connected with success"))
    .catch((err) => {
      console.log("DB CONNECTION failed");
      console.log(error);
      process.exit(1);
    });
};
