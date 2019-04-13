var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//Root route
router.get('/',(req,res) => {
   res.render('landing');
});

//Show Register form
router.get('/register', (req,res)=> {
  res.render('register');
 });
//Handle Sign up
router.post('/register',(req,res) => {
  var newUser = new User({username:req.body.username});
  User.register(newUser,req.body.password,(error,user) => {
      if(error){
         return res.render("register", {error: error.message});
      }
      passport.authenticate('local')(req,res,() => {
        req.flash('success',`Welcome to YelpCamp ${user.username}`);
        res.redirect('/campgrounds');
      })
  })
});

//Show Login form
router.get('/login',(req,res)=>{
  res.render('login');
});
//Handle Login logic
router.post('/login', passport.authenticate('local',{
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}) ,(req,res)=>{});

//logout route
router.get('/logout', (req,res) => {
  req.logout();
  req.flash('success','Logged you out!!!');
  res.redirect('/campgrounds');
});

 function isLoggedIn (req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;