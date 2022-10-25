const express=require("express")
const mongoose = require("mongoose")
const dotenv=require("dotenv")
const connectDB=require('./config/db')
const morgan = require("morgan")
const passport= require("passport")
const session=require("express-session")
const MongoStore=require('connect-mongo')
const bodyParser = require('body-parser');

// Load config
dotenv.config({path: './config/config.env'})

// passport config
require('./config/passport')(passport)

connectDB()

const app=express()

// LOGGING
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

// sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
    // cookie: { secure: true }
  }))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// Routes
app.use('/', require('./routes/index.js'));

const PORT= process.env.PORT || 5000



app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));