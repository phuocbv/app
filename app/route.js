module.exports = (app, passport) => {
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
    app.get('/profile', (req, res) => {
        res.send('profile');
    });

    // =====================================
    // Đăng xuất ==============================
    // =====================================
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/facebook', passport.authenticate('facebook-login'), (req, res) => {
        res.send('ok');
    });

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
        res.redirect('/account');
    });
};

// check login
function isLoggedIn(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}