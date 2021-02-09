module.exports.isInstructor = (req,res,next) => {
    if(req.session.usertype !== "1") {
        req.flash("error","Please login as Instructor to create a new course");
        return res.redirect("/user/login");
    }
    next();
}