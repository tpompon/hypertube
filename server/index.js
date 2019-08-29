const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');

const mongoose = require('mongoose');
const User = require('./models/user');
const Movie = require('./models/movie');

const hostname = 'localhost'; 
const port = 4001; 

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost/hypertube', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', () => {
  console.log('\x1b[36m%s\x1b[0m', '-> Database connection established');
});

let movies = [
  {
    id: 1,
    en: {
      name: "L'Arnacoeur",
      description: "Un film sympa et cool"
    },
    fr: {
      name: "L'Arnacoeur",
      description: "A really nice movie, yeah"
    },
    poster: "/posters/arnacoeur.jpg",
    author: "tpompon",
    rating: 3.5,
    comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }]
  },
  { id: 2, name_fr: "Hunger Games", name_en: "Hunger Games", poster: "/posters/hunger_games.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
  { id: 3, name_fr: "Le Monde de Narnia", name_en: "Narnia's World", poster: "/posters/narnia.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.5, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
  { id: 4, name_fr: "Pirates des Caraïbes", name_en: "Pirates of Caraïbes", poster: "/posters/pirates_des_caraibes.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 3, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
  { id: 5, name_fr: "Star Wars: Le Réveil de la Force", name_en: "Star Wars: Strength Awakening", poster: "/posters/star_wars.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 3.5, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
  { id: 6, name_fr: "Sully", name_en: "Sully", poster: "/posters/sully.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
  { id: 7, name_fr: "Star Wars: Les Derniers Jedi", name_en: "Star Wars: The Last Jedi", poster: "/posters/star_wars2.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
  { id: 8, name_fr: "Titanic", name_en: "Titanic", poster: "/posters/titanic.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.5, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
  { id: 9, name_fr: "Spiderman: Homecoming", name_en: "Spiderman: Homecoming", poster: "/posters/spiderman.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] },
  { id: 10, name_fr: "Dunkerque", name_en: "Dunkerque", poster: "/posters/dunkerque.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4, comments: [{ id: 1, author: "tpompon", content: "ok salut" }, { id: 2, author: "ipare", content: "Franchement bon film ouais" }, { id: 3, author: "afortin", content: "So nice movie !!!!" }] }
]

const users = [
  { id: 1, firstname: 'Thomas', lastname: 'Pompon', username: 'tpompon', password: 'x24ze24zezE', avatar: `http://${hostname}:${port}/public/avatars/tpompon_def.jpg`, cover: "url('/covers/cinema.svg')", birthdate: '30/06/1999', city: 'Paris', country: 'France', age: '20', gender: 'male', language: 'fr', email: 'tpompon@hypertube.com', phone: '+33685589963', verified: true },
  { id: 2, firstname: 'Irina', lastname: 'Paré', username: 'ipare', password: 'x24ze24zezE', avatar: `http://${hostname}:${port}/public/avatars/ipare_def.jpg`, cover: "url('/covers/cinema.svg')", birthdate: '01/01/1999', city: 'Reykjavik', country: 'Islande', age: '20', gender: 'female', language: 'fr', email: 'ipare@hypertube.com', phone: '+33785241441', verified: true },
  { id: 3, firstname: 'Audrey', lastname: 'Fortin', username: 'afortin', password: 'x24ze24zezE', avatar: `http://${hostname}:${port}/public/avatars/afortin_def.jpg`, cover: "url('/covers/cinema.svg')", birthdate: '21/08/1998', city: 'Lyon', country: 'France', age: '21', gender: 'female', language: 'fr', email: 'afortin@hypertube.com', phone: '+33670405523', verified: false }
]

const api = express.Router(); 

api.route('/')
.all((req, res) => {
  res.json({ status: "HyperTube API", method: req.method });
});

// Upload Avatar - API
api.route('/avatar/:username')
.post((req, res) => {
  const imageFile = req.files.file;
  imageFile.mv(`${__dirname}/public/avatars/${req.params.username}.jpg`, (err) => {
    if (err)
      res.json({ success: false })
    else
      res.json({ success: true, file: `public/avatars/${req.params.username}.jpg`});
  });
  // Working only with callback
  User.update({ username: req.params.username }, {
      avatar: `http://${hostname}:${port}/public/avatars/${req.params.username}.jpg`
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

api.route('/movie/:id')
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

api.route('/movie/:id/comments')
.get((req, res) => {
  const movieIndex = movies.findIndex(movie => movie.id == req.params.id);
  res.json({
    status: `Comments of movie n°${movies[movieIndex].id}`,
    comments: movies[movieIndex].comments,
    method: req.method
  });
})
.post((req, res) => {
  const movieIndex = movies.findIndex(movie => movie.id == req.params.id);
  const newComment = {
    id: movies[movieIndex].comments.length + 1,
    author: req.body.author,
    content: req.body.content
  }
  movies[movieIndex].comments.push(newComment);
  res.json({
    status: `Comment on movie n°${movies[movieIndex].id} has been added`, 
    comment: newComment,
    method: req.method
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
