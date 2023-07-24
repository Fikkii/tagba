const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const express = require('express')
const {User} = require('./models/user')

const app = express()



app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      
      if(password.length < 8){
        return done(null, false, req.flash('error', "Password must be atleast 8 characters long"))
      }
  
      User.findOne({username: username})
        .then(user => {
          if(!user) {
            return done(null, false, req.flash('error', "Invalid username or password"))
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) {
              return done(err)
            }
            if(!isMatch) {
              return done(null, false,  req.flash('error', "Invalid username or password"))
            }
            return done(null, user)
          })
        }).catch(err => { return done(err)})
    }
  ))
  
passport.serializeUser((user, done) => {
done(null, user._id)
})

passport.deserializeUser((_id, done) => {
User.findOne({_id: _id})
    .then(user => {
    return done(null, user)
    })
    .catch(err => { done(err)})
})

module.exports = passport