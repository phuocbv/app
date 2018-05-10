var mongoose = require('mongoose');
var historyAccess = new mongoose.Schema({
    userID: String,
    url: String,
    time: String,
    count: String
});

module.exports = mongoose.model('historyAccess', historyAccess, 'historyAccess');