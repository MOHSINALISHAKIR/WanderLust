const express = require("express")
const app = express()
const path = require("path")
// connect mongodb
const connectDb = require("./config/connect")
const Listing = require("./models/listing")

// Middlewares
app.use(express.json())
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))

// connect - db
connectDb('mongodb://127.0.0.1:27017/wanderlust').then(()=>{
    console.log("connect to db")
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
app.listen(3000,()=>{
    console.log("server started")
})