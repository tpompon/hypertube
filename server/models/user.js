const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  firstname: { type: String, required: true, minlength: 2, maxlength: 35 },
  lastname: { type: String, required: true, minlength: 2, maxlength: 35 },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    // match: [
    //   /[a-zA-Z0-9]/,
    //   // /^[a-zA-Z0-9\.\-_!@#\$%\^&\*]$/,
    //   "Password must be at least 8 characters long and contain at least one alphanumeric character, one digit and one of -_!@#$%^&*"
    // ],
    minlength: 8,
    maxlength: 20
  },
  heartbeat: [{ id: String }],
  recents: [{ id: String }],
  inProgress: [{ id: String }],
  avatar: {
    type: String,
    default: "http://localhost:4001/public/avatars/afortin_def.jpg"
  },
  cover: String,
  birthdate: String,
  age: String,
  gender: String,
  language: String,
  email: String,
  phone: String,
  city: String,
  country: String,
  // verified: Boolean,
  created_at: Date,
  updated_at: Date
});

UserSchema.pre("save", next => {
  const currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) this.created_at = currentDate;
  next();
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
