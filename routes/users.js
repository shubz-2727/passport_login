const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const password =  require('passport')
const {loginUser } = require('../auth');

router.get('/login',loginUser, (req, res) => res.render('login'));

router.get('/register',loginUser, (req, res) => res.render('register'));

//Register handle
router.post('/register', (req, res) =>{
    const {name, email, password, password2 } = req.body;
    let errors = [];
    //console.log(req.body);
    
    //Check required Fields
    if(!name || !email || !password ||!password2){
        errors.push({msg:'Please fill in all fields'})
    }

    if(password !== password2){
        errors.push({msg:'Password do not match'})
    }

    if(password.length < 6){
        errors.push({msg:"Password should be at least 6 characters"});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //Validation Passed
        User.find({email:email})
            .then(user => {
                if(user.length > 0){
                    
                    errors.push({msg:'Email is already registered' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2 
                    });
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if(err) throw err;

                            newUser.password = hash;
                            newUser.save()
                                .then( user =>{
                                    req.flash('success_msg', 'You are now registered and can now login')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                    }))
                }
            });
    }

});

//Login Handle
router.post('/login', (req, res, next)=>{
    password.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//Logout Handel

router.get('/logout', (req,res) =>{
    req.logout();
    req.flash('success_msg', 'You are logout');
    res.redirect('/users/login');
})
module.exports = router;