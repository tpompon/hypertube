const express = require("express");
const router = express.Router();

const config = require('../config');

// Models
const User = require('../models/user');

router.route('/:id')
.get((req, res) => {
	User.find({ _id: req.params.id }, (err, user) => {
		if (err) {
		res.json({ success: false });
		} else {
		res.json({ success: true, user: user });
		}
	});
})
.delete((req, res) => {
	User.findOneAndRemove({ _id: req.params.id }, (err) => {
		if (err) {
		res.json({ success: false });
		} else {
		res.json({ success: true });
		}
	});
})
.put((req, res) => {
	const updateQuery = {};

	if (req.body.firstname)
		updateQuery.firstname = req.body.firstname;
	if (req.body.lastname)
		updateQuery.lastname = req.body.lastname;
	if (req.body.username)
		updateQuery.username = req.body.username;
	if (req.body.password)
		updateQuery.password = req.body.password;
	if (req.body.avatar)
		updateQuery.avatar = req.body.avatar;
	if (req.body.cover)
		updateQuery.cover = req.body.cover;
	if (req.body.birthdate)
		updateQuery.birthdate = req.body.birthdate;
	if (req.body.city)
		updateQuery.city = req.body.city;
	if (req.body.country)
		updateQuery.country = req.body.country;
	if (req.body.age)
		updateQuery.age = req.body.age;
	if (req.body.gender)
		updateQuery.gender = req.body.gender;
	if (req.body.language)
		updateQuery.language = req.body.language;
	if (req.body.email)
		updateQuery.email = req.body.email;
	if (req.body.phone)
		updateQuery.phone = req.body.phone;

	User.findOneAndUpdate({ _id: req.params.id }, updateQuery, { upsert: true }, (err, user) => {
		if (err)
			return res.json({ success: false });
		else
			return res.json({ success: true, updated: user });
	});
})

router.route('/username/:username')
.get((req, res) => {
	User.find({ username: req.params.username }, (err, user) => {
		if (err) {
			res.json({ success: false });
		} else {
			res.json({ success: true, user: user });
		}
	});
})

router.route('/:id/avatar')
.post((req, res) => {
  const imageFile = req.files.file;
  const timestamp = Date.now();
  imageFile.mv(`${__basedir}/public/avatars/${req.params.id}_${timestamp}.jpg`, (err) => {
    if (err)
      res.json({ success: false })
    else {
		User.update({ _id: req.params.id }, {
			avatar: `http://${config.server.host}:${config.server.port}/public/avatars/${req.params.id}_${timestamp}.jpg`
		}, (a, b) => console.log(a, b));
		res.json({ success: true, file: `public/avatars/${req.params.id}_${timestamp}.jpg`});
	}
  });
  // Working only with callback
})

module.exports = router;
