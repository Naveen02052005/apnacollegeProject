const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");
const user = require("../Models/user.js");

// router.get("/signup",(req,res) => {
//     res.render("users/signup.ejs");
// })

// router.post("/signup",wrapAsync(async(req,res)=>{
//     try{
//         let{username, email, password} = req.body;
//         const newUser = new User({email,username});
//         const registeredUser = await User.register(newUser,password);  // it automatically saves username and password to database
//         console.log(registeredUser);
//         req.login(registeredUser,(err)=>{ // it automatically login after registering
//             if(err){
//                 return next(err);
//             }
//             req.flash("success","Welcome to Wanderlust");
//             res.redirect("/listings");
//         })
        
//     } catch(e) {
//         req.flash("error",e.message);
//         res.redirect("/signup");
//     }
// }));

// router.get("/login",(req,res)=>{
//     res.render("users/login.ejs");
// })

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash:true }),async(req,res)=>{ // if authentication fails for any reason like wrong password then failureFlash will flash a message
//     req.flash("success","Welcome back to Wanderlust!")
//     // res.redirect(req.session.redirectUrl); // for postman it will not work 
//     let redirectUrl = res.locals.redirectUrl || "/listings"; // it is because if we login from home page it will give page not found because we didnt opened anything like add new listing, .. so it will give page not found but by this it will be ok
//     res.redirect(redirectUrl)
// })

// router.get("/logout",(req,res)=>{
//     req.logout((err) =>{
//         if(err)
//         {
//             return next(err);
//         }
//         req.flash("success","You are logged out!");
//         res.redirect("/listings");
//     })
// })


// MVC Architecture

// router.get("/signup",userController.rendersignup);

// router.post("/signup",wrapAsync(userController.signup));

// router.get("/login",userController.renderLogin);

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash:true }),userController.login);

// router.get("/logout",userController.logout);

// Compact version of same routes

router
.route("/signup")
.get(userController.rendersignup)
.post(wrapAsync(userController.signup));


router
.route("/login")
.get(userController.renderLogin)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect: "/login", failureFlash:true }),userController.login);


router.get("/logout",userController.logout);



module.exports = router;