const express = require("express");
const config = require('./config');
const cors = require('cors');
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const uuid = require('uuid/v4');
const session = require('express-session');

const User = require('./models/user');

require('dotenv').config();
global.__basedir = __dirname;

// Passport
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FourtyTwoStrategy = require('passport-42').Strategy
  , GoogleStrategy = require('passport-google-oauth20').Strategy;

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CONSUMER_KEY,
    clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
    callbackURL: "http://localhost:4001/oauth/google/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ _googleID: profile.id }, function(err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        const newUser = User({
          _googleID: profile.id,
          firstname: profile.name.givenName,
          lastname: "GoogleUser",
          //email: profile.emails[0].value,
          username: profile.name.givenName,
          cover: 'cinema',
          avatar: profile.photos[0].value
        });

        newUser.save((err) => {
          if (err) {
            console.log(err)
            return done(null, false, { error: err });
          } else {
            return done(null, newUser);
          }
        });
      } else {
        return done(null, user);
      }
    });
  }
));

passport.use(new FourtyTwoStrategy({
    clientID: process.env.FOURTYTWO_CLIENT_ID,
    clientSecret: process.env.FOURTYTWO_CLIENT_SECRET,
    callbackURL: "http://localhost:4001/oauth/42/redirect"
  },
  function(req, token, tokenSecret, profile, done) {
    User.findOne({ _fourtytwoID: profile.id }, function(err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        const newUser = User({
          _fourtytwoID: profile.id,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          email: profile.emails[0].value,
          username: profile.username,
          cover: 'cinema',
          avatar: profile.photos[0].value
        });

        newUser.save((err) => {
          if (err) {
            console.log(err)
            return done(null, false, { error: err });
          } else {
            return done(null, newUser);
          }
        });
      } else {
        return done(null, user);
      }
    });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `http://${config.server.host}:${config.server.port}/oauth/twitter/redirect`,
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    User.findOne({ _twitterID: profile.id }, function(err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        const newUser = User({
          _twitterID: profile.id,
          firstname: profile.displayName,
          lastname: "TwitterUser",
          username: profile.username,
          cover: 'cinema',
          avatar: profile.photos[0].value.replace("_normal", "")
        });

        newUser.save((err) => {
          if (err) {
            return done(null, false, { error: err });
          } else {
            return done(null, newUser);
          }
        });
      } else {
        return done(null, user);
      }
    });
  }
));

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
      if (!user.isMailConfirmed()) {
        return done(null, false, { message: 'Please confirm your email before' });
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
    secure: 'auto',
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

app.get('/oauth/twitter',
  passport.authenticate('twitter'));
app.get('/oauth/twitter/redirect', 
  passport.authenticate('twitter', { failureRedirect: `http://${config.client.host}:${config.client.port}/login` }),
  (req, res) => {
    req.login(req.user, (err) => {
      if (err) {
        res.redirect(`http://${config.client.host}:${config.client.port}/login`);
      } else if (req.user) {
        res.redirect(`http://${config.client.host}:${config.client.port}/`);
      } else {
        res.redirect(`http://${config.client.host}:${config.client.port}/login`);
      }
    })
});

app.get('/oauth/42',
  passport.authenticate('42'));
app.get('/oauth/42/redirect', 
  passport.authenticate('42', { failureRedirect: `http://${config.client.host}:${config.client.port}/login` }),
  (req, res) => {
    req.login(req.user, (err) => {
      if (err) {
        res.redirect(`http://${config.client.host}:${config.client.port}/login`);
      } else if (req.user) {
        res.redirect(`http://${config.client.host}:${config.client.port}/`);
      } else {
        res.redirect(`http://${config.client.host}:${config.client.port}/login`);
      }
    })
});

app.get('/oauth/google',
  passport.authenticate('google', { scope: ['profile'] }));
app.get('/oauth/google/redirect', 
passport.authenticate('google', { failureRedirect: `http://${config.client.host}:${config.client.port}/login` }),
  (req, res) => {
    req.login(req.user, (err) => {
      if (err) {
        res.redirect(`http://${config.client.host}:${config.client.port}/login`);
      } else if (req.user) {
        res.redirect(`http://${config.client.host}:${config.client.port}/`);
      } else {
        res.redirect(`http://${config.client.host}:${config.client.port}/login`);
      }
    })
});

app.post('/register/avatar', (req, res) => {
  const imageFile = req.files.file;
  const timestamp = Date.now();
  const uniqueId = uuid();
  imageFile.mv(`${__basedir}/public/avatars/tmp/${uniqueId}_${timestamp}.jpg`, (err) => {
    if (err)
      res.json({ success: false })
    else
		  res.json({ success: true, file: `${uniqueId}_${timestamp}.jpg`});
  });
});

// API Documentation
app.use('/', express.static('documentation'));

app.use('/auth', require('./router/auth'));
app.use('/users', require('./router/users'));
app.use('/movies', require('./router/movies'));
app.use('/torrents', require('./router/torrents'));

app.listen(4001, () => {
  console.log("\x1b[33m%s\x1b[0m", `Server running on http://${config.server.host}:${config.server.port}/`);
});
