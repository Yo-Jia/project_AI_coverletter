const isLoggedIn = (req,res,next) =>{
    if(req.session.user){
        res.locals.loggedIn = true;
        next();
        return;
    }
    res.locals.loggedIn = false;
    res.redirect("/auth/login")
}

module.exports = isLoggedIn