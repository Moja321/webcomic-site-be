const express = require("express");
const app = express();

//need below to use .env
require("dotenv").config();

const mongoose = require("mongoose");

//middleware
//need urlencoded to read encoded data from urls and add them to req.body
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req,res) => {
    console.log("Hello World"); //note that this only prints to local terminal, doesn't print to google chrome dev tools
    // res.status(500).json({"message":"error"}); //res.status(500) does show in chrome dev tools though
    res.render("index");
})

app.listen(PORT, () => {
    console.log("application running on port: " + PORT);
});