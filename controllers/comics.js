const express = require("express");
const router = express.Router();
const user = require("../models/user_schema.js");
let fse = require('fs-extra');
let mv = require("mv");
//const mongoose = require("mongoose");
// const { default: mongoose } = require("mongoose");

//multer is needed for uploading files to server
const multer = require("multer");

//config storage for multer(so we can name the uploaded files the way we want)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //let path = "./public/uploads/comics/" + req.body.title + "/mainImg";
      let path = "./tmp";
      //you have to create the dir with fs-extra otherwise the folder wont be created
      fse.mkdirsSync(path);
      cb(null, path);
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname);
    }
})

//const upload = multer({dest : "./uploads"});
const upload = multer({ storage: storage, 

    //below checks validates file type to be uploaded
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          console.log("Only .png, .jpg and .jpeg format allowed!");
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      }

 });

// custom middleware
const postComic = (req,res,next) => {
    //postComic code
}

router.get("/",(req,res)=>{
    // res.send("User list");
    res.render("index", {text: "comics"});
})

router.get("/:id/edit",(req,res)=>{

    //you might need a guard clause here to check if user associated with this comic is logged in (because only the user should have access)

    res.render("comicpage.ejs");
})

router.post("/",upload.single('comicImg'),(req,res)=>{
//router.post("/", (req,res)=>{

    console.log("starting /comics post http request:")
    console.log(req.file);
    console.log(req.file.filename);
    var mainImgPath = req.file.path;
    console.log("mainImgPath :" + mainImgPath);

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
              "mainImg" : ""
              //"mainImg": mainImgPath.slice(6)
            
          },
        }, 
    }, {returnDocument: 'after'}).then((result)=>{ 

    console.log("the id of last pushed comic is:");
    console.log(result["comics"][result.comics.length-1]._id);

    var comicId = result["comics"][result.comics.length-1]._id;
    console.log("comicId is :" + comicId);

    var userId = req.session.user["_id"];
    console.log("userId is :" + userId)

    //move file from tmp to its own folder named after comic id
    //TODO : if we are going to upload our files based on object id, we may have to chain multiple mongoose queries
    //because the file upload happens before object id is created

    const currentPath = req.file.path;
    const destinationPath = "./public/uploads/comics/" + comicId.toString() + "/mainImg/" + req.file.filename;
    fse.mkdirsSync("./public/uploads/comics/" + comicId.toString() + "/mainImg");

    mv(currentPath, destinationPath, function(err) {
        if (err) {
            throw err
        } else {
            console.log("Successfully moved the file!");
        }
    });

    //req.file.path = "uploads/comics" + req.file.filename;

    return user.findOneAndUpdate({ "_id": req.session.user["_id"], "comics._id": comicId },
    { 
        "$set": {
            "comics.$.mainImg": "uploads/comics/" + comicId.toString() + "/mainImg/" + req.file.filename
        }

    }, {returnDocument: 'after'})
    
    }).then((result)=>{

        console.log("updated comics in user:" + req.session.user["username"]);
        console.log("result :");
        console.log(result);
    
        console.log("current session's id: " + req.session.id);
        req.session.user = result;
        console.log("current session object: ")
        console.log(req.session.user);
        console.log("current session's id: " + req.session.id);
    
        res.render("userpage", {userComics: req.session.user["comics"]});

    }).catch((error)=>{
    console.log(error);
    });

    //returnDocument:'after' returns the updated MongoDB document as a result
})

//To delete comic details
// router.delete("/:id", (req, res) => {
//     // res.send("Deleting...");
//     fruit.findByIdAndDelete(req.params.id, (err, success) => {
//       if (err) {
//         console.log(err);
//       } else {
//         //Redirect back to index page
//         res.redirect("/userpage");
//       }
//     });
// });

router.delete("/:id", (req,res) => {
    
    //let deletePath = "../public/uploads/comics/" + req.params.id;
    
    // var comicsArr = req.session.user["comics"];
    // for (let i=0;i < comicsArr.length; i++) {
    //     if (comicsArr[i]._id === req.params.id){
    //         deletePath = comicsArr[i].mainImg;
    //         break;
    //     }
    // }

    //console.log("deletePath: " + deletePath);
    //TODO: use fs.unlink to delete path



    user.findByIdAndUpdate(req.session.user["_id"], {
        "$pull": {
          "comics": {
            
            "_id": req.params.id
            
          },
        }, 
    }, {returnDocument: 'after'}).then((result)=>{
    console.log("deleting a comic from user:" + req.session.user["username"]);
    console.log(result);
    console.log("current session's id: " + req.session.id);
    req.session.user = result;
    console.log("current session object: ")
    console.log(req.session.user);
    console.log("current session's id: " + req.session.id);

    res.render("userpage", {userComics: req.session.user["comics"]});

    }).catch((error)=>{
        console.error('Error removing item:', error);
    });

});

//   const removeFavoriteItem = async (userId, itemId) => {
//     try {
//       await User.updateOne({ _id: userId }, {
//         $pull: { favorites: itemId }
//       });
//       console.log('Item removed successfully!');
//     } catch (error) {
//       console.error('Error removing item:', error);
//     }
//   };

module.exports = router;