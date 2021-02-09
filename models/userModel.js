const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type: String,
        required: [true,"Display name cannot be blank"]
    },
    email : {
        type: String,
        required: [true,"Email ID is required"]
    },
    password : {
        type: String,
        required: [true,"Password is required"]
    },
    usertype : {
        type : String,
        required : [true,"User type is required"]
    }
});

//Add a middleware to check if password has been changed. Then only generate a new hash
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next(); //if password is not modified, call next. no need to hash it again
    }
    else {
        this.password = await bcrypt.hash(this.password,12); //override the plain text password with hash
        next();
    }  
});

userSchema.statics.findAndAuthenticate = async function(email,password) {
    try{
        const foundUser = await User.findOne({email});
        const isValid = await bcrypt.compare(password,foundUser.password);
        return isValid ? foundUser : false;
    }
    catch(err){
        console.log(err);
    }
}
const User = mongoose.model("User",userSchema);

module.exports = User;