const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _googleID: String,
  _fourtytwoID: String,
  _twitterID: String,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  heartbeat: [{ id: String }],
  recents: [{ id: String }],
  inProgress: [{ id: String }],
  avatar: String,
  cover: String,
  birthdate: String,
  age: String,
  gender: String,
  language: String,
  email: String,
  phone: String,
  city: String,
  country: String,
  verified: Boolean,
  confirmKey: String,
  forgotKey: String,
  created_at: Date,
  updated_at: Date
});

UserSchema.pre('save', function(next) {
	const currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.created_at)
		this.created_at = currentDate;
	next();
});

UserSchema.methods.validPassword = function(password) {
  return (password === this.password);
  // return (bcrypt.compare(password, UserSchema.password));
};

UserSchema.methods.isMailConfirmed = function() {
  return (this.confirmKey === 'confirmed');
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
