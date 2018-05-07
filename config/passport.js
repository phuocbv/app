var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app/model/user');
var bcrypt = require('bcrypt-nodejs');
var social = require('./social');

module.exports = (passport) => {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        // User.findById(id, function(err, user) {
        //     done(err, user);
        // });
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

    passport.use('facebook-login', new FacebookStrategy({
        clientID: social.facebook.client_id,
        clientSecret: social.facebook.client_secret,
        callbackURL: social.facebook.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        //done(null, {accessToken: accessToken, profile: profile});
        console.log(accessToken);
        console.log(profile);
    }));
}