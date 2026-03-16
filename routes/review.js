const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const {validateReview,isLoggedIn,isOwner,isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js");
const review = require("../Models/review.js");


// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     let listing = await Listing.findById(req.params.id)
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();


//     res.redirect(`/listings/${listing._id}`)
// }));


// // Delete Review

// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
//     let {id, reviewId} = req.params;

//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) // while we are deleting the review we also need to delete the object Id stored in reviews array so that we are using this step
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }))

// We need to remove common part in all routes common part is "/listings/:id/reviews" so it is removed

// router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
//     // console.log(req.params.id) // it will print undefined because the root in app.js the id is only visible to that root but it will not sending /reaching to here so that we need to use {mergeParams:true:}
//     let listing = await Listing.findById(req.params.id)
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id; // storing author it means who is written review
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     // console.log(newReview)
//     req.flash("success","New Review Created");
//     res.redirect(`/listings/${listing._id}`)
// }));


// Delete Review

// router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async (req,res)=>{
//     let {id, reviewId} = req.params;

//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) // while we are deleting the review we also need to delete the object Id stored in reviews array so that we are using this step
//     await Review.findByIdAndDelete(reviewId);

//     req.flash("success","Review Deleted");
//     res.redirect(`/listings/${id}`);
// }))

// MVC Architecture

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;