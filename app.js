var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    logger = require("morgan"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

if (process.env.DATABASEURL) {
    console.log("Database is "+process.env.DATABASEURL);
    mongoose.connect(process.env.DATABASEURL);
} else {
    console.log("Warning, no environment variable for database, using local version");
    mongoose.connect("mongodb://localhost/taskApp");
// mongoose.connect("mongodb://zad:rimsky@ds111771.mlab.com:11771/taskapp")
}

app.use(express.static("public"));
app.use(require("express-session") ({
    secret: "This is a song about a boy who loves soccer and a boy who loves basketball!!",
    resave: false,
    saveUninitialized: false
}));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());


app.listen(process.env.PORT, process.env.IP, function() {
console.log("Server started");
});


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var taskSchema = new mongoose.Schema({
    name: String,
    completed: Boolean,
    importancelevel: Number,
    urgencylevel: Number,
    username: String
})

var Task = mongoose.model("Task", taskSchema);





//
//  ROUTES
//





app.get("/", function(req, res){
    res.render("home");
});

// use this line instead if you want task page password protected
// app.get("/task", isLoggedIn, function(req, res){

app.get("/task", function(req, res){
    Task.find({}, function(err, tasks){
    console.log("Retrieve:");
    if (err){
        console.log(err);
    } else {
        console.log("Show new page");
          res.render("task", {tasks: tasks, user: req.user});
    }
 });
});




app.post("/act", function(req, res) {
   if (req.body.action==="add") {
       var currentUser = "myTaskAppdemo";
       if (req.user) {
           currentUser = req.user.username;
       }
      Task.create({name:req.body.name, completed: req.body.completed, importancelevel: req.body.importancelevel, urgencylevel: req.body.urgencylevel, username: currentUser}, 
         function(err){
            console.log("Creating item in db:");
            if (err){
                console.log(err);
            } else {
                console.log("Success, now redirecting");
                res.send("Successfully added");
            }
        });
        } else if (req.body.action==="delete") {
       // remove item from database
            console.log("Delete: "+req.body.name);    
            Task.findByIdAndRemove(req.body.id, function (err) {
            console.log("Creating item in db:");
            if (err){
                console.log(err);
            } else {
                console.log("Success, now redirecting");
                res.send("Successfully added");
            }
        });
        
        }  else if (req.body.action==="complete"){
        // change completed status
            Task.findById(req.body.id, function (err, task) {  
    // Handle any possible database errors
                if (err) {
                    res.status(500).send(err);
                } else {
                    task.completed = req.body.completed;
                    // Save the updated document back to the database
                    task.save(function (err, todo) {
                        if (err) {
                            res.status(500).send(err);
                        }
                    });  // end of task.save
                }
            });   // end of tast.findbyID
  }   // end of if (to determine which action)
  
});   // end of app.post
    
    
    
    
//  AUTHENTICATION ROUTES


app.get("/register", function(req, res){
    res.render("register", {user: req.user});
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            console.log("authentication error  "+err);
            return res.render("register");
        }
    passport.authenticate("local")(req, res, function() {
        res.redirect("/task");
    })        
    });
});


//  LOGIN

app.get("/login",  function(req, res){
    res.render("login", {user: req.uset});
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/task",
    failureRedirect: "/login"
}), function (req, res){});


app.get("/logout",  function(req, res) {
    req.logout();
    res.redirect("/task");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

