const mongoose = require("mongoose");

const connectToDb = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB!");
  } catch (error) {
    console.log("Error connecting mongo: ", error.message);
  }
};

module.exports = { connectToDb };
