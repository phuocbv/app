var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var user = mongoose.Schema({
    local: {
        username: String,
        password: String
    }
});

user.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// user.methods.validPassword = (password, done) => {
//     return bcrypt.compare(password, this.password);
// }

module.exports = mongoose.model('User', user, 'user');