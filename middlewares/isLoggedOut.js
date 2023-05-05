const isLoggedOut = (req,res,next) =>{
    if(!req.session.user){
        next();
        return;
    }
    res.redirect(`/profile/${req.session.user.username}`)
}

module.exports = isLoggedOut;