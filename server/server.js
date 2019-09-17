const express = require("express");
const config = require('./config');
const cors = require('cors');
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const uuid = require('uuid/v4');
const session = require('express-session');

const User = require('./models/user');
const Movie = require('./models/movie');

global.__basedir = __dirname;

// Passport
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

const app = express();

app.use(session({
  genid: (req) => {
    console.log(`${req.method} Request from client - SESSION_ID: ${req.sessionID}`)
    return uuid() // use UUIDs for session IDs
  },
  secret: "c+IoG?1:wih`],]L=XMlr'uYP~H,ac~3xTmq-Vb|Bn{)`$Oe?*GwT_/Mx2/#yy7",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week (we can try with 5000 = 5s, cookie session will expire)
  },
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin:[`http://${config.client.host}:${config.client.port}`], // front end
  credentials: true // enable set cookie
}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));
app.use('/torrents', express.static(__dirname + '/torrents'));

const db = require('./db')
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', () => {
  console.log('\x1b[36m%s\x1b[0m', '-> Database connection established');
});

const api = express.Router(); 

api.route('/')
.all((req, res) => {
  res.json({ status: "HyperTube API", method: req.method });
});

// Movies lists
api.route('/movie/:id/heartbeat')
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
          res.json({ success: true, found: result.heartbeat.length })
        } else {
          res.json({ success: true, found: 0 })
        }
      }
  });
})
.post((req, res) => {
  const movie = { id: req.params.id };
  User.findOneAndUpdate(
    { _id: req.body.uid }, 
    { $push: { heartbeat: movie } },
    (err) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true, movie: movie });
      }
  });
})
.delete((req, res) => {
  const movie = { id: req.params.id };
  User.findOneAndUpdate(
    { _id: req.body.uid }, 
    { $pull : { heartbeat: { id: movie.id }  } },
    (err) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
  });
})

api.route('/movie/:id/recents')
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
          res.json({ success: true, found: result.recents.length })
        } else {
          res.json({ success: true, found: 0 })
        }
      }
  });
})
.post((req, res) => {
  const movie = { id: req.params.id };
  User.findOneAndUpdate(
    { _id: req.body.uid }, 
    { $push: { recents: movie } },
    (err) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true, movie: movie });
      }
  });
})
.delete((req, res) => {
  const movie = { id: req.params.id };
  User.findOneAndUpdate(
    { _id: req.body.uid }, 
    { $pull : { recents: { id: movie.id }  } },
    (err) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
  });
})

api.route('/movie/:id/inprogress')
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
          res.json({ success: true, found: result.inProgress.length })
        } else {
          res.json({ success: true, found: 0 })
        }
      }
  });
})
.post((req, res) => {
  const movie = { id: req.params.id };
  User.findOneAndUpdate(
    { _id: req.body.uid }, 
    { $push: { inProgress: movie } },
    (err) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true, movie: movie });
      }
  });
})
.delete((req, res) => {
  const movie = { id: req.params.id };
  User.findOneAndUpdate(
    { _id: req.body.uid }, 
    { $pull : { inProgress: { id: movie.id }  } },
    (err) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
  });
})

// Movies comments
api.route('/movie/:id/comments')
.post((req, res) => {
  const newComment = { author: req.body.author, content: req.body.content };
  Movie.findOneAndUpdate(
    { _id: req.params.id }, 
    { $push: { comments: newComment  } },
    (err) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true, comment: newComment });
      }
  });
})


// Movies ratings
api.route('/movie/:id/ratings')
.get((req, res) => {
  Movie.findOne({ _id: req.params.id }, (err, result) => {
    if (result) {
      let count = 0;
      let total = 0;
      result.ratings.forEach((el) => {
        total += el.rating;
        count++;
      })
      res.json({ success: true, ratingAverage: Math.floor((total / count) * 100) / 100, ratingCount: count });
    } else {
      res.json({ success: false });
    }
  })
})
.post((req, res) => {
  const newRating = { uid: req.body.uid, rating: req.body.rating };
  console.log(newRating);
  console.log(req.params.id);

  Movie.findOne({ _id: req.params.id, 'ratings.uid': req.body.uid }, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ success: false });
    } else if (result) {
      console.log(result)
      Movie.update({_id: req.params.id, 'ratings.uid': req.body.uid}, {'$set': {
        'ratings.$.rating': req.body.rating
      }}, (err) => {
        if (err) {
          console.log(err);
          res.json({ success: false });
        } else {
          res.json({ success: true });
        }
      });
    } else {
      Movie.findOneAndUpdate(
        { _id: req.params.id }, 
        { $push: { ratings: newRating  } },
        (err) => {
          if (err) {
            res.json({ success: false });
          } else {
            res.json({ success: true });
          }
      });
    }
  });
})

api.route('/movie/:id/ratings/:uid')
.get((req, res) => {
  Movie.findOne({ _id: req.params.id, 'ratings.uid': req.params.uid }, {'ratings.$' : 1}, (err, result) => {
    if (result) {
      res.json({ success:  true, rating: result.ratings[0].rating });
    } else {
      res.json({ success: false });
    }
  })
})

app.use(api)
app.use('/users', require('./router/users'));
app.use('/movies', require('./router/movies'));
app.use('/torrents', require('./router/torrents'));
app.use('/auth', require('./router/auth'));
app.use('/user', require('./router/user'));

app.listen(4001, () => {
  console.log("\x1b[33m%s\x1b[0m", `Server running on http://${config.server.host}:${config.server.port}/`);
});
