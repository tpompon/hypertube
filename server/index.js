const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const fs = require('fs');
const uuid = require('uuid/v4');
const session = require('express-session');
const path = require('path');
// const FileStore = require('session-file-store')(session);

const mongoose = require('mongoose');
const User = require('./models/user');
const Movie = require('./models/movie');

const torrentStream = require('torrent-stream');
// const engine = torrentStream("magnet:?xt=urn:btih:b47882a62eedec7767aa86b7a866f1dd846c5357&dn=Harry+Potter+and+the+Sorcerers+Stone+%282001%29+1080p+BrRip+x264+-+1&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969");
 
// engine.on('ready', () => {
//     engine.files.forEach((file) => {
//         console.log('filename:', file.name);
//         let stream = file.createReadStream();
//         let writeStream = fs.createWriteStream(`./torrents/${file.name}`);
//         stream.pipe(writeStream);

//         writeStream.on('finish', () => {
//           console.log(writeStream.path);
//           console.log("Write completed.");
//         });
      
//         writeStream.on('error', (err) => {
//           console.log(err.stack);
//         });
//     });
// });

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

// Torrents
const Protocol = require('bittorrent-protocol')
const net = require('net')
const PirateBay = require('thepiratebay');
const movieArt = require('movie-art');

const hostname = 'localhost'; 
const port = 4001; 

const app = express();

// Passport
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
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
  origin:['http://localhost:3000'], // front end
  credentials: true // enable set cookie
}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));
app.use('/torrents', express.static(__dirname + '/torrents'));

mongoose.connect('mongodb://localhost/hypertube', {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', () => {
  console.log('\x1b[36m%s\x1b[0m', '-> Database connection established');
});

const api = express.Router(); 

api.route('/')
.all((req, res) => {
  res.json({ status: "HyperTube API", method: req.method });
});

api.route('/auth/login')
.post((req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    req.login(user, (err) => {
      if (user) {
        res.json({ success: true, status: "Authentication success", user: req.user });
      } else {
        res.json({ success: false, status: "Authentication failed" });
      }
    })
  })(req, res, next);
})

api.route('/auth/logout')
.get((req, res, next) => {
  req.logout();
  res.json({ disconnected: true });
})

api.route('/auth')
.get((req, res) => {
  if (req.isAuthenticated())
    res.json({ auth: true, user: req.user });
  else
    res.json({ auth: false });
})

// Route with authentication - example
api.route('/check')
.get((req, res) => {
  if (req.isAuthenticated())
    res.json({ status: 'Access granted', user: req.user });
  else
    res.json({ status: 'You can\'t access this page, please login before' });
})
// Route with authentication - example

// Test with torrents
api.route('/torrents/:search')
.get(async (req, res) => {
  const searchResults = await PirateBay.search(req.params.search, {
    orderBy: 'seeds',
    sortBy: 'desc'
  }).catch((err) => console.log(err));
  if (searchResults.length > 0) {
    movieArt(req.params.search, (error, response) => {
      res.json({ success: true, poster: response, results: searchResults });
    });
  } else {
    res.json({ success: false });
  }
})

api.route('/torrents/download/:search')
.get(async (req, res) => {
  const searchResults = await PirateBay.search(req.params.search, {
    orderBy: 'seeds',
    sortBy: 'desc'
  }).catch((err) => console.log(err));
  if (searchResults.length > 0) {
    movieArt(req.params.search, (error, response) => {
      const engine = torrentStream(searchResults[0].magnetLink);

      engine.on('ready', (moviePath) => {
          engine.files.forEach((file) => {
              // console.log('filename:', file.name);
              let stream = file.createReadStream();
              let writeStream = fs.createWriteStream(`./torrents/${file.name}`);
              stream.pipe(writeStream);
  
              writeStream.on('finish', () => {
                console.log(writeStream.path);
                console.log("Write completed.");
              });
              writeStream.on('error', (err) => {
                console.log(err.stack);
              });
          });
      });
      res.json({ poster: response, result: searchResults[0] });
    });
  } else {
    res.json({ success: false });
  }
})
// Test with torrents

// Upload Avatar - API
api.route('/avatar/:username')
.post((req, res) => {
  const imageFile = req.files.file;
  const timestamp = Date.now();
  imageFile.mv(`${__dirname}/public/avatars/${req.params.username}_${timestamp}.jpg`, (err) => {
    if (err)
      res.json({ success: false })
    else
      res.json({ success: true, file: `public/avatars/${req.params.username}_${timestamp}.jpg`});
  });
  // Working only with callback
  User.update({ username: req.params.username }, {
      avatar: `http://${hostname}:${port}/public/avatars/${req.params.username}_${timestamp}.jpg`
  }, (a, b) => console.log(a, b));
})

// Movies - API
api.route('/movies')
.get((req, res) => {
  Movie.find({}, (err, movies) => {
    if (err)
      res.json({ success: false });
    else
      res.json({ success: true, movies: movies });
  });
})
.post((req, res) => {
	const newMovie = Movie({
    name_fr: req.body.name_fr, 
    name_en: req.body.name_en, 
    poster: `/posters/${req.body.poster}`,
    description_fr: req.body.description_fr,
    description_en: req.body.description_en,
    author: req.body.author,
    rating: req.body.rating
  });

  newMovie.save((err) => {
    if (err)
      res.json({ success: false });
    else
      res.json({ success: true, movie: newMovie });
  });
})

api.route('/movies/:id')
.get((req, res) => {
  Movie.find({ _id: req.params.id }, (err, movie) => {
    if (err)
      res.json({ success: false });
    else
      res.json({ success: true, movie: movie });
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

// Users - API
api.route('/users')
.get((req, res) => {
  User.find({}, (err, users) => {
    if (err)
      res.json({ success: false });
    else
      res.json({ success: true, users: users });
  });
})
.post((req, res) => {
	const newUser = User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password,
    avatar: `http://${hostname}:${port}/public/avatars/${req.body.avatar}`,
    cover: req.body.cover,
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

api.route('/user/:username')
.get((req, res) => {
  User.find({ username: req.params.username }, (err, user) => {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true, user: user });
    }
  });
})
.delete((req, res) => {
  User.findOneAndRemove({ username: req.params.username }, (err) => {
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

  User.findOneAndUpdate({ username: req.params.username }, updateQuery, { upsert:true }, (err, user) => {
    if (err)
      return res.json({ success: false });
    else
      return res.json({ success: true, updated: user });
  });
})

app.use(api);

app.listen(port, hostname, () => {
  console.log("\x1b[33m%s\x1b[0m", `Server running on http://${hostname}:${port}/`);
});

// let movies = [
//   {
//     id: 1,
//     en: {
//       name: "L'Arnacoeur",
//       description: "Un film sympa et cool"
//     },
//     fr: {
//       name: "L'Arnacoeur",
//       description: "A really nice movie, yeah"
//     },
//     poster: "/posters/arnacoeur.jpg",
//     author: "tpompon",
//     rating: 3.5,
//     comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }]
//   },
//   { id: 2, name_fr: "Hunger Games", name_en: "Hunger Games", poster: "/posters/hunger_games.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
//   { id: 3, name_fr: "Le Monde de Narnia", name_en: "Narnia's World", poster: "/posters/narnia.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.5, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
//   { id: 4, name_fr: "Pirates des Caraïbes", name_en: "Pirates of Caraïbes", poster: "/posters/pirates_des_caraibes.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 3, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
//   { id: 5, name_fr: "Star Wars: Le Réveil de la Force", name_en: "Star Wars: Strength Awakening", poster: "/posters/star_wars.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 3.5, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
//   { id: 6, name_fr: "Sully", name_en: "Sully", poster: "/posters/sully.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
//   { id: 7, name_fr: "Star Wars: Les Derniers Jedi", name_en: "Star Wars: The Last Jedi", poster: "/posters/star_wars2.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
//   { id: 8, name_fr: "Titanic", name_en: "Titanic", poster: "/posters/titanic.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.5, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
//   { id: 9, name_fr: "Spiderman: Homecoming", name_en: "Spiderman: Homecoming", poster: "/posters/spiderman.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
//   { id: 10, name_fr: "Dunkerque", name_en: "Dunkerque", poster: "/posters/dunkerque.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] }
// ]

// const users = [
//   { id: 1, firstname: 'Thomas', lastname: 'Pompon', username: 'tpompon', password: 'x24ze24zezE', avatar: `http://${hostname}:${port}/public/avatars/tpompon_def.jpg`, cover: "url('/covers/cinema.svg')", birthdate: '30/06/1999', city: 'Paris', country: 'France', age: '20', gender: 'male', language: 'fr', email: 'tpompon@hypertube.com', phone: '+33685589963', verified: true },
//   { id: 2, firstname: 'Irina', lastname: 'Paré', username: 'ipare', password: 'x24ze24zezE', avatar: `http://${hostname}:${port}/public/avatars/ipare_def.jpg`, cover: "url('/covers/cinema.svg')", birthdate: '01/01/1999', city: 'Reykjavik', country: 'Islande', age: '20', gender: 'female', language: 'fr', email: 'ipare@hypertube.com', phone: '+33785241441', verified: true },
//   { id: 3, firstname: 'Audrey', lastname: 'Fortin', username: 'afortin', password: 'x24ze24zezE', avatar: `http://${hostname}:${port}/public/avatars/afortin_def.jpg`, cover: "url('/covers/cinema.svg')", birthdate: '21/08/1998', city: 'Lyon', country: 'France', age: '21', gender: 'female', language: 'fr', email: 'afortin@hypertube.com', phone: '+33670405523', verified: false }
// ]
