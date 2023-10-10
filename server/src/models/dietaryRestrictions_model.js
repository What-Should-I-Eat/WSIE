const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestrictionSchema = new Schema({
    _id: Number,
    name: String,
    restrictions: [String]
});
  
module.exports = mongoose.model('Restriction', RestrictionSchema);