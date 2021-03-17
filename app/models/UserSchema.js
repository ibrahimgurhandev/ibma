const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

const {Schema} = mongoose;

/**
 * User Schema, Not using numbers directly, 
 * currentRoom will be a number in string form
 * along with proficiency.
 */
const userSchema = new Schema({

   local: { email: String,
    password: String },
    headLine: String,
    name: String,
    languages: [{id: Number, proficiency: Number }],
    friends: [String],
    room: String,
    socketId: String
}
)

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports =  mongoose.model('User', userSchema)