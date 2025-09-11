const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync")
const Listing = require("../models/listing")
const reviews = require("../models/review")
// review route
router.post("/",async (req,res)=>{

    let listing = await Listing.findById(req.params.id);
    let newReview = await new reviews(req.body.review)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save()
    res.redirect(`/listings/${listing._id}`);
    
})
// delete review 
router.delete("/:reviewId",wrapAsync( async(req,res)=>{
    let { id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await reviews.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
}))
module.exports = router;