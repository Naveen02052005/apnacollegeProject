const Listing = require("../Models/listing")
const mapToken = process.env.MAP_TOKEN;

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    // const listing = await Listing.findById(id).populate("reviews"); // we use populate to display data in reviews    res.render("listings/show.ejs",{listing});
    // const listing = await Listing.findById(id).populate("reviews").populate("owner"); // it it show the owner it means if i created one listing with one account than it shows who is created by its username 
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",model:"User"},}).populate("owner");   // it is to print every author name for each review
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing})
}

module.exports.createListing = async(req,res,next) =>{ // now here first validateListing call will be sent then next work will be done
    const axios = require("axios");

    const apiKey = process.env.MAP_TOKEN;
    
    const response = await axios.get(
        "https://api.openrouteservice.org/geocode/search",
        {
            params: {
                api_key: process.env.MAP_TOKEN,
                text: req.body.listing.location,
                size: 1
            }
        }
    );

    let geometry;

    if (response.data.features.length > 0) {
        geometry = response.data.features[0].geometry;
    } else {
        req.flash("error", "Invalid location");
        return res.redirect("/listings/new");
    }
    let url = req.file.path;
    let filename = req.file.filename;

    // console.log(url,"...",filename);

    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created!")
    res.redirect("/listings");
}

module.exports.renderEditForm = async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        return res.redirect("/listings");
    }
    // req.flash("success","Listing is Updated")

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250") // reducing image preview quality to 300 X 250 pixels
    res.render("listings/edit.ejs",{listing, originalImageUrl})
}

module.exports.updateListing = async(req,res)=>{ // now here first validateListing call will be sent then next work will be done
    let {id} = req.params;
    // let listing = await Listing.findById(id)
    // if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id))
    // {
    //     req.flash("error","You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`)
    // } // we are writing this as middleware instead of writing always in everywhere
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}) // req.body.listing is javascript object it consists of all parameters & ... are used to take everything inside req.body.listing 
    
    if(typeof req.file !== "undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
        req.flash("success","Listing is Updated");
        listing.image = { url, filename};
        await listing.save();
    }
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let { id } = req.params;
    let deleteListing =  await Listing.findByIdAndDelete(id)
    console.log(deleteListing);
    req.flash("success","Lisiting Deleted");
    res.redirect("/listings");
}