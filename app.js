//jshint esversion:7

const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const {userAuthenticated} = require('./helper/auth');
// const {isEmpty} = require('./helper/uploadHelper');
const mongoose = require('mongoose');
const upload = require('express-fileupload');

const isEmpty = (obj) => {
  for(let key in obj){
      if(obj.hasOwnProperty(key)){
          return false;
      }
  }
  return true;
};

mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(upload());

app.use(bodyParser.urlencoded({extended: true}));
//app.use(expressValidator());
app.use(express.static((__dirname, 'public')));
app.use('/admin', express.static((__dirname, 'public')));
app.use('/admin/editOfficer', express.static((__dirname, 'public')));
app.use('/admin/editUser', express.static((__dirname, 'public')));
app.use('/admin/map', express.static((__dirname, 'public')));
app.use('/admin/details', express.static((__dirname, 'public')));
app.use('/static', express.static((__dirname,'public/images/officers')));

app.use(session({
  secret: 'max', 
  saveUninitialized: false, 
  resave: false
}));


app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb+srv://dorbor:Dorbor123@cluster0-8idgt.mongodb.net/findofficer", { useNewUrlParser: true });
var db = mongoose.connection;

const officerSchema = {
  agency: String,
  id: String,
  firstName: String,
  lastName: String,
  image: String,
  assignment: String,
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
  date: String,
  updatedBy: String,
};

// users section
const userSchema = {
  agency: String,
  fullName: String,
  email: String,
  image: String,
  password: String,
  status: String,
};
const categorySchema = {
  agency: String,
  name: String,
  createdAt: String,
  createdBy: String,
};

const User =  mongoose.model('User', userSchema);
const Category =  mongoose.model('Category', categorySchema);
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


app.get("/admin", userAuthenticated,(req, res) =>{

  Officer.find({}).then(off => {
    Comment.find({agency: 'LRA'}).then(comments => {
        var complains = [];
        var applauds = [];
        comments.forEach(com =>{
            if(com.type == 'Complain'){
              complains.push(com);
            }
        });
        comments.forEach(com =>{
          if(com.type == 'Applaud'){
            applauds.push(com);
          }
        });

      res.render('admin/index', 
      {
        officers: off, 
        comments: comments, 
        complains: complains,
        applauds: applauds
      });
    });
  });

}); 



app.get("/admin/addOfficer", userAuthenticated, (req, res) => {

    Comment.find({agency: 'LRA'}).then(comments => {
      var complains = [];
      var applauds = [];
      comments.forEach(com =>{
          if(com.type == 'Complain'){
            complains.push(com);
          }
      });
      comments.forEach(com =>{
        if(com.type == 'Applaud'){
          applauds.push(com);
        }
      });

    res.render('admin/addOfficer', 
    {
      comments: comments, 
      complains: complains,
      applauds: applauds
    });
  });
});

app.post("/admin/addOfficer",  userAuthenticated, (req, res) => {
  let fileName = 'placeHolder.png';
  if(!isEmpty(req.files)){
    const file = req.files.officerImage;
     fileName = file.name;
  
    file.mv('./public/images/officers/'+ fileName, (err) => {
      if(err) {
        console.log(err); 
      }
    });
  
  }
  
 
    const setOfficr = new Officer({
      id: req.body.id,
      agency: 'LRA',
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      image: fileName,
      assignment: req.body.assignment,
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

  res.redirect("/admin/allOfficers");

});


app.get("/admin/allOfficers", userAuthenticated, (req, res) => {

  Officer.find({agency: 'LRA'}).then(off => {
    Comment.find({agency: 'LRA'}).then(comments => {
        var complains = [];
        var applauds = [];
        comments.forEach(com =>{
            if(com.type == 'Complain'){
              complains.push(com);
            }
        });
        comments.forEach(com =>{
          if(com.type == 'Applaud'){
            applauds.push(com);
          }
        });

      res.render('admin/allOfficers', 
      {
        officers: off, 
        comments: comments, 
        complains: complains,
        applauds: applauds
      });
    });
  });
  
});

app.get("/admin/editOfficer/:id", userAuthenticated, (req, res) => {
  const id = req.params.id;

  Officer.findOne({_id: id}).then(foundOff => {
    Comment.find({agency: 'LRA'}).then(comments => {
        var complains = [];
        var applauds = [];
        comments.forEach(com =>{
            if(com.type == 'Complain'){
              complains.push(com);
            }
        });
        comments.forEach(com =>{
          if(com.type == 'Applaud'){
            applauds.push(com);
          }
        });

      res.render('admin/editOfficer', 
      {
        comments: comments, 
        complains: complains,
        applauds: applauds,
        officer: foundOff 
      });
    });
  });
});

///// update officer information
app.post("/admin/editOfficer/:id", userAuthenticated, (req, res) => {

  Officer.findOne({_id: req.params.id}).then(foundOff => {
    Comment.find({agency: 'LRA'}).then(comments => {
        foundOff.id = req.body.id;
        agency =  'LRA';
        foundOff.firstName = req.body.firstName;
        foundOff.middleName  = req.body.middleName;
        foundOff.lastName = req.body.lastName;
        
        if(!isEmpty(req.files)){
          const file = req.files.officerImage;
          let fileName = file.name;
        
          file.mv('./public/images/officers/'+ fileName, (err) => {
            if(err) {
              console.log(err); 
            }
          });
          foundOff.image = fileName;
          }else{
          foundOff.image = foundOff.image;
        }

        foundOff.assignment = req.body.assignment;
        foundOff.email = req.body.email;
        foundOff.gender = req.body.gender;
        foundOff.department = req.body.department;
        foundOff.division = req.body.division;
        foundOff.position = req.body.position;
        foundOff.section = req.body.section;
        foundOff.status = req.body.status;
        
        var complains = [];
        var applauds = [];
        comments.forEach(com =>{
            if(com.type == 'Complain'){
              complains.push(com);
            }
        });
        comments.forEach(com =>{
          if(com.type == 'Applaud'){
            applauds.push(com);
          }
        });

        foundOff.save((err) => {
          if(err){
            console.log(err);
          }else{
            console.log('Updated Seccessfully');
          }
        });

      res.redirect('/admin/allOfficers');

    });
  });
});

//Delete user method
app.get("/admin/deleteOfficer/:id",  userAuthenticated,(req, res) => {
  const id = req.params.id;
  Officer.findByIdAndRemove({_id: id}).then(foundUser => {
      res.redirect('/admin/allOfficers');
  });
});


// apploud and complain section 

app.get("/admin/allComments", userAuthenticated, (req, res) => {
  
  Officer.find({}).then(off => {
    Comment.find({agency: 'LRA'}).then(comments => {
        var complains = [];
        var applauds = [];
        comments.forEach(com =>{
            if(com.type == 'Complain'){
              complains.push(com);
            }
        });
        comments.forEach(com =>{
          if(com.type == 'Applaud'){
            applauds.push(com);
          }
        });

      res.render('admin/allComments', 
      {
        officers: off, 
        comments: comments, 
        complains: complains,
        applauds: applauds
      });
    });
  });
  
});

app.get("/admin/applauds", userAuthenticated, (req, res) => {
  
  Officer.find({}).then(off => {
    Comment.find({agency: 'LRA'}).then(comments => {
        var complains = [];
        var applauds = [];
        comments.forEach(com =>{
            if(com.type == 'Complain'){
              complains.push(com);
            }
        });
        comments.forEach(com =>{
          if(com.type == 'Applaud'){
            applauds.push(com);
          }
        });

      res.render('admin/applauds', 
      {
        officers: off, 
        comments: comments, 
        complains: complains,
        applauds: applauds
      });
    });
  });
  
});

// google map routes 
app.get("/admin/details/:id", userAuthenticated,(req, res) => {
  const id = req.params.id;
  Officer.find({}).then(off => {
    Comment.find({agency: 'LRA'}).then(comments => {
      Comment.findOne({_id: id}).then(foundCom => {
          var complains = [];
          var applauds = [];
          comments.forEach(com =>{
              if(com.type == 'Complain'){
                complains.push(com);
              }
          });
          comments.forEach(com =>{
            if(com.type == 'Applaud'){
              applauds.push(com);
            }
          });

        res.render('admin/commentDetails', 
        {
          officers: off, 
          comments: comments, 
          complains: complains,
          applauds: applauds,
          comment: foundCom
        });
      });
    });
  });
});




// google map routes 
app.get("/admin/map/:id", userAuthenticated,(req, res) => {
  const id = req.params.id;

  Officer.find({}).then(off => {
    Comment.find({agency: 'LRA'}).then(comments => {
      Comment.findOne({_id: id}).then(foundCom => {
          var complains = [];
          var applauds = [];
          comments.forEach(com =>{
              if(com.type == 'Complain'){
                complains.push(com);
              }
          });
          comments.forEach(com =>{
            if(com.type == 'Applaud'){
              applauds.push(com);
            }
          });

        res.render('admin/map', 
        {
          officers: off, 
          comments: comments, 
          complains: complains,
          applauds: applauds,
          comment: foundCom
        });
      });
    });
  });
});

app.get("/admin/map", userAuthenticated,(req, res) => {
 
  Officer.find({}).then(off => {
    Comment.find({agency: 'LRA'}).then(comments => {
        var complains = [];
        var applauds = [];
        comments.forEach(com =>{
            if(com.type == 'Complain'){
              complains.push(com);
            }
        });
        comments.forEach(com =>{
          if(com.type == 'Applaud'){
            applauds.push(com);
          }
        });

      res.render('admin/completeMap', 
      {
        officers: off, 
        comments: comments, 
        complains: complains,
        applauds: applauds
      });
    });
  });
 
});

app.get("/admin/addUser", userAuthenticated,(req, res) => {
  
  Comment.find({agency: 'LRA'}).then(comments => {
      var complains = [];
      var applauds = [];
      comments.forEach(com =>{
          if(com.type == 'Complain'){
            complains.push(com);
          }
      });
      comments.forEach(com =>{
        if(com.type == 'Applaud'){
          applauds.push(com);
        }
      });

    res.render('admin/addUser', 
        {
          comments: comments, 
          complains: complains,
          applauds: applauds
        });
  });
});

app.post("/admin/addUser", userAuthenticated,(req, res) => {
  let fileName = 'placeHolder.png';
  if(!isEmpty(req.files)){
    const file = req.files.userImage;
     fileName = file.name;
  
    file.mv('./public/images/users/'+ fileName, (err) => {
      if(err) {
        console.log(err); 
      }
    });
  
  }
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    // Store hash in your password DB.
  
    const setUser = new User({
      agency: 'LRA',
      fullName: req.body.fullName,
      email: req.body.email,
      image: fileName,
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


app.get("/admin/allUsers", userAuthenticated,(req, res) => {

  User.find({}).then(user => {
    Officer.find({}).then(off => {
      Comment.find({agency: 'LRA'}).then(comments => {
          var complains = [];
          var applauds = [];
          comments.forEach(com =>{
              if(com.type == 'Complain'){
                complains.push(com);
              }
          });
          comments.forEach(com =>{
            if(com.type == 'Applaud'){
              applauds.push(com);
            }
          });
  
        res.render('admin/allUsers', 
        {
          officers: off, 
          comments: comments, 
          complains: complains,
          applauds: applauds,
          users: user
        });
      });
    });
  });

});

app.get("/admin/editUser/:id", userAuthenticated,(req, res) => {
  const id = req.params.id;
  User.findOne({_id: id}).then(foundUser=> {
        Comment.find({agency: 'LRA'}).then(comments => {
          var complains = [];
          var applauds = [];
          comments.forEach(com =>{
              if(com.type == 'Complain'){
                complains.push(com);
              }
          });
          comments.forEach(com =>{
            if(com.type == 'Applaud'){
              applauds.push(com);
            }
          });
  
        res.render('admin/editUser', 
        {
          comments: comments, 
          complains: complains,
          applauds: applauds,
          foundUser: foundUser
        });
      });
  });
});

// Edit user
app.post("/admin/editUser/:id", userAuthenticated,(req, res) => {
  const id = req.params.id;
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    // Store hash in your password DB.
    User.findOne({_id: id}).then(foundUser=> {
      foundUser.agency = 'LRA';
      foundUser.fullName = req.body.fullName;
      foundUser.email = req.body.email;
      if(!isEmpty(req.files)){
        // let file = req.files.userImage;
        // let fileName = file.name;
      
        // file.mv('./public/images/users/'+ fileName, (err) => {
        //   if(err) {
        //     console.log(err); 
        //   }
        // });
        // foundUser.image = fileName;
      }else{
        foundUser.image = foundUser.image;
      }
      foundUser.password = hash;
      foundUser.status = req.body.status;
      
      foundUser.save((err) => {
        if(err){
          console.log(err);
        }else{
          res.redirect("/admin/allUsers");
        }
      });
    });
  });


});


//Delete user method
app.get("/admin/user/:id",  userAuthenticated,(req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove({_id: id}).then(foundUser => {
      res.redirect('/admin/allUsers');
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
app.route('/api/lra/officers')
.get((req, res) => {
  Officer.find({agency: 'LRA'}).then(foundOff => {
      res.send(foundOff);
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