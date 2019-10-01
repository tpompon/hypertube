const express = require("express");
const router = express.Router();

// Models
const Movie = require('../models/movie');

router.route('/')
.get((req, res) => {
  console.log('Movies Filters', req.query)
  // Query for genre + years
  // "ytsData.genres": /.*Horror.*/i, $and: [ { "ytsData.year": { $gte: 1990 } }, { "ytsData.year": { $lte: 2010 } } ]
	Movie.find({ }, (err, movies) => {
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true, movies: movies });
	});
})
.post((req, res) => {

	const newMovie = Movie({
    _ytsId: req.body.ytsId,
		name_fr: req.body.name_fr, 
		name_en: req.body.name_en, 
    poster: req.body.poster,
    ytsData: req.body.ytsData,
		description_fr: req.body.description_fr,
		description_en: req.body.description_en,
		author: req.body.author,
		rating: req.body.rating
	});

	newMovie.save((err) => {
		if (err)
			res.json({ success: false, error: err });
		else
			res.json({ success: true, movie: newMovie });
	});
})

router.route('/:id')
.get((req, res) => {
  Movie.find({ _id: req.params.id }, (err, movie) => {
    if (err)
      res.json({ success: false });
    else if (movie.length !== 0)
      res.json({ success: true, movie: movie });
    else
      res.json({ success: false });
  });
})
.put((req, res) => {
  const updateQuery = {};

  if (req.body.name_fr)
    updateQuery.name_fr = req.body.name_fr;
  if (req.body.name_en)
    updateQuery.name_en = req.body.name_en;
  if (req.body.description_fr)
    updateQuery.description_fr = req.body.description_fr;
  if (req.body.description_en)
    updateQuery.description_en = req.body.description_en;
  if (req.body.poster)
    updateQuery.poster = req.body.poster;
  if (req.body.author)
    updateQuery.author = req.body.author;
  if (req.body.rating)
    updateQuery.rating = req.body.rating;

  Movie.findOneAndUpdate({ _id: req.params.id }, updateQuery, { upsert:true }, (err, movie) => {
    if (err)
      return res.json({ success: false });
    else
      return res.json({ success: true, updated: movie });
  });
})
.delete((req, res) => {
  Movie.findOneAndRemove({ _id: req.params.id }, (err) => {
    if (err)
      res.json({ success: false });
    else
      res.json({ success: true });
  });
});

router.route('/yts/:id')
.get((req, res) => {
  Movie.findOne({ _ytsId: req.params.id }, (err, movie) => {
    if (err)
      res.json({ success: false, err: err });
    else if (movie && movie.length !== 0) {
      res.json({ success: true, movie: movie });
    } else {
      res.json({ success: false });
    }
  });
})

module.exports = router;
