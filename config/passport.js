// config/passport.js

var LocalStrategy = require('passport-local').Strategy;

var UserSchema = require('../app/models/UserSchema');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserSchema.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true 
    },
        function (req, email, password, done) {
            console.log(req.body, "~~~~~~~~~~`REQ.BODY")
            UserSchema.findOne({ 'local.email': email, name: req.body.userName }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    var newUser = new UserSchema();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password); 
                    newUser.name = req.body.userName;
                    newUser.headline = "";
                    newUser.room = "";
                    newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                    });
                }
            });
        }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true 
    },
        function (req, email, password, done) { 
            UserSchema.findOne({ 'local.email': email }, function (err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); 
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 

                return done(null, user);
            });
        }));
};
