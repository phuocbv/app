var HistoryAccess = require('../model/history-access');
var mongoose = require('mongoose');
var configDB = require('../../config/database');
var conn = mongoose.connection;

module.exports = {
    //is loggedIn
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },

    //save history
    saveHistory: (req, res, next) => {
        if (req.isAuthenticated()) {
            var history = {
                userID: req.user,
                time: Date.now(),
                url: req.url,
            }
            conn.collection(configDB.collections.historyAccess).insert(history);
        }
        return next();
    }
}