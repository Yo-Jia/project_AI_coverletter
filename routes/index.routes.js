const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn")
const CoverLetter = require("../models/CoverLetter.model")
const User = require("../models/User.model")
const saltRounds = 12
const bcryptjs = require("bcryptjs")
const Contact = require("../models/Contact.model")
const mongoose = require("mongoose")
const axios = require("axios")
const menuLoginStatus = require("../middlewares/menuLoginStatus")
const fileUploader = require('../config/cloudinary.config');



router.use(menuLoginStatus)
//render each coverletter page
router.get("/profile/coverLetter/:coverLetterId", async(req,res)=>{
  const coverLetter = await CoverLetter.findById(req.params.coverLetterId)
  const owner = await User.findOne({coverLetters: req.params.coverLetterId});
  let deleteButton = false
  if(req.session.user){if(owner.username === req.session.user.username){
    deleteButton = true
    }}
  res.render("coverLetter",{user:req.session.user, coverLetter:coverLetter, deleteButton, login:res.locals.loggedIn})
})

// delete a cover letter
router.post("/profile/:coverLetterId/delete", async(req,res)=>{
  const coverLetter = await CoverLetter.findByIdAndDelete(req.params.coverLetterId)
  res.redirect(`/profile/${req.session.user.username}`)
})

//render edit cover lettre page
router.get("/profile/coverLetter/:coverLetterId/edit", isLoggedIn, async(req,res)=>{
  const coverLetter = await CoverLetter.findById(req.params.coverLetterId)
  res.render("editCoverLetter",{coverLetter,user:req.session.user})
})


//edit a cover letter
router.post("/profile/coverLetter/:coverLetterId/edit", isLoggedIn, async(req,res)=>{
  try{
  
  const {jobTitle,jobDescription,coverLetter,public} = req.body
  const updateData = {jobTitle,jobDescription,coverLetter,public} 
  const updateCoverLetter = await CoverLetter.findOneAndUpdate(
    { _id: req.params.coverLetterId },
    updateData,
    { new: true }
  )
  res.render("editCoverLetter",{
    coverLetter:{
      _id:updateCoverLetter._id,
      jobTitle:updateCoverLetter.jobTitle,
      jobDescription:updateCoverLetter.jobDescription,
      coverLetter:updateCoverLetter.coverLetter,
      public:updateCoverLetter.public}
    ,message: "Update succeed!",
    user:req.session.user
  })
}
catch(err){
  console.log(err)
}
})


router.get("/allCV", async(req,res)=>{
  const allCV = await CoverLetter.find({public: true})
  res.render("allCV",{allCV,user:req.session.user})
})

router.get("/contact",(req,res)=>{
  res.render("contact", {user:req.session.user})
})

router.post("/contact", async (req, res) => {
  try{
  const contact = new Contact({name:req.body.name,email:req.body.email,message:req.body.message})
  const saveContact = await contact.save();
  console.log(saveContact)
  res.render("contact",{message:'Thank you for contacting us! We will get back to you shortly.',user:req.session.user})}
  catch(err){console.log("there's an error",err)}
})

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index",{user:req.session.user});
});

/* Blog page */
router.get("/blog", (req, res, next) => {
  res.render("blog",{user:req.session.user});
});

/* Coming soon page */
router.get("/coming-soon", (req, res, next) => {
  res.render("comingsoon",{user:req.session.user});
});



//set the route in auth folder all under the /auth
router.use("/auth", require("./auth.routes"))


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
  const updateData = {username: req.body.username, email: req.body.email, password: hash, introduction:req.body.introduction, jobExperience:req.body.jobExperience}
  const{username,email,password, introduction,jobExperience} = updateData
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
    introduction:introduction,
    jobExperience:jobExperience,
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

//edit profile image
router.post("/profile/:username/editImg", isLoggedIn,fileUploader.single('image'),  async(req,res)=>{
  try{
  const user = await User.findOneAndUpdate(
    { username: req.params.username },
    {image: req.file.path},
    { new: true }
  )
  res.redirect(`/profile/${req.session.user.username}`)
}
catch(err){
  console.log(err)
}
})


// create a cover letter page
router.get("/profile/:username/create", isLoggedIn, async(req,res)=>{
  const user = await User.findOne({username: req.params.username})
  let warning
  if(user.introduction === "" ||user.introduction === undefined || user.jobExperience === ""|| user.jobExperience === undefined){
    warning = "To generate an optimized cover letter, please complete your introduction and your job experience details on the profile page. "
  }
  res.render("create",{user,warning})
})

//create a coverletter in the database
router.post("/profile/:username/create", isLoggedIn, async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    const {introduction,jobExperience} = user

    const { jobTitle, jobDescription} = req.body;
    const response = await generateCoverLetter(jobTitle, jobDescription, jobExperience);
    const cvResponse = response.choices[0].text;
    req.session.jobTitle = jobTitle;
    req.session.jobDescription = jobDescription;
    req.session.jobExperience = jobExperience;
    req.session.cvResponse = cvResponse;
  
    async function generateCoverLetter(jobTitle, jobDescription, jobExperience) {
      const apiKey = process.env.API_KEY;
      const prompt = `Please write a cover letter for the following job position:\nJob Title: ${jobTitle}\nJob Description: ${jobDescription}\n\nMy Job Experience: ${jobExperience}\nMy Introduction: ${introduction}\n\nCover Letter:`;
  
      try {
        const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
          prompt: prompt,
          max_tokens: 100,
          n: 1,
          stop: null,
          temperature: 0.4,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
        });
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }


res.render("create",{user,cvResponse})
})

router.post("/profile/:username/save", isLoggedIn, async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const { jobTitle, jobDescription, cvResponse } = req.session;
  const public = req.body.public;

  const coverLetter = await CoverLetter.create({
    jobTitle,
    jobDescription,
    coverLetter: cvResponse,
    public,
  });

  user.coverLetters.push(coverLetter._id);
  await user.save();

  res.redirect(`/profile/coverLetter/${coverLetter._id}`);
});



module.exports = router;
