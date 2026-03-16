const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer  = require('multer') // to parse form data
const {storage} = require("../cloudconfig.js")
// const upload = multer({ dest: 'uploads/' }) // from multer data it takes files and it create folder with uploads name and saves these files into that folder
// These above 2(upload & multer) are for uploading files
const upload = multer({storage}); // now the uploaded files will be stored in cloudinary(3rd party service)


 
// router.get("/listings",wrapAsync(async(req,res)=>{
//     const allListings = await Listing.find();
//     res.render("listings/index.ejs",{allListings});
// }))

// Update Route

// router.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{ // now here first validateListing call will be sent then next work will be done
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing}) // req.body.listing is javascript object it consists of all parameters & ... are used to take everything inside req.body.listing 
//     res.redirect("/listings");
// }))
// New Route

// router.get("/listings/new",(req,res)=>{
//    res.render("listings/new.ejs") 
// })

// Edit Route

// router.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
//     let{id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing})
// }))

//  Show Route 
// router.get("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews"); // we use populate to display data in reviews    res.render("listings/show.ejs",{listing});
//     res.render("listings/show.ejs",{listing})
// }))

// router.post("/listings",validateListing,wrapAsync(async(req,res,next) =>{ // now here first validateListing call will be sent then next work will be done
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }))


// Delete Route
// router.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let { id } = req.params;
//     let deleteListing =  await Listing.findByIdAndDelete(id)
//     console.log(deleteListing);
//     res.redirect("/listings");
// }))


// We need to remove common part in all routes common part is "/listings" so it is removed

// router.get("/",wrapAsync(async(req,res)=>{
//     const allListings = await Listing.find();
//     res.render("listings/index.ejs",{allListings});
// }))


// New Route

// router.get("/new",isLoggedIn,(req,res)=>{
//     // console.log(req.user);
//     // if(!req.isAuthenticated()) // to check either user is logged in or not
//     // {
//     //     req.flash("error","You must be logged in to create listing");
//     //     return res.redirect("/login");
//     // } if we want to delete any listing or to add any listing we need to login first so we need login everywhere so instead of writing this functionality everywhere we can use middleware
//    res.render("listings/new.ejs") 
// })

//  Create Route

// router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next) =>{ // now here first validateListing call will be sent then next work will be done
//     const newListing = new Listing(req.body.listing);
//     // console.log(req.user);
//     newListing.owner = req.user._id; 
//     await newListing.save();
//     req.flash("success","New Listing Created!")
//     res.redirect("/listings");
// }))

// Edit Route

// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
//     let{id} = req.params;
//     const listing = await Listing.findById(id);
//     if(!listing){
//         req.flash("error","Listing you requested for does not exist!")
//         return res.redirect("/listings");
//     }
//     req.flash("success","Listing is Updated")
//     res.render("listings/edit.ejs",{listing})
// }))

//  Show Route 
// router.get("/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     // const listing = await Listing.findById(id).populate("reviews"); // we use populate to display data in reviews    res.render("listings/show.ejs",{listing});
//     // const listing = await Listing.findById(id).populate("reviews").populate("owner"); // it it show the owner it means if i created one listing with one account than it shows who is created by its username 
//     const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",model:"User"},}).populate("owner");   // it is to print every author name for each review
//     if(!listing){
//         req.flash("error","Listing you requested for does not exist!")
//         return res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs",{listing})
// }))

// Update Route

// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{ // now here first validateListing call will be sent then next work will be done
//     let {id} = req.params;
//     // let listing = await Listing.findById(id)
//     // if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id))
//     // {
//     //     req.flash("error","You don't have permission to edit");
//     //     return res.redirect(`/listings/${id}`)
//     // } // we are writing this as middleware instead of writing always in everywhere
//     await Listing.findByIdAndUpdate(id,{...req.body.listing}) // req.body.listing is javascript object it consists of all parameters & ... are used to take everything inside req.body.listing 
//     req.flash("success","Listing is Updated");
//     res.redirect(`/listings/${id}`);
// }))


// Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
//     let { id } = req.params;
//     let deleteListing =  await Listing.findByIdAndDelete(id)
//     console.log(deleteListing);
//     req.flash("success","Lisiting Deleted");
//     res.redirect("/listings");
// }))

// MVC Architecture

// // Index Route
// router.get("/",wrapAsync(listingController.index)) 

// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm)

// // Show Route
// router.get("/:id",wrapAsync(listingController.showListing))

// // Create Route
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// // Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

// // Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// Compact version of same routes (Index  and create routes)

router.route("/")
.get(wrapAsync(listingController.index)) 
// .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//   OR

.post(
    isLoggedIn,
    
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing));

// .post(upload.single('listing[image]'),(req,res)=>{  this route is to check the details of image like path, filename and etc...
//     res.send(req.file);
// })

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
     upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));


module.exports = router;