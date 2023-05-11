const bcryptjs = require("bcryptjs")
const User = require("../models/User.model")
const saltRounds = 12
const express = require("express")
const router = express.Router()
const isLoggedOut = require("../middlewares/isLoggedOut")
const isLoggedIn = require("../middlewares/isLoggedIn")


// signup page
router.get("/signup",isLoggedOut,(req,res) =>{
    res.render("auth/signup")
})

//send singup data to create a profile
router.post("/signup",async(req,res)=>{
  try{
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser && existingUser.username !== req.params.username) {
      throw new Error("Username already exists");
    }
    if (req.body.password !== req.body.confirmPassword) {
      console.log(req.body)
      throw new Error("Passwords do not match");
    }
    console.log(req.body)
    const salt = await bcryptjs.genSalt(saltRounds);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const user = new User({username: req.body.username, email:req.body.email, password: hash})
    await user.save();
    res.redirect("/auth/login");
  }
  catch(err){
    if (err.message === "Username already exists") {
      res.render("auth/signup", { message: "Username already exists" });
    } else if (err.message === "Passwords do not match") {
      res.render("auth/signup", { message: "Passwords do not match" });
    } else {
      res.render("auth/signup", { message: err});
    }
  }
})

//destroy session if click on logout and redirect to homepage
router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect("/");
    });
  });

  //render login page if the user is not loged in, if the user already loged in then redirect to /profile
  router.get("/login",isLoggedOut,(req,res) =>{
    res.render("auth/login")
  })

  //check login data 
  router.post("/login",async(req,res,next)=>{
    try{
        const user =await User.findOne({username:req.body.username});
        if(!user){
            return res.render("auth/login",{error:"User does not existent"});
        }
        const passwordsMatch = await bcryptjs.compare(
            req.body.password, user.password
        )
        if(!passwordsMatch){
            return res.render("auth/login",{error:"the password does not existent"});
        }

        req.session.user = {
            username: user.username,
            email: user.email
        };
        res.redirect(`/profile/${user.username}`)
    }
    catch(err){next(err)}
  })

module.exports = router;