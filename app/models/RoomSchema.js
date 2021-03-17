const mongoose = require('mongoose');
const {Schema} = mongoose;

/**
 * 
 */
const roomSchema = new Schema({
    name: String,
    message: [{userId: String, text: String}],
    attendees: [String]
})

module.exports =  mongoose.model('Room', roomSchema)