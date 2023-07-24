const express = require('express')
const router = express.Router()
const {User, Post, Live, Event} = require('../models/user')
const bcrypt = require('bcrypt')


const ensureAuthenticated = require('../middlewares/authenticate')

router.get('/', ensureAuthenticated, async(req,res) => {
    const posts = await Post.find({})
    const lives = await Live.find({})
    const events = await Event.find({})
    const users= await User.find({username: {$ne: 'fikkyart'}})
    const authUser = req.user.username
    res.render('dashboard', {authUser, posts: posts, lives: lives, events: events, users})
})

router.get('/change-password', ensureAuthenticated, (req,res) => {
    res.render('change-password')
})

router.get('/signup', (req,res) => {
    const error = req.flash('error')
    res.render('signup', {error})
})

router.post('/signup',  (req,res) => {
    var {firstname,surname,username,phone,email,password,repassword} = req.body

    if(password !== repassword){
        req.flash('error', 'Password does not match')
        return res.redirect('signup')
    }

    User.find({username: username}).then(user => {
        if(user == username){
            req.flash('error', 'Username has been taken')
            return res.redirect('signup')
        }
    })

    
    
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if(err){
            req.flash('error', "An error Occured")
            return res.redirect('login')
        }
        const newUser = new User({
            firstname: firstname,
            surname: surname,
            username: username,
            phone: phone,
            email: email,
            password: hashedPassword
        })

        newUser.save().then(() => {
            req.flash('error', "signed up successfully")
            return res.redirect('/login')
        }).catch(err => {
            req.flash('error', "Log in failed")
            return res.redirect('signup')
        })
    })
})


router.post('/post', ensureAuthenticated, (req,res) => {
    const {title, excerpt, content} = req.body

    const myPost = new Post({
        title: title,
        excerpt: excerpt,
        content: content
    })

    myPost.save()
    return res.redirect("/dashboard")
})

router.post('/live', ensureAuthenticated, (req,res) => {
    const {title, src, content, date } = req.body

    const myLive = new Live({
        title: title,
        src: src,
        content: content,
        date: date
    })

    myLive.save()
    return res.redirect("/dashboard")
})

router.post('/event', ensureAuthenticated, (req,res) => {
    const { event, date } = req.body
    console.log(event, date)

    const myEvent = new Event({
        title: event,
        date: date
    })

    myEvent.save().then(() => {
        console.log('new event saved successsfully')
    }).catch(()=> {
        console.log('unable to save event')
    })
    return res.redirect("/dashboard")
})

router.post('/change-password', ensureAuthenticated, async (req, res) => {

    const { oldpassword, newpassword } = req.body;

    await User.find({username: req.user.username}).then(user => {
        if(!user){
            return res.send('user not found')
        }

            bcrypt.hash(newpassword, 10, (err, hashedPassword) => {
                User.replaceOne({username: user.username}, {$set: {password: hashedPassword}})
                return res.json(user)
            })



    })
})

router.get('/live/delete/:src', ensureAuthenticated, (req,res) => {
    const src = req.params.src

    Live.deleteOne({src: src}).then((data) => {
        if(!data){ return res.send('No encounter found!!!')}
        console.log(data)
    })
    res.send('Data deleted successfully')
})

router.get('/event/delete/:title', ensureAuthenticated, (req,res) => {
    const title = req.params.title

    Event.deleteOne({title: title}).then((data) => {
        if(!data){ return res.send('No Event found!!!')}
        console.log(data)
    })
    res.redirect('/dashboard')
})

router.get('encounters/delete/:title', ensureAuthenticated, (req,res) => {
    const title = req.params.title

    Post.deleteOne({title: title}).then((data) => {
        if(!data){ return res.send('No encounter found!!!')}
        console.log(data)
    })
    res.send('Data deleted successfully')
})

router.get('/clear', ensureAuthenticated, (req,res) => {
    Post.deleteMany({}).then(()=> {
        console.log('Posts cleared successfully')
    }).catch(()=> {
        console.log('Unable to Delete Posts')
    })
    Live.deleteMany({}).then(()=> {
        console.log('Lives cleared successfully')
    }).catch(()=> {
        console.log('Unable to Delete Lives')
    })
    Event.deleteMany({}).then(()=> {
        console.log('Users cleared successfully')
    }).catch(()=> {
        console.log('Unable to Delete Users')
    })
    User.deleteMany({}).then(()=> {
        console.log('Users cleared successfully')
    }).catch(()=> {
        console.log('Unable to Delete Users')
    })
    res.redirect('/dashboard')
})

router.get('/live/:src', ensureAuthenticated, async(req,res) => {
    const src = req.params.src

    await Live.delete({src: src})
        .then(result => {
            console.log('Deleted successfullu')
            .catch(err => {
                console.loog('Unable to delete')
            })
        })

    res.redirect('/dashboard')
})

router.get('/delete-user/:username', (req,res) => {
    const username = req.params.username
    const users = User.findOneAndDelete({username: username}).then(users => {
        res.redirect('/dashboard')
    }).catch(() => {
        console.log('Unable to delete user')
    })
})

module.exports = router