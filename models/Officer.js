//jshint esversion:7
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OfficerSchema = new Schema({
  agency: {
    type: String,
    default: "LNP",
  },
  id: String,
  firstName: String,
  lastName: String,
  image: String,
  assignment: String,
  middleName: String,
  email: String,
  phone: String,
  phone1: String,
  gender: String,
  department: String,
  division: String,
  position: String,
  section: String,
  status: String,
});

module.exports = mongoose.model("Officer", OfficerSchema);
