const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync")
const Listing = require("../models/listing")
// New Route
router.get("/new",(req,res)=>{
    res.render("new.ejs")
})

// All Listings
router.get("/",wrapAsync( async (req,res)=>{
    let data = await Listing.find({});
    res.render("listing.ejs",{data})
    
}))
// Show Route
router.get("/:id",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id).populate("reviews");
    res.render("show.ejs",{data})

}))

// Create Listing
router.post("/", wrapAsync( async (req,res,next)=>{

    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
        
    
    
    
}))
// Edit Route
router.get("/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("edit.ejs",{data})
}))
// update Route
router.put("/:id",wrapAsync( async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings")
}))
// delete route
router.delete("/:id",wrapAsync( async(req,res)=>{
    let {id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}))

module.exports = router;