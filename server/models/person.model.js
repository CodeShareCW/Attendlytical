const { model, Schema } = require('mongoose');

const personSchema = new Schema({
  googleID: { type: String },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cardID: {
    type: String,
    required: true,
  },
  profilePictureURL: {
    type: String,
  },
  profilePicturePublicID: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  userLevel: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: new Date(0, 0, 0),
  },
});

module.exports = model('Person', personSchema);
