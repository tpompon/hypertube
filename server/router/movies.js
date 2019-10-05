const express = require("express");
const router = express.Router();

// Models
const Movie = require("../models/movie");
const User = require("../models/user");

router
  .route("/")
  .get((req, res) => {
    console.log("Movies Filters", req.query);
    // Query for genre + years
    // "ytsData.genres": /.*Horror.*/i, $and: [ { "ytsData.year": { $gte: 1990 } }, { "ytsData.year": { $lte: 2010 } } ]
    Movie.find({}, (err, movies) => {
      if (err) res.json({ success: false });
      else res.json({ success: true, movies: movies });
    });
  })
  .post((req, res) => {
    const newMovie = Movie({
      _ytsId: req.body.ytsId,
      name: req.body.name,
      poster: req.body.poster,
      ytsData: req.body.ytsData,
      description: req.body.description,
      author: req.body.author,
      rating: req.body.rating
    });

    newMovie.save(err => {
      if (err) {
        res.json({ success: false, error: err });
      } else {
        res.json({ success: true, movie: newMovie });
      }
    });
  })
  .delete((req, res) => {
    Movie.remove({}, err => {
      if (err) res.json({ success: false, error: err });
      else res.json({ success: true });
    });
  });

router
  .route("/:id")
  .get((req, res) => {
    Movie.find({ _id: req.params.id }, (err, movie) => {
      if (err) res.json({ success: false });
      else if (movie.length !== 0) res.json({ success: true, movie: movie });
      else res.json({ success: false });
    });
  })
  .put((req, res) => {
    const updateQuery = {};

    if (req.body.name) updateQuery.name = req.body.name;
    if (req.body.description) updateQuery.description = req.body.description;
    if (req.body.poster) updateQuery.poster = req.body.poster;
    if (req.body.author) updateQuery.author = req.body.author;
    if (req.body.rating) updateQuery.rating = req.body.rating;

    Movie.findOneAndUpdate(
      { _id: req.params.id },
      updateQuery,
      { upsert: true },
      (err, movie) => {
        if (err) return res.json({ success: false });
        else return res.json({ success: true, updated: movie });
      }
    );
  })
  .delete((req, res) => {
    Movie.findOneAndRemove({ _id: req.params.id }, err => {
      if (err) res.json({ success: false });
      else res.json({ success: true });
    });
  });

router.route("/yts/:id").get((req, res) => {
  Movie.findOne({ _ytsId: req.params.id }, (err, movie) => {
    if (err) res.json({ success: false, err: err });
    else if (movie && movie.length !== 0) {
      res.json({ success: true, movie: movie });
    } else {
      res.json({ success: false });
    }
  });
});

router
  .route("/:id/heartbeat")
  .get((req, res) => {
    const movie = { id: req.params.id };
    User.findOne(
      { _id: req.query.uid },
      { heartbeat: { $elemMatch: { id: movie.id } } },
      (err, result) => {
        if (err) {
          res.json({ success: false });
        } else {
          if (result) {
            res.json({ success: true, found: result.heartbeat.length });
          } else {
            res.json({ success: true, found: 0 });
          }
        }
      }
    );
  })
  .post((req, res) => {
    const movie = { id: req.params.id };
    User.findOneAndUpdate(
      { _id: req.body.uid },
      { $push: { heartbeat: movie } },
      err => {
        if (err) {
          res.json({ success: false });
        } else {
          res.json({ success: true, movie: movie });
        }
      }
    );
  })
  .delete((req, res) => {
    const movie = { id: req.params.id };
    User.findOneAndUpdate(
      { _id: req.body.uid },
      { $pull: { heartbeat: { id: movie.id } } },
      err => {
        if (err) {
          res.json({ success: false });
        } else {
          res.json({ success: true });
        }
      }
    );
  });

router
  .route("/:id/recents")
  .get((req, res) => {
    const movie = { id: req.params.id };
    User.findOne(
      { _id: req.query.uid },
      { recents: { $elemMatch: { id: movie.id } } },
      (err, result) => {
        if (err) {
          res.json({ success: false });
        } else {
          if (result) {
            res.json({ success: true, found: result.recents.length });
          } else {
            res.json({ success: true, found: 0 });
          }
        }
      }
    );
  })
  .post((req, res) => {
    const movie = { id: req.params.id };
    User.findOneAndUpdate(
      { _id: req.body.uid },
      { $push: { recents: movie } },
      err => {
        if (err) {
          res.json({ success: false });
        } else {
          res.json({ success: true, movie: movie });
        }
      }
    );
  })
  .delete((req, res) => {
    const movie = { id: req.params.id };
    User.findOneAndUpdate(
      { _id: req.body.uid },
      { $pull: { recents: { id: movie.id } } },
      err => {
        if (err) {
          res.json({ success: false });
        } else {
          res.json({ success: true });
        }
      }
    );
  });

router
  .route("/:id/inprogress")
  .get((req, res) => {
    const movie = { id: req.params.id };
    User.findOne(
      { _id: req.query.uid },
      { inProgress: { $elemMatch: { id: movie.id } } },
      (err, result) => {
        if (err) {
          res.json({ success: false });
        } else {
          if (result) {
            res.json({ success: true, found: result.inProgress.length });
          } else {
            res.json({ success: true, found: 0 });
          }
        }
      }
    );
  })
  .post((req, res) => {
    const movie = { id: req.params.id };
    User.findOneAndUpdate(
      { _id: req.body.uid },
      { $push: { inProgress: movie } },
      err => {
        if (err) {
          res.json({ success: false });
        } else {
          res.json({ success: true, movie: movie });
        }
      }
    );
  })
  .delete((req, res) => {
    const movie = { id: req.params.id };
    User.findOneAndUpdate(
      { _id: req.body.uid },
      { $pull: { inProgress: { id: movie.id } } },
      err => {
        if (err) {
          res.json({ success: false });
        } else {
          res.json({ success: true });
        }
      }
    );
  });

// Movies comments
router.route("/:id/comments").post((req, res) => {
  const newComment = { author: req.body.author, content: req.body.content };
  Movie.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { comments: newComment } },
    err => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true, comment: newComment });
      }
    }
  );
});

router.route("/:id/comments/report").post((req, res) => {
  Movie.update(
    { _id: req.params.id, "comments._id": req.body.commId },
    {
      $set: {
        "comments.$.report": 1
      }
    },
    err => {
      if (err) {
        console.log(err);
        res.json({ success: false, error: err });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Movies ratings
router
  .route("/:id/ratings")
  .get((req, res) => {
    Movie.findOne({ _id: req.params.id }, (err, result) => {
      if (result) {
        let count = 0;
        let total = 0;
        result.ratings.forEach(el => {
          total += el.rating;
          count++;
        });
        res.json({
          success: true,
          ratingAverage: Math.floor((total / count) * 100) / 100,
          ratingCount: count
        });
      } else {
        res.json({ success: false });
      }
    });
  })
  .post((req, res) => {
    const newRating = { uid: req.body.uid, rating: req.body.rating };

    Movie.findOne(
      { _id: req.params.id, "ratings.uid": req.body.uid },
      (err, result) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
        } else if (result) {
          Movie.update(
            { _id: req.params.id, "ratings.uid": req.body.uid },
            {
              $set: {
                "ratings.$.rating": req.body.rating
              }
            },
            err => {
              if (err) {
                console.log(err);
                res.json({ success: false });
              } else {
                res.json({ success: true });
              }
            }
          );
        } else {
          Movie.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { ratings: newRating } },
            err => {
              if (err) {
                res.json({ success: false });
              } else {
                res.json({ success: true });
              }
            }
          );
        }
      }
    );
  });

router.route("/:id/ratings/:uid").get((req, res) => {
  Movie.findOne(
    { _id: req.params.id, "ratings.uid": req.params.uid },
    { "ratings.$": 1 },
    (err, result) => {
      if (result) {
        res.json({ success: true, rating: result.ratings[0].rating });
      } else {
        res.json({ success: false });
      }
    }
  );
});

module.exports = router;
