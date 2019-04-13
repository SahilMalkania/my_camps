const Campground = require('../models/campground');
const Comment = require('../models/comment')

var middlewareObj = {};

middlewareObj.checkCommentOwnership = (req,res,next) => {
   if(req.isAuthenticated()){       
        Comment.findById(req.params.comment_id, (error, foundComment) => {
          if (error) {
              res.redirect('back');
          }else {
            //does user own the comment?
            if (foundComment.author.id.equals(req.user._id)) {
               return next();
             } else{
              req.flash('error','You do not have permission to do that.');
              res.redirect('back');
             }             
          }
        });
    }else{
      req.flash('error','You must login first!!!');
      res.redirect('back');
    } 
};

middlewareObj.checkCampgroundOwnership = (req,res,next) => {
   if(req.isAuthenticated()){       
        Campground.findById(req.params.id, (error, foundCampground) => {
          if (error) {
              req.flash('error','Campground not found.');
              res.redirect('back');
          }else {
            //does user own the campgrounnd
            if (foundCampground.author.id.equals(req.user._id)) {
               return next();
             } else{
              req.flash('error','You do not have permission to do that/');
              res.redirect('back');
             }             
          }
        });
    }else{
      req.flash('error','You must login first!!!');
      res.redirect('back');
    } 
};

middlewareObj.isLoggedIn = (req,res,next) => {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error','You must login first!!!')
  res.redirect('/login');
}

module.exports = middlewareObj;