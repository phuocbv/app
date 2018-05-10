var HistoryAccess = require('./model/history-access');
var mongoose = require('mongoose');
var configDB = require('../config/database');

var conn = mongoose.connection;

// check login
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

//save history
function saveHistory(req, res, next) {
    if (req.isAuthenticated()) {
        var history = {
                userID: req.user,
                time: Date.now(),
                url: req.url,
                // count: 
            }
            // HistoryAccess.find({ 'url': req.url }, (err, result) => {
            //     console.log(result);
            //     if (result) {

        //     }
        // });
        conn.collection(configDB.collections.historyAccess).insert(history);
    }
    return next();
}

module.exports = (app, passport) => {
    app.use(saveHistory);

    // =====================================
    // Trang chủ (có các url login) ========
    // =====================================
    app.get('/', (req, res) => {
        res.send('home'); // 
    });

    // =====================================
    // Đăng nập ===============================
    // =====================================
    // hiển thị form đăng nhập
    // app.get('/login', (req, res) => {
    //     res.sendFile('../views/login.html', { root: __dirname });
    // });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // =====================================
    // Đăng ký ==============================
    // =====================================
    // hiển thị form đăng ký
    // app.get('/signup', function(req, res) {
    //     res.render('signup.ejs', { message: req.flash('signupMessage') });
    // });

    // // Xử lý form đăng ký ở đây
    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect: '/profile', // Điều hướng tới trang hiển thị profile
    //     failureRedirect: '/signup', // Trở lại trang đăng ký nếu lỗi
    //     failureFlash: true
    // }));

    // =====================================
    // Thông tin user đăng ký =====================
    // =====================================
    app.get('/profile', isLoggedIn, (req, res) => {
        res.send('profile');
    });

    // =====================================
    // Đăng xuất ==============================
    // =====================================
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    app.get('/auth/facebook', passport.authenticate('facebook-login', {
        scope: ['public_profile', 'email']
    }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
    }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    app.get('/auth/google', passport.authenticate('google-login', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback', passport.authenticate('google-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
    }));
};