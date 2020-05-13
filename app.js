//jshint esversion:6
require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const md5=require("md5");

app.set('views engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser:true});

app.get("/", function(req, res){
  res.render("home.ejs");
});

app.get("/register", function(req, res){
  res.render("register.ejs");
});


app.get("/login", function(req, res){
  res.render("login.ejs");
});


app.get("/logout", function(req, res){
  res.redirect("/");
});

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});


const User=mongoose.model("User", userSchema);

app.post("/register", function(req, res){
  const newUser= new User({
    email:req.body.username,
    password:md5(req.body.password)
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets.ejs");
    }
  });
});


 app.post("/login", function(req, res){
   const username=req.body.username;
   const password=md5(req.body.password);
   User.findOne({email:username}, function(err, foundUser){
     if(err){
       console.log(err);
     }else{
       if(foundUser){
         if(foundUser.password === password){
           res.render("secrets.ejs");
         }
       }
     }
   });
 });

app.listen(process.env.PORT || 3000, function(req, res){
  console.log("your app is running on port 3000");
});
