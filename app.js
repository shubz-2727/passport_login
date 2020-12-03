const express = require('express');
const expressslayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const  flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const app = express();

require('./passport')(passport);

//DB Config
mongoose.connect('mongodb://localhost:27017/passportuser', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log("mongoDB Connected..."))
    .catch(()=> console.log(err));

// BodyParser
app.use(express.urlencoded({extended: false}));

// Express session middle layer
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

  //Password middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

//Global Vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    next();
})

//EJS
app.use(expressslayouts);
app.set('view engine','ejs');

//ROutes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));