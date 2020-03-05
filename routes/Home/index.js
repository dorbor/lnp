//jshint esversion:7
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  Officer.find({}, (err, off) => {
    if (err) {
      console.log(err);
    } else {
      var leng = off.length;
      res.render("admin/index", {
        officers: off,
        offCount: leng
      });
    }
  });
});

router.get("/allOfficers", (req, res) => {
  Officer.find({}, (err, off) => {
    if (err) {
      console.log(err);
    } else {
      var leng = off.length;
      res.render("admin/allOfficers", {
        officers: off,
        offCount: leng
      });
    }
  });
});

// apploud and complain section

router.get("/allComments", (req, res) => {
  Comment.find({}, (err, co) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/allComments", {
        comments: co
      });
    }
  });
});

router.get("/applauds", (req, res) => {
  Comment.find({}, (err, co) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/applauds", {
        comments: co
      });
    }
  });
});

// google map routes
router.get("/map/:id", (req, res) => {
  const id = req.params.id;

  Comment.findOne({ _id: id }, (err, foundCom) => {
    if (err) {
      console.log(err);
    } else {
      //show an existing listm
      res.render("admin/map", { comment: foundCom });
    }
  });
});

router.get("/admin/map", (req, res) => {
  Comment.findOne((err, foundCom) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/completeMap", { comments: foundCom });
    }
  });
});

router.get("/admin/addUser", (req, res) => {
  res.render("admin/addUser");
});

app.post("/admin/addUser", upload.single("image"), (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    // Store hash in your password DB.
    const setUser = new User({
      agency: "LRA",
      fullName: req.body.fullName,
      email: req.body.email,
      password: hash,
      status: req.body.status
    });

    setUser.save(err => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/admin/allUsers");
      }
    });
  });
});

router.get("/admin/allUsers", (req, res) => {
  User.find({}, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      var leng = user.length;
      res.render("admin/allUsers", {
        users: user,
        userCount: leng
      });
    }
  });
});

router.get("/admin/editUser/:id", (req, res) => {
  const id = req.params.id;
  User.findOne({ _id: id }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      //show an existing listm
      res.render("admin/editUser", { user: foundUser });
    }
  });
});

router.get("/admin/user/:id", (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove({ _id: id }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      //show an existing listm
      res.redirect("/admin/allUsers");
    }
  });
});

module.exports = router;
