const express = require("express")
const app = express()
const path = require("path")
const methodOverrid = require("method-override")
// connect mongodb
const connectDb = require("./config/connect")
const Listing = require("./models/listing")

// Middlewares
app.use(express.json())
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverrid("_method"))

// connect - db
connectDb('mongodb://127.0.0.1:27017/wanderlust').then(()=>{
    console.log("connect to db")
})
// New Route
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs")
})

// All Listings
app.get("/listings",async (req,res)=>{
    let data = await Listing.find({});
    res.render("listing.ejs",{data})
    
})
// Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
    res.render("show.ejs",{data})

})

// Create Listing
app.post("/listings",async (req,res)=>{
    
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
})
// Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("edit.ejs",{data})
})
// update Route
app.put("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing})
    res.redirect("/listings")
})
app.listen(3000,()=>{
    console.log("server started")
})