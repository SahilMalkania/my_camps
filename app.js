const express        =  require('express');
const bodyParser     =  require('body-parser');
const mongoose       =  require('mongoose');
const passport       =  require('passport');
const LocalStrategy  =  require('passport-local');
const methodOverride =  require('method-override');
const flash          =  require('connect-flash');
var moment           =  require('moment');
var Campground       =  require('./models/campground');
var Comment          =  require('./models/comment');
const User           =  require('./models/user');

var indexRoutes      =  require('./routes/index');
var commentRoutes    =  require('./routes/comments');
var campgroundRoutes =  require('./routes/campgrounds');

var app= express();
//mongoose.connect('mongodb://localhost/my_camp',{useNewUrlParser: true});
mongoose.connect('mongodb+srv://sahil:lpoikmnju@mycamps-wj8wv.mongodb.net/test?retryWrites=true',{useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');

//Passport Configuration
app.use(require('express-session')({
  secret:'Hello there',
  resave:false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use(indexRoutes);

app.listen(3000,() => {
  console.log('Server is up');
});