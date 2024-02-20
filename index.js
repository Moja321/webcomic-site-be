const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

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