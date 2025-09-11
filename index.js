const express = require("express")
const app = express()
const path = require("path")
const listing = require("./routes/listing")
const reviews = require("./routes/review")
// method override
const methodOverrid = require("method-override")
// ejsmate
const ejsMate = require("ejs-mate")
app.engine('ejs', ejsMate);
// connect mongodb
const connectDb = require("./config/connect")
// Middlewares
app.use(express.json())
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}))
// method override
app.use(methodOverrid("_method"))

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


app.use("/listings",listing)
app.use("/listings/:id/reviews",reviews)


app.use((err,req,res,next)=>{
    let {status =500,message='something went wrong'}=err;
    res.status(status).render("error.ejs", {message});

})
app.listen(3000,()=>{
    console.log("server started")
})