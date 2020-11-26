//jshint esversion:7
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuditSchema = new Schema({
  agency: {
    type: String,
    default: "LNP"
  },
  by: String,
  statement: String,
  date: String
});

module.exports = mongoose.model("Audit", AuditSchema);
