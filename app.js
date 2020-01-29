//jshint esversion:7

const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const {userAuthenticated} = require('./helper/auth');
const mongoose = require('mongoose');
const multer = require('multer');

const upload = multer({
    destination: (req, file, cb) => {
    cb(null, './images/');
  }, 
  filename: (req, file, cb) => {
    cb(req.file.originalname);
  }
});
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
//app.use(expressValidator());
app.use(express.static((__dirname, 'public')));
app.use('/admin', express.static((__dirname, 'public')));
app.use('/admin/editOfficer', express.static((__dirname, 'public')));
app.use('/admin/editUser', express.static((__dirname, 'public')));
app.use('/admin/map', express.static((__dirname, 'public')));
app.use(session({
  secret: 'max', 
  saveUninitialized: false, 
  resave: false
}));


app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb+srv://dorbor:Dorbor123@cluster0-8idgt.mongodb.net/findofficer", { useUnifiedTopology: true });

var db = mongoose.connection;

const officerSchema = {
  agency: String,
  id: String,
  firstName: String,
  lastName: String,
  image: String,
  middleName: String,
  email: String,
  gender: String,
  department: String,
  division: String,
  position: String,
  section: String,
  status: String,
};

const commentSchema = {
  officerId: String,
  type: String,
  agency: String,
  fullName: String,
  number: String,
  email: String,
  content: String,
  county: String,
  latitude: String,
  longitude: String,
};
const Officer =  mongoose.model('Officer', officerSchema);
const Comment =  mongoose.model('Comment', commentSchema);

app.use( (req, res, next) => {
  res.locals.user = req.user || null;
  // req.locals.success_message = req.flash('success_message');
  // req.locals.error_message = req.flash('error_message');
  // req.locals.form_errors = req.flash('form_errors');
  next();
});

app.get("/", (req, res) =>{
  res.render('index');
});


app.get("/admin", userAuthenticated, (req, res) =>{

  Officer.find({}).then(off => {
    Comment.find({}).then(comments => {
      res.render('admin/index', {officers: off, comments: comments});
    });
  });

}); 






app.get("/admin/addOfficer", userAuthenticated, (req, res) => {
  res.render('admin/addOfficer');
});

app.post("/admin/addOfficer", upload.single('officerImage'), userAuthenticated, (req, res) => {
    console.log(req.file.originalname);
    const setOfficr = new Officer({
      id: req.body.id,
      agency: 'LRA',
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      image: req.file.originalname,
      email: req.body.email,
      gender: req.body.gender,
      department: req.body.department,
      division: req.body.division,
      position: req.body.position,
      section: req.body.section,
      status: req.body.status,
    });


    setOfficr.save((err) => {
      if(err){
        console.log(err);
      }else{
        console.log('saved');
      }
    });

  res.redirect("/");

});


app.get("/admin/allOfficers", userAuthenticated, (req, res) => {

  Officer.find({}, (err, off) => {
    if(err){
      console.log(err);
    }else{
      var leng = off.length;
      res.render('admin/allOfficers', {
                officers: off,
                offCount: leng
              });
    }
  });
  
});

app.get("/admin/editOfficer/:id", userAuthenticated, (req, res) => {
  const id = req.params.id;
  Officer.findOne({_id: id}, (err, foundOff) => {
      if(err){
        console.log(err);
      }else{
        //show an existing listm
        res.render('admin/editOfficer', { officer: foundOff });
      }
  });
});


// apploud and complain section 

app.get("/admin/allComments", userAuthenticated, (req, res) => {
  
  Comment.find({}, (err, co) => {
    if(err){
      console.log(err);
    }else{
      res.render('admin/allComments', {
                comments: co
              });
    }
  });
  
});

app.get("/admin/applauds", userAuthenticated, (req, res) => {
  
  Comment.find({}, (err, co) => {
    if(err){
      console.log(err);
    }else{
      res.render('admin/applauds', {
                comments: co
              });
    }
  });
  
});



// google map routes 
app.get("/admin/map/:id", (req, res) => {
  const id = req.params.id;

    Comment.findOne({_id: id}, (err, foundCom) => {
      if(err){
        console.log(err);
      }else{
        //show an existing listm
        res.render('admin/map', { comment: foundCom });
      }
  });
 
});

app.get("/admin/map", (req, res) => {
 
    Comment.findOne((err, foundCom) => {
      if(err){
        console.log(err);
      }else{
        res.render('admin/completeMap', { comments: foundCom });
      }
  });
 
});

// users section
const userSchema = {
  agency: String,
  fullName: String,
  email: String,
  password: String,
  status: String
};

const User =  mongoose.model('User', userSchema);

app.get("/admin/addUser", (req, res) => {
  res.render('admin/addUser');
});

app.post("/admin/addUser", upload.single('image'), (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    // Store hash in your password DB.
  
    const setUser = new User({
      agency: 'LRA',
      fullName: req.body.fullName,
      email: req.body.email,
      password: hash,
      status: req.body.status,
    });
  
    setUser.save((err) => {
      if(err){
        console.log(err);
      }else{
        res.redirect("/admin/allUsers");
      }
    });
});

});


app.get("/admin/allUsers", (req, res) => {

  User.find({}, (err, user) => {
    if(err){
      console.log(err);
    }else{
      var leng = user.length;
      res.render('admin/allUsers', {
                users: user,
                userCount: leng
              });
    }
  });

});

app.get("/admin/editUser/:id", (req, res) => {
const id = req.params.id;
User.findOne({_id: id}, (err, foundUser) => {
    if(err){
      console.log(err);
    }else{
      //show an existing listm
      res.render('admin/editUser', { user: foundUser });
    }
});
});

//Delete user method
app.get("/admin/user/:id",  (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove({_id: id}, (err, foundUser) => {
      if(err){
        console.log(err);
      }else{
        //show an existing listm
        res.redirect('/admin/allUsers');
      }
  });
});


passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  User.findOne({ email: email }).then(user => {
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    
    bcrypt.compare(password, user.password, (err, matched) =>{
      if(err) return err;
      if(matched){
        return done(null, user);
      }else{
        return done(null, false, {message: 'Incorrect Password'});
      }
    });
  });
}));

passport.serializeUser((user, done)=>{
  done(null, user.id);
});
passport.deserializeUser((id, done)=>{
  User.findById(id, (err, user) =>{
    done(err, user);
  });
});

app.post("/login", (req, res, next)=>{
  passport.authenticate('local', {
    successRedirect:'/admin',
    failureRedirect:'/',
    // failureFlash: true
  })(req, res, next);
 });
 
 app.get('/logout', (req, res) => {
     req.logOut();
     res.redirect('/');
 });










//  apis section

///request for all officers ///////////
app.route('/api/officers')
.get((req, res) => {
  Officer.find((err, foundOff) => {
    if(!err){
      res.send(foundOff);
    }else{
      res.send(err);
    }
  });
});

/////request for all articles ///////////
app.route('/api/comment')

.post((req, res) => {
  const comment = new Comment ({
    officerId: req.body.officerId,
    type: req.body.type,
    agency: req.body.agency,
    fullName: req.body.fullName,
    number: req.body.number,
    email: req.body.email,
    content: req.body.content,
    county: req.body.county,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  comment.save((err) => {
    if(!err){
      res.send(' send Successfully');
    }else{
      res.send(err);
    }
  });
});

app.route('/api/officers/:id')

.get((req, res) => {
  
  Officer.findOne({id: req.params.id}, (err, foundOfficer) => {
    if(foundOfficer){
      res.send(foundOfficer);
    }else{
      res.send('No matched found');
    }
  });
});

// eslint-disable-next-line no-magic-numbers

let port = process.env.PORT;
if(port == null || port == '') {
  port = 3000;
}

app.listen(port,  () => {
  console.log('Server started on port 3000');
});