const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactUsSchema = new Schema({
  id: Number,
  full_name: String,
  email: String,
  message: String
});

module.exports = mongoose.model('ContactUs', ContactUsSchema);