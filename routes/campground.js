var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var Comment    = require("../models/comments");
var middleware  = require("../middleware");

router.get("/", function(req, res){
    Campground.find({}, function(err, allcampgrounds){
       if (err){
           console.log(err);
       } else{
           res.render("campground/index", {campgrounds: allcampgrounds});
       }
    });

});

router.post("/", middleware.isLoggedIn, function(req, res){
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCampground = {name: name, price: price, image: image, description: desc, author: author};
   
   Campground.create(newCampground, function(err, newlyAddedCampground){
       if (err){
           console.log(err);
       }else{
           console.log(newlyAddedCampground)
           res.redirect("/campgrounds");
       }
   })
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campground/new"); 
});

// SHOW - show more info on one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else{
            res.render("campground/show", {campground: foundCampground});
        }
    });
});



//EDIT route

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campground/edit", {campground: foundCampground}); 
    });
});



//UPDATE route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//DELETE route

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;