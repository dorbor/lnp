const express = require("express");
const router = express.Router();
// const gravatar = require("gravatar");
//const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");
const passport = require("passport");
const Audit = require("../../models/Audit");
const Comment = require("../../models/Comment");



const { userAuthenticated } = require("../../helper/auth");



router.get("/", userAuthenticated, (req, res) => {
    Audit.find({ agency: "LNP" }).then((audits) => {
        Comment.find({ agency: "LNP" }).then((comments) => {
            var complains = [];
            var applauds = [];
            comments.forEach((com) => {
            if (com.type == "Complain") {
                complains.push(com);
            }
            });
            comments.forEach((com) => {
            if (com.type == "Applaud") {
                applauds.push(com);
            }
            });
            res.render("admin/audit", {
                audits: audits,
            comments: comments,
            complains: complains,
            applauds: applauds,
            });
        });
    });
});

module.exports = router;
