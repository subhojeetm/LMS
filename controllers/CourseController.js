const Course = require("../models/courseModel");

const categories = ["Programming Language","Web Programming","Data Science","Statistics","Mathematics","Cloud Computing"]

exports.showCourses = async (req,res) => {
    
    //find all courses
    try{
        const courses = await Course.find({});
     
        const data = {
            username : req.session.username,
            userid: req.session.userid,
            usertype: req.session.usertype,
            title:"LMS",
            courses
        }
        res.render("./course/index",data);

    } catch(err) {
        req.flash("error","DB error while fetching courses");
        console.log(err);
        res.redirect("/error/500");
    }

}

exports.createCourse = (req,res) => {
    
    const data = {
        username : req.session.username,
        userid: req.session.userid,
        usertype: req.session.usertype,
        title:"Add Course",
        categories
    }
    res.render("./course/new",data);
}

exports.createCourseProcess= async (req,res) => {
    const {name,oneLiner,description,photo} = req.body.course; //destructure few variables
    const duration = parseInt(req.body.course.duration);
    const category = categories[parseInt(req.body.course.category)]; //get the category name from array
    const newCourseObj = {
        name,
        category,
        oneLiner,
        description,
        duration,
        photo
    };
    const newCourse = new Course(newCourseObj);
    try{
        await newCourse.save();
        req.flash("success","New course added successfully");
        res.redirect("/courses");
    } catch(err) {
        req.flash("error","DB Error while saving new course");
        res.redirect("/courses");
    }
}

exports.deleteCourse = async (req,res) =>{
    const {id} = req.params; // destructure id from req.params.
    try{
        await Course.findByIdAndDelete(id);
        req.flash("success","Course Deleted");
        res.redirect("/courses");
    } catch(err){
        req.flash("error","DB error while deleting course");
        res.redirect("/courses");
    }
}

exports.showEditPage = async (req,res) => {
    const {id} = req.params;
    try{
        const foundCourse = await Course.findById(id);
        if(foundCourse){
            const data = {
                username : req.session.username,
                userid: req.session.userid,
                usertype: req.session.usertype,
                title:"Edit Course",
                foundCourse,
                categories
            }
            res.render("./course/edit",data);
        } else {
            req.flash("error","No such course found for Edit");
            res.redirect("/courses");
        }
    } catch(err) {
        req.flash("error","DB error while fetching course details for Edit course page");
    }
    
}

exports.updateCourse = async (req,res) => {
    const {id} = req.params;

    const {name,oneLiner,description,photo} = req.body.course; //destructure few variables
    const duration = parseInt(req.body.course.duration);
    const category = categories[parseInt(req.body.course.category)]; //get the category name from array
    const newCourseObj = {
        name,
        category,
        oneLiner,
        description,
        duration,
        photo
    };
    
    try{
        await Course.findByIdAndUpdate(id, newCourseObj, { new: true,useFindAndModify: false });
        req.flash("success","Course udpated successfully");
        res.redirect("/courses");
    } catch(err) {
        req.flash("error","DB Error while updating course");
        console.log(err);
        res.redirect("/courses");
    }

}

exports.showCourse = async (req,res)=>{
    const {id} = req.params;
    try{
        const foundCourse = await Course.findById(id);
        if(foundCourse){
            const data = {
                username : req.session.username,
                userid: req.session.userid,
                usertype: req.session.usertype,
                title:"Course Details",
                foundCourse,
                categories
            }
            res.render("./course/show",data);
        } else {
            req.flash("error","No such course found");
            res.redirect("/courses");
        }
    } catch(err) {
        req.flash("error","DB error while fetching course details for Show course page");
    }
}