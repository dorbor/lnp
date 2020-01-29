//jshint esversion:7
const mongoose = require('mongoose');

const Comment = mongoose.model('Comment', {
    officerId: { type: String, required: true, trim: true },
    type: String,
    agency: String,
    fullName: String,
    number: String,
    email: String,
    content: String,
    county: String,
    latitude: String,
    longitude: String,
});

module.exports = Comment;