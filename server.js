var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var configDB = require('./config/database.js');

mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.use(session({
    secret: 'eminem',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
var options = {
    key: fs.readFileSync('./server/key.pem'),
    cert: fs.readFileSync('./server/crt.pem')
};


require('./app/route')(app, passport);

app.get('/login', (req, res) => {
    res.sendFile('./views/login.html', { root: __dirname });
});

//app.listen(port);
http.createServer(app).listen(8000);
https.createServer(options, app).listen(3000);