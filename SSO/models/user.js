var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  email: {type: String,},
  password: {type: String},
  name: {type: String, max: 500},
  avatar: {type: String}
})

module.exports = mongoose.model('User', userSchema)