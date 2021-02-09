require("dotenv").config();
const express = require("express");
const path = require('path');
const session = require("express-session");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const methodOverride = require("method-override");

//Require the router js
const courseRouter = require("./routes/courseRoute");
const userRouter = require("./routes/userRoute");

const app = express();

//Connect to mongoose
mongoose.connect(process.env.MONGO_CONNECT_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION SUCCESSFUL!!!")
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(session(sessionConfig));
app.use(flash());
app.use(methodOverride("_method"));

//Use a middleware to set the res.locals to flash messages
app.use((req,res,next)=>{
    res.locals.success = req.flash("success"); // set the success message
    res.locals.error = req.flash("error"); // set the error message
    next(); // go to next step
});

//Route Information
app.use("/courses",courseRouter);
app.use("/user",userRouter);

module.exports = app;