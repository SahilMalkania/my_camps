var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//Comments New
router.get('/new', middleware.isLoggedIn, (req,res) => {
   Campground.findById(req.params.id,(error,campground) => {
     if(error)
     {
       console.log(error);
     } else {      
       res.render('Comments/new',{campground});
     }
   })
});

//Comments create
router.post('/', middleware.isLoggedIn,(req,res) => {
   Campground.findById(req.params.id,(error,campground) => {
     if(error)
     {
       console.log(error);
       res.redirect('/campgrounds');
     } else {      
        Comment.create(req.body.comment, (error,comment) => {
           if(error){
             req.flash('error','Something went wrong.')
             res.redirect('/campgrounds');
           } else{
            //add username and id to comment
              comment.author.id = req.user._id;
              comment.author.username=req.user.username;
              comment.save();
              campground.comments.push(comment);
              campground.save();
              req.flash('success','Successfully added comment')
              res.redirect(`/campgrounds/${campground._id}`);
           }
        });
     }
   })
});


//Comment edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req,res) => {
   Comment.findById(req.params.comment_id, (error, foundComment) => {
       if(error){
         res.redirect('/back');
       } else {
         res.render('Comments/edit',{campground_id:req.params.id, comment: foundComment});    
       }
   });    
});
router.put('/:comment_id', middleware.checkCommentOwnership, (req,res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (error,updatesComment) => {
      if(error){
        res.redirect('back');
      } else{
        res.redirect(`/campgrounds/${req.params.id}`);
      }
  });
});

//Comment Destroy Route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req,res)=>{
  //find and delete comment
  Comment.findByIdAndRemove(req.params.comment_id, (error) => {
     if(error){
        res.redirect('back');
     } else{
        req.flash('success','Comment deleted');
        res.redirect(`/campgrounds/${req.params.id}`);
     }
  });
});

module.exports = router;

