var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    sender: {
        fname: {type: String, required: true},
        lname: {type: String, required: true},
        username: {type: String, required: true}
    },
    message: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now}
});

var Message = mongoose.model('Message', messageSchema);

module.exports = {
    Message: Message
}
