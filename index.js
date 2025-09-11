const express = require("express")
const app = express()
const path = require("path")
const listing = require("./routes/listing")
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

// review route
app.post("/listings/:id/reviews",async (req,res)=>{

    let listing = await Listing.findById(req.params.id);
    let newReview = await new Review(req.body.review)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save()
    res.redirect(`/listings/${listing._id}`);
    
})
// delete review 
app.delete("/listings/:id/reviews/:reviewId",wrapAsync( async(req,res)=>{
    let { id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
}))
app.use("/listings",listing)


app.use((err,req,res,next)=>{
    let {status =500,message='something went wrong'}=err;
    res.status(status).render("error.ejs", {message});

})
app.listen(3000,()=>{
    console.log("server started")
})