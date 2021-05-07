const mongoose = require("mongoose");

// Use dotenv to avoid exposing URIs
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Connected to ChatNow database");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = InitiateMongoServer;
