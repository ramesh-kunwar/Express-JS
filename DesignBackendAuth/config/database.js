const mongoose = require("mongoose");

// here we are connecting the database
// to connect to database you need to have a URL (declare it in .env file)

const { MONGO_URL } = process.env;

exports.connect = () => {
  mongoose.connect = (MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(console.log("DB connection success"))
    .catch((err) => {
      console.log(` DB connection failed`);
      console.log(error);
      process.exit(1);
    });
};
