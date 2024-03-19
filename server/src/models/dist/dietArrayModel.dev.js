"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var dietArraySchema = new _mongoose.Schema({
  diets: [String]
});
var DietArray = (0, _mongoose.model)('DietArray', dietArraySchema);
var _default = DietArray;
exports["default"] = _default;