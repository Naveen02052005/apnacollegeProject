const User = require("../Models/user")

module.exports.rendersignup = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
        let{username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);  // it automatically saves username and password to database
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{ // it automatically login after registering
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
        
    } catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{ // if authentication fails for any reason like wrong password then failureFlash will flash a message
    req.flash("success","Welcome back to Wanderlust!")
    // res.redirect(req.session.redirectUrl); // for postman it will not work 
    let redirectUrl = res.locals.redirectUrl || "/listings"; // it is because if we login from home page it will give page not found because we didnt opened anything like add new listing, .. so it will give page not found but by this it will be ok
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res)=>{
    req.logout((err) =>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}