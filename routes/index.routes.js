const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn")
const CoverLetter = require("../models/CoverLetter.model")
const User = require("../models/User.model")
const saltRounds = 12
const bcryptjs = require("bcryptjs")


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//set the route in auth folder all under the /auth
router.use("/auth", require("./auth.routes"))


router.use(isLoggedIn);

//render profile page get all the infos from user
router.get("/profile/:username", isLoggedIn, async(req,res)=>{
  const user = await User.findOne({username: req.params.username}).populate("coverLetters")
  res.render("profile",{user})
})


//render edit profile page
router.get("/profile/:username/edit", isLoggedIn, async(req,res)=>{
  const user = await User.findOne({username: req.params.username})
  res.render("editProfile",{user})
})

//post the data from edit profile page and render a edited version
router.post("/profile/:username/edit", isLoggedIn, async(req,res)=>{
  try{
    
  //check if the username already exists
  const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser && existingUser.username !== req.params.username) {
      throw new Error("Username already exists");
    }
  const salt = await bcryptjs.genSalt(saltRounds);
  const hash = await bcryptjs.hash(req.body.password, salt);
  const updateData = {username: req.body.username, email: req.body.email, password: hash}
  const{username,email,password} = updateData
  const user = await User.findOneAndUpdate(
    { username: req.params.username },
    updateData,
    { new: true }
  )
  res.render("editProfile",{
    user:user,
    username:username,
    email:email,
    password:password,
    message: "Update succeed!"
  })
}
catch(err){
  const user = await User.findOne({username: req.params.username})
  const{username,email,password} = user
  res.render("editProfile", {
    user:user,
    username:username,
    email:email,
    password:password,
    message: err.message
  })
}
})

//render each coverletter page
router.get("/profile/:coverLetterId", isLoggedIn, async(req,res)=>{
  const coverLetter = await CoverLetter.findById(req.params.coverLetterId)
  res.render("coverLetter",{user:req.session.user, coverLetter:coverLetter})
})

// delete a cover letter
router.post("/profile/:coverLetterId/delete", isLoggedIn, async(req,res)=>{
  const coverLetter = await CoverLetter.findByIdAndDelete(req.params.coverLetterId)
  res.redirect("/profile")
})

// create a cover letter page
router.get("/profile/:username/create", isLoggedIn, async(req,res)=>{
  const user = await User.findOne({username: req.params.username})
  res.render("create",{user})
})

//create a coverletter in the database
router.post("/profile/:username/create", isLoggedIn, async(req,res)=>{
  const {title,description,letter} = req.body;
  const createCoverLetter = await CoverLetter.create({title,description,letter})
  res.redirect(`/profile/${createCoverLetter._id}`)
})

router.get("/contact",(req,res)=>{
  res.render("contact", {user:req.session.user})
})

module.exports = router;
