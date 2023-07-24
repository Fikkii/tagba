const express = require('express')
const router = express.Router()
const ensureAuthenticated = require('../middlewares/authenticate')
const passport = require('../passport-config.js')
const flash = require('connect-flash')
const {User, Post, Live, Event} = require('../models/user')
const bcrypt = require('bcrypt')

const app = express()
app.use(flash())


router.get('/', async (req,res) => {
   const posts = await Post.find({})
   const lives = await Live.find({})
   const events = await Event.find({})
    res.render('index', {posts: posts, lives: lives, events: events})
})

router.get('/encounters', async(req,res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;

    const offset = (currentPage - 1) * itemsPerPage;
    const limit = itemsPerPage;

    const posts = await Post.find({}).skip(offset).limit(limit)
    const totalPosts = await Post.countDocuments();

    const totalPages = Math.ceil(totalPosts / itemsPerPage)
    
    res.render('pages/encounters_posts', {posts: posts, totalPages: totalPages, pageNum: req.query.page})
    console.log(posts)
})

router.get('/encounters/:title', (req,res) => {
    const title = req.params.title

    Post.findOne({title: title}).then((data) => {
        if(!data){ return res.send('No encounter found!!!')}
        console.log(data)
    return res.render('pages/encounter', {encounters: data})
    }) 
})

router.get('/login', (req,res) => {
    const error = req.flash('error')
    res.render('login', {error: error})
}) 
  
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}))

 
router.get('/live', async(req,res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;

    const offset = (currentPage - 1) * itemsPerPage;
    const limit = itemsPerPage;

    const lives = await Live.find({}).sort({date: 1}).skip(offset).limit(limit)
    const totalPosts = await Live.countDocuments();

    const totalPages = Math.ceil(totalPosts / itemsPerPage)
    res.render('pages/live', {lives: lives, totalPages, pageNum: req.query.page})
})
 
router.get('/testimonies', (req,res) => {
    res.render('pages/testimonies')
})
 
router.get('/events', (req,res) => {
    res.render('pages/events')
})
 
module.exports = router