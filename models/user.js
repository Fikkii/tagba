const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');

const userSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    surname: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String , required: true, unique: true},
  })

  const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    date: {type: String, default: new Date()},
    excerpt: {type: String, required: true},
    content: {type: String, required: true}
  })

  const liveSchema = new mongoose.Schema({
    src: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String},
    date: {type: Date, default: new Date}
  })

  const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    date: {type: String, required: true}
  })

const User = mongoose.model('User', userSchema)
const Post = mongoose.model('Post', postSchema)
const Live = mongoose.model('Live', liveSchema)
const Event = mongoose.model('Event', eventSchema)

module.exports = {
  User,
  Post,
  Live,
  Event
}