const Listing = require("./Models/listing") // this is for isOwner middleware
const Review = require("./Models/review") // this is for isOwner middleware
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


// module.exports.isLoggedIn = (req,res,next) => {
//     console.log(req.user); // by this we can check if user is logged in or not
//     if(!req.isAuthenticated())
//     {
//         req.flash("error","You must logged in ");
//         return res.redirect("/login");
//     }
//     next();
// }


module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.path, "...", req.originalUrl); // without login if we access anything then it directly redirect to login and after login it directly relogin to listing page instead of new listing page so we can get the path of that new listhing by req.path and we can get complete url also by originalUrl
    // if we need to save this if user is not logged in so we need to save url in below if block
    if(!req.isAuthenticated())
    {
        // redirectUrl save
        req.session.redirectUrl = req.originalUrl; // but in postman there is one problem that is it will automatically clear the session after login so we need to use locals so that we need to create another middleware
        req.flash("error","You must logged in ");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
        let listing = await Listing.findById(id)
        if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id))
        {
            req.flash("error","You are not owner of this listing");
            return res.redirect(`/listings/${id}`)
        }
        next();
}

module.exports.validateListing = (req,res,next)=> {
    let result = listingSchema.validate(req.body);
    if(result.error){
        let errMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


module.exports.validateReview = (req,res,next)=> {
    let result = reviewSchema.validate(req.body);
    if(result.error){
        let errMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


module.exports.isReviewAuthor = async (req,res,next) => {
    let {id,reviewId} = req.params;
        let review = await Review.findById(reviewId)
        if(!review.author.equals(res.locals.currUser._id))
        {
            req.flash("error","You are not the author of this review");
            return res.redirect(`/listings/${id}`)
        }
        next();
}