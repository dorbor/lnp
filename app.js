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
app.use('/admin/map', express.static((__dirname, 'public')));
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));

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

const Officer =  mongoose.model('Officer', officerSchema);


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
  //console.log(newOfficer);
    //res.render('admin/index');
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


// // apploud and complain section 

// app.get("/admin/allComments", (req, res) => {
  
//   comments.get()
//   .then(snapshot => {
//     var newComments = []; 
//     snapshot.forEach(doc => {
//       newComments.push({
//                   key: doc.id,
//                   value: doc.data(),
//                 });
//       console.log(newComments);
//     });
//     res.render('admin/allComments', {comments: newComments});
//   })
//   .catch(err => {
//     console.log('Error getting documents', err);
//   });
  
// });

// app.get("/admin/applauds", (req, res) => {
  
//   comments.get()
//   .then(snapshot => {
//     var newComments = [];
//     snapshot.forEach(doc => {
//       newComments.push({
//                   key: doc.id,
//                   value: doc.data(),
//                 });
//       console.log(newComments);
//     });
//     res.render('admin/applauds', {comments: newComments});
//   })
//   .catch(err => {
//     console.log('Error getting documents', err);
//   });
  
// });

// app.get("/admin/map/:id", (req, res) => {
//   const id = req.params.id;
//   comments.doc(id).get()
//   .then(doc => {
//     var foundComment = [];
//     var location = {};
//     if (!doc.exists) {
//       console.log('No such document!');
//     } else {
//       //console.log('Document data:', doc.data());
//       foundComment.push({
//                   key: doc.id,
//                   value: doc.data(),
//                 });
//       var long = doc.data().location.longitude;
//       var lat = doc.data().location.latitute;
//       res.render('admin/map', {foundComment: foundComment, long: long, lat: lat});
//     }
//   })
//   .catch(err => {
//     console.log('Error getting document', err);
//   });
  
 
// });












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

///request for all articles ///////////
// app.route('/api/comment')
// .post((req, res) => {
//   const newArticle = new Article ({
//     title: req.body.title,
//     content: req.body.content,
//   });

//   newArticle.save((err) => {
//     if(!err){
//       res.send('Successfully added a new article');
//     }else{
//       res.send(err);
//     }
//   });
// });

// eslint-disable-next-line no-magic-numbers

let port = process.env.PORT;
if(port == null || port == '') {
  port = 3000;
}

app.listen(port,  () => {
  console.log('Server started on port 3000');
});