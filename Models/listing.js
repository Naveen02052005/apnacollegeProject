const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    description: String,
    // image: {
    //     type:String,
    //     default:"https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/fc/5a/ab/cb/03/v1_E10/E108OQIU.jpg?w=500&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=58df5d6597e4de70b0550c4e5e4f8905f6b1bfeaf409439251a28fa6126547c6",
    //     set:(v) => v === "" ?  "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/fc/5a/ab/cb/03/v1_E10/E108OQIU.jpg?w=500&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=58df5d6597e4de70b0550c4e5e4f8905f6b1bfeaf409439251a28fa6126547c6": v // it is set method when url is sent from user then that url is used other wise default url is used and here we are used ternay operator
    // },

    image: {
        url:String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[ // this is added in Project Phase 2 part-a   after relations
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    // coordinates: {
    //     type:[Number],
    //     require: true
    // }

    // instead of this coordinates we are using GeoJSON it is used to stroe the latitudes and longitudes  this functionality is provided by mongodb and we can directly perform operations

    geometry: {
        type: {
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
     ,   }
    },
    // category:{
    //     type:String,
    //     enum:["Mountains","arctic","Farms","Castles"]
    // }  This is for backend for the home page
});


//  Below is to delete review when listing is deleted

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
})

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;