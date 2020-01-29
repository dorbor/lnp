//jshint esversion:7
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    agency: String,
    fullName: String,
    email: String,
    password: String,
    status: String
});

module.exports = mongoose.model('User', UserSchema);