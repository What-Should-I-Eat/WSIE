const mongoose = require('mongoose');

const genericSchema = new mongoose.Schema({
    name: String,
    tags: mongoose.Schema.Types.Mixed
});

const getModel = (collectionName) => {
  return mongoose.model(collectionName, genericSchema);
};

module.exports = getModel;
