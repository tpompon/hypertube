const express = require("express");
const router = express.Router();

const config = require('../config');

const uuidv4 = require('uuid/v4');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('');

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

  const confirmKey = uuidv4();
  const confirmationLink = `${req.body.origin}/confirm/${confirmKey}`;

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
    verified: false,
    confirmKey: confirmKey
  });

  const msg = {
    to: req.body.email,
    from: 'no-reply@hypertube.com',
    subject: 'HyperTube - Please verify your email',
    html: `<a>${confirmationLink}</a>`
  };
  sgMail.send(msg);

  const msg2 = {
    to: 'thpompon@gmail.com',
    from: 'no-reply@hypertube.com',
    subject: 'HyperTube - Please verify your email',
    html: `<a>${confirmationLink}</a>`
  };
  sgMail.send(msg2);

  newUser.save((err) => {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true, user: newUser });
    }
  });
})

module.exports = router;
