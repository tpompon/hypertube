const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
  created_at: Date,
  updated_at: Date
});

UserSchema.pre('save', (next) => {
	const currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.created_at)
		this.created_at = currentDate;
	next();
});

UserSchema.methods.validPassword = function(password) {
  return (this.password === password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
