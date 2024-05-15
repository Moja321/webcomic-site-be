const express = require("express");
const router = express.Router();
const user = require("../models/user_schema.js");
let fs = require('fs');
let fse = require('fs-extra');
let mv = require("mv");


//get all users route ("/")
router.get("/",(req,res)=>{
    // res.send("User list");
    console.log("START OF: /comics");


    //TODO:
    //Get all users using mongoose query and save to a variable, and pass it to res.render
    user.find({},'comics')
    .then((result)=>{

        console.log(result);
        console.log(result[2]);
        // if (result.length !== 0) {
        //     for (i=0; i<result.length;i++){
        //         console.log(result[i]);
        //     }
        // }

        //res.render("all_comicspage", {text: "all users", users: result});
        res.render("all_comicspage", {text: "all comics", comicsarr: result});

    }).catch((error)=>{
        console.log(error);
    });

    //res.render("all_userspage", {text: "all users"});
})



module.exports = router;