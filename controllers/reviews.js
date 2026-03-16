const Listing = require("../Models/listing");
const Review = require("../Models/review.js")

module.exports.createReview = async(req,res)=>{
    // console.log(req.params.id) // it will print undefined because the root in app.js the id is only visible to that root but it will not sending /reaching to here so that we need to use {mergeParams:true:}
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // storing author it means who is written review
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log(newReview)
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview = async (req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}) // while we are deleting the review we also need to delete the object Id stored in reviews array so that we are using this step
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}