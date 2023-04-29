const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn")
const CoverLetter = require("../models/CoverLetter.model")
const User = require("../models/User.model")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//set the route in auth folder all under the /auth
router.use("/auth", require("./auth.routes"))

//render profile page get all the infos from user
router.get("/profile/:username", isLoggedIn, async(req,res)=>{
  const user = await User.findOne({username: req.params.username}).populate("coverLetters")
  res.render("profile",user)
})


//render edit profile page
router.get("/profile/:username/edit", isLoggedIn, async(req,res)=>{
  const user = await User.findOne({username: req.params.username})
  res.render("editProfile",user)
})

//post the data from edit profile page and render a edited version
router.post("/profile/:username/edited", isLoggedIn, async(req,res)=>{
  const updateData = {username: req.body.username, email: req.body.email, password: req.body.password}
  const user = await User.findOneAndUpdate(
    { username: req.params.username },
    updateData,
    { new: true }
  )
  res.render("editedProfile",user)
})

//render each coverletter page
router.get("/profile/:coverLetterId", isLoggedIn, async(req,res)=>{
  const coverLetter = await CoverLetter.findById(req.params.coverLetterId)
  res.render("coverLetter",coverLetter)
})

// delete a cover letter
router.post("/profile/:coverLetterId/delete", isLoggedIn, async(req,res)=>{
  const coverLetter = await CoverLetter.findByIdAndDelete(req.params.coverLetterId)
  res.redirect("/profile")
})

// create a cover letter page
router.get("/profile/:username/create", isLoggedIn, async(req,res)=>{
  const user = await User.findOne({username: req.params.username})
  res.render("/create",user)
})

//create a coverletter in the database
router.post("/profile/:username/create", isLoggedIn, async(req,res)=>{
  const {title,description,letter} = req.body;
  const createCoverLetter = await CoverLetter.create({title,description,letter})
  res.redirect(`/profile/${createCoverLetter._id}`)
})

router.get("/contact",(req,res)=>{
  res.render("/contact", req.session.user)
})

module.exports = router;
