var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var Comment    = require("../models/comments");
var User       = require("../models/user"); 
var passport   = require("passport");

router.get("/", function(req, res){
   res.render("landing");
});

//=======================
// Sign Up ROUTE
//=======================

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcom to YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Login Route
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }
), function(req, res) {
});


// Logout Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "you have logged out");
    res.redirect("/campgrounds");
})

module.exports = router;