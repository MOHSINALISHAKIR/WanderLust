const express = require("express")
const app = express()
const path = require("path")
// method override
const methodOverrid = require("method-override")
// ejsmate
const ejsMate = require("ejs-mate")
app.engine('ejs', ejsMate);
// connect mongodb
const connectDb = require("./config/connect")
// lising model
const Listing = require("./models/listing")
// review model
const Review = require("./models/review")

// Middlewares
app.use(express.json())
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}))
// method override
app.use(methodOverrid("_method"))
// wrapAsync Function
const wrapAsync = require("./utils/wrapAsync")
// ExpressError
const ExpressError = require("./utils/ExpressError")
// connect - db
connectDb('mongodb://127.0.0.1:27017/wanderlust').then(()=>{
    console.log("connect to db")
})
//home route
app.get("/",(req,res)=>{
    res.send("welcome to wanderlust")
})
// New Route
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs")
})

// All Listings
app.get("/listings",wrapAsync( async (req,res)=>{
    let data = await Listing.find({});
    res.render("listing.ejs",{data})
    
}))
// Show Route
app.get("/listings/:id",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    res.render("show.ejs",{data})

}))

// Create Listing
app.post("/listings", wrapAsync( async (req,res,next)=>{

    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
        
    
    
    
}))
// Edit Route
app.get("/listings/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("edit.ejs",{data})
}))
// update Route
app.put("/listings/:id",wrapAsync( async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings")
}))
// delete route
app.delete("/listings/:id",wrapAsync( async(req,res)=>{
    let {id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}))
// review route
app.post("/listings/:id/reviews",async (req,res)=>{

    let listing = await Listing.findById(req.params.id);
    let newReview = await new Review(req.body.review)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save()
    res.redirect(`/listings/${listing._id}`);
    
})


app.use((err,req,res,next)=>{
    let {status =500,message='something went wrong'}=err;
    res.status(status).render("error.ejs", {message});

})
app.listen(3000,()=>{
    console.log("server started")
})