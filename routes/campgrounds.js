var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

//Index- show all camps
router.get('/',(req,res) => {
  Campground.find({}, (error,allCampgrounds) => {
    if(error){
      console.log(error);
    } else {
       res.render('Campgrounds/index',{campgrounds:allCampgrounds, currentUser: req.user});
    }
  });
});

//Create - add new camp to db
router.post('/', middleware.isLoggedIn,(req,res) => {
	var name= req.body.name;
  var price = req.body.price;
	var image= req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
	var newCampground = {name,price,image,description,author};
  Campground.create(newCampground,(error,newlyCreated) => {
    if(error){
      console.log(error);
    } else {
      res.redirect('/campgrounds');      
    }
  });
});

//New- show form to create new campground
router.get('/new', middleware.isLoggedIn, (req,res) => {
  res.render('Campgrounds/new');
});

//Show- shows more info about one campground
router.get('/:id',(req,res) => {
   Campground.findById(req.params.id).populate('comments').exec((error,foundCampground) => {
        if(error){
          console.log(error);
         } else {          
          res.render('Campgrounds/show',{campground:foundCampground});
        }
   });
});

//Edit route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req,res) => {
     Campground.findById(req.params.id, (error, foundCampground) => {
        res.render('Campgrounds/edit',{campground: foundCampground});
     });
});
router.put('/:id', middleware.checkCampgroundOwnership,(req,res) => {
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,(error,updatedCampground) => {
     if(error){
       res.redirect('/campgrounds');
     }else{
      res.redirect(`/campgrounds/${req.params.id}`);
     }
   });
});

//Destroy route
router.delete('/:id', middleware.checkCampgroundOwnership,(req,res) => {
   Campground.findByIdAndRemove(req.params.id, (error) => {
      if(error){
        res.redirect('/campgrounds');
      } else{
        res.redirect('/campgrounds');
      }
   })
});

module.exports = router;

