const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");


module.exports = function localSignup(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // SIGNUP
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        emailField: "email",
        passReqToCallback: true
      },
      function(username, password, done) {
        process.nextTick(() => {
          User.findOne({ username: username, email: email }, function(
            err,
            user
          ) {
            if (err) {
              return done(err);
            }
            if (user) {
              return done(null, false, {
                message: "Username/email already taken."
              });
            }
            // if (!user.validPassword(password)) {
            //   return done(null, false, { message: 'Incorrect password.' });
            else {
              const newUser = User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                password: req.body.password.generateHash(password),
                avatar: `http://${hostname}:${port}/public/avatars/afortin_def.jpg`,
                cover: req.body.cover,
                birthdate: req.body.birthdate,
                age: req.body.age,
                // gender: req.body.gender,
                language: req.body.language,
                email: req.body.email,
                 phone: req.body.phone,
                // city: req.body.city,
                 country: req.body.country,
                // verified: false
              });

              newUser.save(err => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );
};
