var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    User          = require("./models/user"),
    Comment       = require("./models/comments"),
    seedDB        = require("./seed"),
    methodOverride = require("method-override"),
    flash         = require("connect-flash")
var campgroundsRoute = require("./routes/campground"),
    commentRoute     = require("./routes/comments"),
    indexRoute       = require("./routes/index")


app.use(flash());
//Passport Configuration
app.use(require("express-session")({
    secret: "This is a secret place",
    resave: false,
    saveUninitialized: false
}));


app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seedDB() //seed the database


var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
console.log(url);
mongoose.connect(url, { useNewUrlParser: true});
// mongoose.connect("mongodb://wangzhe:wangzhe07@ds119652.mlab.com:19652/yelpcampzw", { useNewUrlParser: true});


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(function(req, res, next){
    app.locals.currentUser = req.user;
    app.locals.error = req.flash("error");
    app.locals.success = req.flash("success");
    next();
});



app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/comments", commentRoute);
app.use(indexRoute);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started!!");
});