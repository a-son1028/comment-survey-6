const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import mongoose from "mongoose";
import Utils from "../utils";
import MongooseCache from "mongoose-redis";

console.log("process.env.MONGODB_URL", process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,

  poolSize: 100,
  maxPoolSize: 300,
  connectTimeoutMS: 30000
});

mongoose.connection.on("error", err => {
  console.log("Connect MONDGODB ERROR");
  Utils.Logger.error(err);
});

mongoose.set("debug", true);

MongooseCache(mongoose, `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
