//jshint esversion:7
//require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");

const admin = require('firebase-admin');
const functions = require('firebase-functions');



let serviceAccount = require('./findofficer.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static("public"));
app.use(express.static((__dirname, 'public')));
app.use('/admin', express.static((__dirname, 'public')));
app.use('/admin/editOfficer', express.static((__dirname, 'public')));
app.use('/admin/map', express.static((__dirname, 'public')));


const officers = db.collection('officers');
const comments = db.collection('comments');
app.get("/", (req, res) =>{
  res.render('index');
});

app.get("/admin", (req, res) =>{
  res.render('admin/index');
}); 

app.get("/admin/addOfficer", (req, res) => {
  res.render('admin/addOfficer');
});

app.post("/admin/addOfficer", (req, res) => {

    let setOfficr = {
        id: req.body.id,
        agency: 'LRA',
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        department: req.body.department,
        division: req.body.division,
        position: req.body.position,
        section: req.body.section,
        status: req.body.status,
      };


  officers.add(setOfficr);

  res.redirect("/admin");

});


app.get("/admin/allOfficers", (req, res) => {
  
  officers.get()
  .then(snapshot => {
    var newOfficer = [];
    snapshot.forEach(doc => {
      newOfficer.push({
                  key: doc.id,
                  value: doc.data(),
                });
      //console.log(newOfficer);
    });
    res.render('admin/allOfficers', {officers: newOfficer});
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });

  //res.render('/admin/allOfficers', {officers: newOfficer});
  
});

app.get("/admin/editOfficer/:id", (req, res) => {
  const id = req.params.id;
  officers.doc(id).get()
  .then(doc => {
    var foundOfficer = [];
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      //console.log('Document data:', doc.data());
      foundOfficer.push({
                  key: doc.id,
                  value: doc.data(),
                });
      console.log(foundOfficer);
      res.render('admin/editOfficer', {foundOfficer: foundOfficer});
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });
  
 
});


// apploud and complain section 

app.get("/admin/allComments", (req, res) => {
  
  comments.get()
  .then(snapshot => {
    var newComments = [];
    snapshot.forEach(doc => {
      newComments.push({
                  key: doc.id,
                  value: doc.data(),
                });
      console.log(newComments);
    });
    res.render('admin/allComments', {comments: newComments});
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });
  
});

app.get("/admin/applauds", (req, res) => {
  
  comments.get()
  .then(snapshot => {
    var newComments = [];
    snapshot.forEach(doc => {
      newComments.push({
                  key: doc.id,
                  value: doc.data(),
                });
      console.log(newComments);
    });
    res.render('admin/applauds', {comments: newComments});
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });
  
});

app.get("/admin/map/:id", (req, res) => {
  const id = req.params.id;
  comments.doc(id).get()
  .then(doc => {
    var foundComment = [];
    var location = {};
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      //console.log('Document data:', doc.data());
      foundComment.push({
                  key: doc.id,
                  value: doc.data(),
                });
      var long = doc.data().location.longitude;
      var lat = doc.data().location.latitute;
      res.render('admin/map', {foundComment: foundComment, long: long, lat: lat});
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });
  
 
});


// app.post("/compose", function(req, res){
//
//   const post = new Post ({
//     title: req.body.postTitle,
//     content: req.body.postBody
//   });
//
//   post.save();
//
//   res.redirect("/");
//
// });

// app.get("/posts/:postName", function(req, res){
//   const requestedTitle = _.lowerCase(req.params.postName);
//
//   posts.forEach(function(post){
//     const storedTitle = _.lowerCase(post.title);
//
//     if (storedTitle === requestedTitle) {
//       res.render("post", {
//         title: post.title,
//         content: post.content
//       });
//     }
//   });
//
// });

// app.get("/about", function(req, res){
//   res.render("about", {aboutContent: aboutContent});
// });
//
// app.get("/contact", function(req, res){
//   res.render("contact", {contactContent: contactContent});
// });

// eslint-disable-next-line no-magic-numbers
app.listen(3000,  () => {
  console.log('Server started on port 3000');
});