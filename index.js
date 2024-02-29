const express = require("express");
const app = express();

//need below to use .env
require("dotenv").config();

const mongoose = require("mongoose");

const session = require("express-session");

//middlewares:

//need urlencoded to read encoded data from urls and add them to req.body
app.use(express.urlencoded({ extended: true }));

//need express-session for session cookies/login function
app.use(
    session({
      secret: "drawingcomicsisfun",
      resave: false,
      saveUninitialized: false,
    })
);

//custom middleware:

//middleware to test if authenticated
function isAuthenticated (req, res, next) {
  if (req.session.user) {
    console.log("User " + req.session.user["username"] + " is authenticated")
  } else 
    console.log("No user is authencticated");

  next();
}

const PORT = process.env.PORT || 3000;

//connect to database (mongoDB)
mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAME}`;
mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error: ")
);
mongoose.connection.on("connected", () => {
  console.log("successfully connected to MongoDB " + process.env.MONGO_DBNAME);
});
mongoose.connection.on("disconnected", () => {
  console.log("Successfully disconnected");
});

//set view engine/ejs
app.set("view engine", "ejs");

//define controllers/routers
const signupController = require("./controllers/signup");
const loginController = require("./controllers/login");
const comicsController = require("./controllers/comics");

//use controllers/routers
app.use("/signup", signupController);
app.use("/login", loginController);
app.use("/comics", comicsController);


app.get("/", isAuthenticated, (req,res) => {
    console.log("Hello World"); //note that this only prints to local terminal, doesn't print to google chrome dev tools
    // res.status(500).json({"message":"error"}); //res.status(500) does show in chrome dev tools though

    console.log(req.session);

    //for retrieving logged in user information
    if (req.session.user){

        //notice here that the express-session session object is always stored/ can be retrieved from a routes request object
        console.log(req.session.user["username"]);
        res.render("index", {loggedInUser: (req.session.user["username"]) || "none"});
    } else {
        res.render("index");
    }
        
})

app.get("/userpage" , (req,res) => {
    console.log(req.session);
    if (req.session.user){ //check if req.session.user is not empty
        res.render("userpage", {loggedInUser: req.session.user["username"]}); 
    } else {
        res.render("userpage"); 
    }
    
})

app.listen(PORT, () => {
    console.log("application running on port: " + PORT);
});