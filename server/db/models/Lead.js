const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  estateType: String,
  fullname: String,
  phone: String,
  email: String,
  region: String,
  district: String,
});

module.exports = mongoose.model('Lead', leadSchema);