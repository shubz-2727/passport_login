const express = require('express')
const router = express.Router();
const { ensureAuthenticated, loginUser } = require('../auth');

router.get('/', loginUser, (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req,res) => 
        res.render('dashboard',{
            name:req.user.name
        }))
module.exports = router;