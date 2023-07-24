const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./db')
const flash = require('connect-flash')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(flash())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
  secret: 'MY SECRET KEY',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

const routes = require('./routes/index')
const authenticateRoutes = require('./routes/authenticate')

app.use('/', routes)
app.use('/dashboard', authenticateRoutes)

app.use((req, res, next) => {
  res.status(404).render('error_page');
});


app.listen(3000, () => console.log('App started on port 3000'))