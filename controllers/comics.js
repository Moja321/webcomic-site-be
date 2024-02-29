const express = require("express");
const router = express.Router();
const user = require("../models/user_schema.js");
//const mongoose = require("mongoose");
// const { default: mongoose } = require("mongoose");

router.get("/",(req,res)=>{
    // res.send("User list");
    res.render("index", {text: "comics"});
})

router.post("/",(req,res)=>{
    //We have to use promises instead:
    // user.create(req.body).then((result)=>{
    //     console.log(result);
    //     res.render("username", {fruits: result.username});
    // }).catch((error)=>{
    //     console.log(error);
    // });

    //const comicModel = new 
    //user.comics.push

    user.findByIdAndUpdate(req.session.user["_id"], {
        "$push": {
          "comics": {
            
              "title": req.body.title,
              "synopsis": req.body.synopsis,
              "likes": 0,
            
          },
        }, 
    }, {returnDocument: 'after'}).then((result)=>{
    console.log("updated comics in user:" + req.session.user["username"]);
    console.log(result);
    console.log(req.session.id);
    req.session.user = result;
    console.log("current session object: ")
    console.log(req.session.user);
    console.log(req.session.id);

    res.render("userpage", {userComics: req.session.user["comics"]});

    }).catch((error)=>{
    console.log(error);
    });

    //returnDocument:'after' returns the updated MongoDB document as a result
})

module.exports = router;