const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const config = require("../configurations/config");

const connectDB = () => {
  const result = mongoose.connect(config.DB_CONNECTION_URL, {
    useNewUrlParser: true,
  });

  return result;
};

module.exports = connectDB;
