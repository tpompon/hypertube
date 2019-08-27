const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');

const hostname = 'localhost'; 
const port = 4001; 

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

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
  res.json({status: "HyperTube API", method: req.method});
});

api.route('/avatar/:username')
.post((req, res) => {
  const imageFile = req.files.file;
  imageFile.mv(`${__dirname}/public/avatars/${req.params.username}.jpg`, (err) => {
    if (err) { return res.status(500).send(err); }
    res.json({file: `public/avatars/${req.params.username}.jpg`});
  });
  const userIndex = users.findIndex(user => user.username == req.params.username);
  users[userIndex].avatar = `http://${hostname}:${port}/public/avatars/${req.params.username}.jpg`;
})

api.route('/movies')
.get((req, res) => {
  res.json(movies);
})
.post((req, res) => {
  const newMovie = {
    id: movies.length + 1,
    name_fr: req.body.name_fr, 
    name_en: req.body.name_en, 
    poster: req.body.poster,
    description_fr: req.body.description_fr,
    description_en: req.body.description_en,
    author: req.body.author,
    rating: req.body.rating
  }
  movies.push(newMovie);
  res.json({
    status: `Movie n°${newMovie.id} has been added`, 
    movie: newMovie,
    method: req.method
  });
})

api.route('/movie/:id')
.get((req, res) => {
	res.json(movies.find(movie => movie.id == req.params.id));
})
.put((req, res) => {
  let movie = movies.find(movie => movie.id == req.params.id);
  const movieIndex = movies.findIndex(movie => movie.id == req.params.id);

  movie.name_fr = req.body.name_fr ? req.body.name_fr : movie.name_fr;
  movie.name_en = req.body.name_en ? req.body.name_en : movie.name_en;
  movie.poster = req.body.poster ? req.body.poster : movie.poster;
  movie.description_fr = req.body.description_fr ? req.body.description_fr : movie.description_fr;
  movie.description_en = req.body.description_en ? req.body.description_en : movie.description_en;
  movie.author = req.body.author ? req.body.author : movie.author;
  movie.rating = req.body.rating ? req.body.rating : movie.rating;

  movies[movieIndex] = movie;
	res.json({status: `Movie n°${req.params.id} has been updated`, movie: movie});
})
.delete((req, res) => {
  movies = movies.filter((movie) => movie.id != req.params.id);
  res.json({status: `Movie n°${req.params.id} has been deleted`});
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

api.route('/users')
.get((req, res) => {
	res.json(users);
})

api.route('/user/:username')
.get((req, res) => {
	res.json(users.find(user => user.username === req.params.username));
})
.put((req, res) => {
  let user = users.find(user => user.username == req.params.username);
  const userIndex = users.findIndex(user => user.username == req.params.username);

  user.firstname = req.body.firstname ? req.body.firstname : user.firstname;
  user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
  user.username = req.body.username ? req.body.username : user.username;
  user.password = req.body.password ? req.body.password : user.password;
  user.avatar = req.body.avatar ? req.body.avatar : user.avatar;
  user.cover = req.body.cover ? req.body.cover : user.cover;
  user.birthdate = req.body.birthdate ? req.body.birthdate : user.birthdate;
  user.city = req.body.city ? req.body.city : user.city;
  user.country = req.body.country ? req.body.country : user.country;
  user.age = req.body.age ? req.body.age : user.age;
  user.gender = req.body.gender ? req.body.gender : user.gender;
  user.nationality = req.body.nationality ? req.body.nationality : user.nationality;
  user.language = req.body.language ? req.body.language : user.language;
  user.email = req.body.email ? req.body.email : user.email;
  user.phone = req.body.phone ? req.body.phone : user.phone;
  user.verified = req.body.verified ? req.body.verified : user.verified;

  users[userIndex] = user;
	res.json({status: `User n°${req.params.id} has been updated`, user: user});
})

app.use(api);

app.listen(port, hostname, () => {
  console.log(`Server running on http://${hostname}:${port}/`);
});
