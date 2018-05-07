var mongoose = require('mongoose');
var historyAccess = mongoose.Schema({
    userID: String,
    url: String,
    time: String
});

module.exports = mongoose.model('historyAccess', historyAccess, 'historyAccess');