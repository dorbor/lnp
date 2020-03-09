//jshint esversion:7
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  agency: {
    type: String,
    default: "LNP"
  },
  fullName: String,
  email: String,
  image: String,
  password: String,
  role: String,
  status: String
});

module.exports = mongoose.model("User", UserSchema);
