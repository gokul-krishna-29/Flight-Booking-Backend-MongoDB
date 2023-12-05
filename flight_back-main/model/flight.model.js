const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Flight = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  from: {
    type: String,
    required: true,
  },
  departureDateTime: {
    type: Date,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  arrivalDateTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currcapacity: {
    type: Number,
    default: 10,
  },
  maxcapacity: {
    type: Number,
    default: 60,
  },
});

module.exports = mongoose.model("Flight", Flight);
