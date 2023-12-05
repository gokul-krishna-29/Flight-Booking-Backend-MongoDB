const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    immutable: false,
  },
  flights: [
    {
      name: {
        type: String,
      },
      count: {
        type: Number,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("User", User);
