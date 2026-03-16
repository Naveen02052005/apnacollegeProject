const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment: String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt: {
        type:Date,
        default:Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User",
    }
})

module.exports = mongoose.model("Review",reviewSchema);

// this is created in Project Phase 2 part-a   after relations


//  It is one to many relation because only one listing but there are more reviews