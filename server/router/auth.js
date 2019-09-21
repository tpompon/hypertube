const express = require("express");
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

router.route('/')
.get((req, res) => {
	if (req.isAuthenticated())
		res.json({ auth: true, user: req.user });
	else
		res.json({ auth: false });
})

router.route('/logout')
.get((req, res) => {
  req.logout();
  res.json({ disconnected: true });
})

router.route('/login/:strategy')
.post((req, res, next) => {
  const strategy = req.params.strategy;
  if (strategy === 'local') {
    passport.authenticate('local', (err, user, info) => {
      req.login(user, (err) => {
        if (user) {
          res.json({ success: true, status: "Authentication success", user: req.user });
        } else {
          res.json({ success: false, status: info.message });
        }
      })
    })(req, res, next);
  } else if (strategy === '42') {

  } else if (strategy === 'github') {
  
  } else {
    res.json({ success: false, status: "Authentication failed, strategy error" });
  }
})

router.route('/confirm')
.post((req, res) => {
  const key = req.body.key;
  User.findOneAndUpdate({ confirmKey: key }, { confirmKey: 'confirmed' }, { upsert: true }, (err, user) => {
		if (err)
		  return res.json({ success: false });
		else
		  return res.json({ success: true, updated: user });
	});
})

module.exports = router;
