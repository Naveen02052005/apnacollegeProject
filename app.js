// require("dotenv").config();
// // console.log(process.env); but we need secret so that check below line
// console.log(process.env.secret)

if(process.env.NODE_ENV != 'production')
{
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./Models/listing.js");  // these are commented because we are not using them we need to remove them but just i commented them
const path = require("path");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("./schema.js");
// const Review = require("./Models/review.js");
const session = require("express-session");
const {MongoStore} = require('connect-mongo');// we need to require it for deploying it in mongo atlas
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { ppid } = require("process");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" // we will find this in mongoose website copy it and paste but instead of wanderlust paste your database name  // We need to use this in local database means before deploying the database

const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log(err);
});

// async function main()
// {
//     await mongoose.connect(MONGO_URL);
// }

async function main()
{
    await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));

// This session is for deploying the database in mongo atlas

const store = MongoStore.create({ 
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter:24 * 3600, // it means after 24 hours session stored information is updated
})

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days , 24 hours, 60 mins, 60 sec, 1000 milli seconds
        maxAge: 7 * 24 * 60 *60 * 1000,
        httpOnly: true, //security purpose: to prevent from cross scripting attacks
    }
};

// app.get("/",(req,res)=>{
//     res.send("Root is working");
// })



app.use(session(sessionOptions));
app.use(flash()); // we need to use it above all the routes

app.use(passport.initialize());
app.use(passport.session()); // user can login only once it means once he logined until he logout he is unable to login
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //serialize is used to store the information related to user
passport.deserializeUser(User.deserializeUser()); // after logout user data is deleted from session

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error =  req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student" //in user schema we just implemented email but passport automatically creates username and password
//     });

//    let registeredUser = await User.register(fakeUser,"helloworld") // it save fakeuser with helloworld password in database
//    res.send(registeredUser);
// })

// const validateListing = (req,res,next)=> {
//     let result = listingSchema.validate(req.body);
//     if(result.error){
//         let errMsg = result.error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
//     }
// }


// const validateReview = (req,res,next)=> {
//     let result = reviewSchema.validate(req.body);
//     if(result.error){
//         let errMsg = result.error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
//     }
// }


// app.get("/listings",wrapAsync(async(req,res)=>{
//     const allListings = await Listing.find();
//     res.render("listings/index.ejs",{allListings});
// }))

// Update Route

// app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{ // now here first validateListing call will be sent then next work will be done
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing}) // req.body.listing is javascript object it consists of all parameters & ... are used to take everything inside req.body.listing 
//     res.redirect("/listings");
// }))
// New Route

// app.get("/listings/new",(req,res)=>{
//    res.render("listings/new.ejs") 
// })

// Edit Route

// app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
//     let{id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing})
// }))

//  Show Route 
// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews"); // we use populate to display data in reviews    res.render("listings/show.ejs",{listing});
//     res.render("listings/show.ejs",{listing})
// }))

//  Create Route
// app.post("/listings",async(req,res)=>{
//     // let {title,description,image,price,country,location} = req.body; 
//     // let listing = req.body.listing;  // in form(new.ejs) if we use name like this(name = listing[title]) then we can use like this otherwise we need to use like above

//     const newListing = new Listing(req.body.listing) // creating new listing
//     await newListing.save();
//     // console.log(listing);
//     res.redirect("/listings");
// })


// app.post("/listings",async(req,re,nexts)=>{
//     try{
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     }catch(err){
//         next(err);
//     }
// })

// Instead of try catch we can use wrapAsync

// app.post("/listings",wrapAsync(async(req,res,next) =>{
//     if(!req.body.listing){  // if listing is not available
//         throw new ExpressError(400,"Send valid data for listing") // 400 = badrequest
//     }
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }))

// One way no handle every field

// app.post("/listings",wrapAsync(async(req,res,next) =>{
//     if(!req.body.listing){  // if listing is not available
//         throw new ExpressError(400,"Send valid data for listing") // 400 = badrequest
//     }
//     const newListing = new Listing(req.body.listing);
//    if(!newListing.description)
//    {
//         throw new ExpressError(400,"Description is missing");
//    }
//    if(!newListing.title)
//    {
//         throw new ExpressError(400,"Title is missing");
//    }
//    if(!newListing.location)
//    {
//         throw new ExpressError(400,"Location is missing");
//    }
//     await newListing.save();
//     res.redirect("/listings");
// }))


// Instead of using this many if's we can use "Joi" for server side validation schema

// app.post("/listings",wrapAsync(async(req,res,next) =>{
//     let result = listingSchema.validate(req.body);
//     console.log(result);
//     if(result.error)
//     {
//         throw new ExpressError(400,result.error)
//     }
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }))

//  We can convert validation of schema to middleware 

// app.post("/listings",validateListing,wrapAsync(async(req,res,next) =>{ // now here first validateListing call will be sent then next work will be done
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }))


// Delete Route
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let { id } = req.params;
//     let deleteListing =  await Listing.findByIdAndDelete(id)
//     console.log(deleteListing);
//     res.redirect("/listings");
// }))


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter); // here /:id parameter is staying in app.js only but not going to review.js so to go we need to use {mergeParams:true}
app.use("/",userRouter);

// Reviews
// POST Route

// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     let listing = await Listing.findById(req.params.id)
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     // console.log("New Review Saved");
//     // res.send("new Review Saved");

//     res.redirect(`/listings/${listing._id}`)
// }));


// Delete Review

// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
//     let {id, reviewId} = req.params;

//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) // while we are deleting the review we also need to delete the object Id stored in reviews array so that we are using this step
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }))


// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price: 1200,
//         location: "Calangute,Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// }) 

// To handle errors using middleware  for asynchronous errors



// app.use((err,req,res,next)=>{
//     res.send("Something went wrong");
// })

// Using ExpressError class


// app.use((err,req,res,next)=>{
//     let { statusCode,message} = err;
//     res.status(statusCode).send(message);
// })

// If any route is not found to handle that error (page not found)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


// app.use((err, req, res, next) => {
//     // const statusCode = err.statusCode || 500;
//     // const message = err.message || "Something went wrong";

//     let{statusCode = 500, message = "Something Went Wrong"} = err;
//     res.status(statusCode).send(message);
// });

// using error.ejs

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
})