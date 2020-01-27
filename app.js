//jshint esversion:7
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const expressSession = require("express-session");
const expressValidator = require("express-validator");
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer({
  destination: (req, file, cb) => {
    cb(null, './images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({
    destination: (req, file, cb) => {
    cb(null, './images/');
  }, 
  filename: (req, file, cb) => {
    cb(req.file.originalname);
  }
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
//app.use(expressValidator());
app.use(express.static((__dirname, 'public')));
app.use('/admin', express.static((__dirname, 'public')));
app.use('/admin/editOfficer', express.static((__dirname, 'public')));
app.use('/admin/editUser', express.static((__dirname, 'public')));
app.use('/admin/map', express.static((__dirname, 'public')));
app.use(expressSession({
  secret: 'max', 
  saveUninitialized: false, 
  resave: false
}));

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


app.get("/", (req, res) =>{
  res.render('index');
});


app.get("/admin", (req, res) =>{
  
  Officer.find({}, (err, off) => {
    if(err){
      console.log(err);
    }else{
      var leng = off.length;
      res.render('admin/index', {
                officers: off,
                offCount: leng
              });
    }
  });

}); 






app.get("/admin/addOfficer", (req, res) => {
  res.render('admin/addOfficer');
});

app.post("/admin/addOfficer", upload.single('officerImage'), (req, res) => {
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


app.get("/admin/allOfficers", (req, res) => {

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

app.get("/admin/editOfficer/:id", (req, res) => {
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

app.get("/admin/allComments", (req, res) => {
  
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

app.get("/admin/applauds", (req, res) => {
  
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

  // comments.doc(id).get()
  // .then(doc => {
  //   var foundComment = [];
  //   var location = {};
  //   if (!doc.exists) {
  //     console.log('No such document!');
  //   } else {
  //     //console.log('Document data:', doc.data());
  //     foundComment.push({
  //                 key: doc.id,
  //                 value: doc.data(),
  //               });
  //     var long = doc.data().location.longitude;
  //     var lat = doc.data().location.latitute;
  //     res.render('admin/map', {foundComment: foundComment, long: long, lat: lat});
  //   }
  // })
  // .catch(err => {
  //   console.log('Error getting document', err);
  // });
  
 
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
  //console.log(req.file.originalname);
  const setUser = new User({
    agency: 'LRA',
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    image: req.file.originalname,
    status: req.body.status,
  });


  setUser.save((err) => {
    if(err){
      console.log(err);
    }else{
      console.log('User saved');
    }
  });

res.redirect("/admin/allUsers");

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





app.get("/login", (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;
  User.findOne({email: email}, (err, foundUser) => {
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === pass){
            redirect('admin/index');
          }
        }
      }
  });
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