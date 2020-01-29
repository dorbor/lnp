//jshint esversion:7
const mongoose = require('mongoose');

const Officer = mongoose.model('Officer', {
agency: {
    type: String,
    required: true,
    trim: true
},
  id: {
    type: String,
    unique: true,
    required: true,
    trim: true
    },
  firstName: String,
  lastName: String,
  image: String,
  middleName: String,
  email: String,
  gender: String,
  department: String,
  division: String,
  position: String,
  section: String,
  status: String,
});

module.exports = Officer;