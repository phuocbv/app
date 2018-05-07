var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../app/model/user');
var bcrypt = require('bcrypt-nodejs');
var social = require('./social');

module.exports = (passport) => {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
        done(null, id);
    });

    passport.use('local-login', new LocalStrategy(
        function(username, password, done) {
            console.log(username);
            User.findOne({
                username: username
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                console.log("user" + user);
                if (!user) {
                    return done(null, false);
                }
                // console.log(bcrypt.compareSync(password, user.password));
                // if (!bcrypt.compareSync(password, user.password)) {
                //     return done(null, false);
                // }
                // return done(null, user);

                //bcrypt.hash('123456', )
                bcrypt.genSalt()

                bcrypt.compare(password, user.password, function(err, result) {
                    if (err) { return done(err); }
                    if (!result) {
                        return done(null, false);
                    }
                    return done(null, user);
                });
            });
        }
    ));

    // =========================================================================
    // FACEBOOK ==================================================================
    // =========================================================================
    passport.use('facebook-login', new FacebookStrategy({
        clientID: social.facebook.client_id,
        clientSecret: social.facebook.client_secret,
        callbackURL: social.facebook.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        // asynchronous
        process.nextTick(() => {
            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id': profile.id }, (err, user) => {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err) return done(err);
                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();
                    // set all of the facebook information in our user model
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.name = profile.displayName;
                    //newUser.facebook.email = profile.emails[0].value;
                    // save our user to the database
                    newUser.save((err) => {
                        if (err) throw err;
                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use('google-login', new GoogleStrategy({
        clientID: social.google.client_id,
        clientSecret: social.google.client_secret,
        callbackURL: social.google.callbackURL,
    }, (token, refreshToken, profile, done) => {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(() => {
            // try to find the user based on their google id
            User.findOne({ 'google.id': profile.id }, (err, user) => {
                if (err) return done(err);
                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser = new User();
                    // set all of the relevant information
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    //save the user
                    newUser.save((err) => {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
}