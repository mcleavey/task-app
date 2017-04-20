var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    logger = require("morgan"),
    bodyParser = require("body-parser");

app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(process.env.PORT, process.env.IP, function() {
console.log("Server started");
});


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// mongoose.connect("mongodb://localhost/taskApp");
mongoose.connect("mongodb://zad:rimsky@ds111771.mlab.com:11771/taskapp")

var taskSchema = new mongoose.Schema({
    name: String,
    completed: Boolean,
    importancelevel: Number,
    urgencylevel: Number
})

var Task = mongoose.model("Task", taskSchema);




app.get("/", function(req, res){
    Task.find({}, function(err, tasks){
    console.log("Retrieve:");
    if (err){
        console.log(err);
    } else {
        console.log("Show new page");
          res.render("task", {tasks: tasks});
    }
 });
});




app.post("/act", function(req, res) {
   if (req.body.action==="add") {
      Task.create({name:req.body.name, completed: req.body.completed, importancelevel: req.body.importancelevel, urgencylevel: req.body.urgencylevel}, 
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
    
// app.get("/:thing", function(req, res){
//     res.render("home", {myVar: req.params.thing})
// });
