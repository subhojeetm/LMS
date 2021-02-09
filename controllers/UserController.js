const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.showLoginPage = (req,res) => {
    const data = {
        username : req.session.username,
        title:"Login"
    }

    res.render("./user/login",data)
}

exports.showRegisterPage = (req,res) => {
    const data = {
        username : req.session.username,
        title:"Register"
    }

    res.render("./user/register",data)
}

exports.registerUser = async (req,res)=>{
    const {username,email,password,usertype} = req.body;

    try{
        const foundUser = await User.findOne({email});
        //If a user is found with the email id - throw error and return to register
        if(foundUser){
            req.flash("error","User already registered");
            res.redirect("/user/register");
        } else {
            //flash success message and redirect to courses page
            req.flash("success","User registration successful");
            const user = new User({username,email,password,usertype});
            //try saving the user
            try{
                await user.save();
                req.session.username = username;
                req.session.userid = user._id;
                req.session.usertype = usertype;
                res.redirect("/courses");
            } catch(err) {
                req.flash("error","DB error while saving user");
                console.log(err);
            }
            
        }
    } catch(err){
        req.flash("error","DB error while finding user during new registration");
        console.log(err);
    }

}

exports.logoutUser = (req,res) =>{
    req.session.destroy();
    res.redirect("/courses");
}

exports.loginUser = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const foundUser = await User.findAndAuthenticate(email,password);
        if(foundUser){
            req.session.username = foundUser.username;
            req.session.userid = foundUser._id;
            req.session.usertype = foundUser.usertype;
            res.redirect("/courses");
        } else {
            req.session.username = false;
            req.flash("error","Email or Password is invalid");
            res.redirect("/user/login")
        }

    } catch(err){
        console.log(err);
        req.flash("error","Email or Password is invalid");
        res.redirect("/user/login");
    }
}

exports.editProfile =  async (req,res) => {
    const {id} = req.params;
    try{
        const foundUser = await User.findById(id);
        const data = {
            username : req.session.username,
            title:"Update Profile",
            foundUser
        }
        res.render("./user/show",data);

    } catch(err) {
        req.flash("error","DB error while fetching user data");
        res.redirect("/courses");
        console.log(err);
    }
}

exports.updateProfile = async (req,res) => {
    
    const {id} = req.params;
    const update = {username : req.body.username};
    try{
        const user = await User.findByIdAndUpdate(id,update,{new:true, upsert: false,useFindAndModify : false});
        req.flash("success","User profile updated successfully");
        req.session.username = user.username;
        res.redirect("/courses");
    } catch(err) {
        req.flash("error","DB error while updating user profile");
        console.log(err);
    }  
}

exports.updatePassword = async (req,res) => {
    const {id} = req.params;
    let {newpassword, confirmpassword} = req.body;

    if(newpassword !== confirmpassword) {
        req.flash("error","New Password and Confirm Password should match");
        res.redirect(`/user/${id}/edit`);
    } else {
        newpassword = await bcrypt.hash(newpassword,12); 
        const update = {password : newpassword}
        try{
            const user = await User.findByIdAndUpdate(id,update,{new:true, upsert: false,useFindAndModify : false});
            req.flash("success","Password changed successfully");
            res.redirect("/courses");
        } catch(err) {
            req.flash("error","DB error while updating password");
            res.redirect(`/user/${id}/edit`);
        }
        
    }
}