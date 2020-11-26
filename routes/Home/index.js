const express = require("express");
const router = express.Router();
const passport = require("passport");
const {isEmpty} = require('../../helper/uploadhelper');




// include models 
const Audit = require("../../models/Audit");
const Position = require("../../models/Position");
const Officer = require("../../models/Officer");
const Comment = require("../../models/Comment");


router.get("/", (req, res) => {
    res.render("index");
  });



  router.get("/findOfficer", (req, res) => {
    let findId = req.query.id;
    if (findId === "" || isEmpty(findId)) {
      findId = "0000";
    } else if (findId.length < 4 || findId.length > 4) {
      res.render("index", { message: "Officer Id must be 4 digits" });
    }
  
    Officer.findOne({ agency: "LNP", id: findId }).then((off) => {
      if (!off) {
        res.render("index", {
          message: "Officer not found \n Please enter a valid Officer id",
        });
      }
      res.render("officerDetails", { officer: off });
    });
  });


  router.get("/applaud/:id", (req, res) => {
    Officer.findOne({ agency: "LNP", _id: req.params.id }).then((off) => {
      // console.log(off);
      // console.log(req.query.id);
      if (req.query.id === "") {
        res.redirect("/");
      } else {
        res.render("applaud", { officer: off });
      }
    });
  });
  
  router.get("/complain/:id", (req, res) => {
    Officer.findOne({ agency: "LNP", _id: req.params.id }).then((off) => {
      // console.log(off);
      // console.log(req.query.id);
      if (req.query.id === "") {
        res.redirect("/");
      } else {
        res.render("complain", { officer: off });
      }
    });
  });










// temporary route for adding new officer via mobile app
router.get("/addOfficer", (req, res) => {
  Position.find({ agency: "LNP" }).then((pos) => {
    res.render("addOfficer", { positions: pos });
  });
});

  module.exports = router;
