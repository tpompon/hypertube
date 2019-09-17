const express = require("express");
const router = express.Router();

const config = require('../config');

// Models
const User = require('../models/user');

router.route('/')
.get((req, res) => {
  User.find({}, (err, users) => {
    if (err)
      res.json({ success: false });
    else
      res.json({ success: true, users: users });
  });
})
.post((req, res) => {
  let avatarFile = 'default_avatar.png'
  if (req.body.avatar)
    avatarFile = req.body.avatar;

	const newUser = User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password,
    avatar: `http://${config.server.host}:${config.server.port}/public/avatars/` + avatarFile,
    cover: 'cinema',
    birthdate: req.body.birthdate,
    age: req.body.age,
    gender: req.body.gender,
    language: req.body.language,
    email: req.body.email,
    phone: req.body.phone,
    city: req.body.city,
    country: req.body.country,
    verified: false
  });

  newUser.save((err) => {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true, user: newUser });
    }
  });
})

module.exports = router;
