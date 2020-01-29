//jshint esversion:7
const express = require('express');
const router = express.Router();

  
router.get("/admin", (req, res) =>{  
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
  
  router.get("/admin/addOfficer", (req, res) => {
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
  
  
  router.get("/admin/allOfficers", (req, res) => {
  
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
  
  router.get("/admin/editOfficer/:id", (req, res) => {
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
  
  router.get("/admin/allComments", (req, res) => {
    
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
  
  router.get("/admin/applauds", (req, res) => {
    
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
  router.get("/admin/map/:id", (req, res) => {
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
  
  router.get("/admin/map", (req, res) => {
   
      Comment.findOne((err, foundCom) => {
        if(err){
          console.log(err);
        }else{
          res.render('admin/completeMap', { comments: foundCom });
        }
    });
   
  });
  
  
  router.get("/admin/addUser", (req, res) => {
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
  
  
  router.get("/admin/allUsers", (req, res) => {
  
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
  
  router.get("/admin/editUser/:id", (req, res) => {
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
  
  router.get("/admin/user/:id", (req, res) => {
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
  
  
  
  
  
  app.post("/login", (req, res) => {
    const postEmail = req.body.email;
    const pass = req.body.password;
    User.findOne({email: postEmail}, (err, foundUser) => {
        if(err){
          console.log(err);
        }else if(!foundUser){
          res.render('index', {message: 'Sorry, user not found'});
        }else{
          if(foundUser){
            bcrypt.compare(pass, foundUser.password, function(err, result) {
              if(result == true){
                res.redirect('/admin');
              }else{
                res.render('index', {message: 'Sorry Email/Password is incorrect'});
              }
             });
          }
        }
    });
    
  });
  
  
  
  
  
  module.exports = router;
  
  