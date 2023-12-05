const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Admin = Schema({
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
    default: true,
    immutable: true,
  },
  flights: [
    {
      name: {
        type: String,
        required: true,
      },
      count: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("Admin", Admin);
