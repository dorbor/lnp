//jshint esversion:7
const express = require('express');
const router = express.Router();

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({ email: email }).then(user => {
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      
      bcrypt.compare(password, user.password, (err, matched ) =>{
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
  
  
  router.post("/login", (req, res, next)=>{
   passport.authenticate('local', {
     successRedirect:'/admin',
     failureRedirect:'/',
     failureFlash: true
   })(req, res, next);
  });
  
  router.get('/logout', (req, res) => {
      req.logOut();
      res.redirect('/');
  });
  

  module.exports = router;