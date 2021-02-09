const express = require("express");
const {isInstructor} = require("../middleware/middleware");

const router = express.Router();

const CourseController = require("../controllers/CourseController");

router.get("/",CourseController.showCourses);
router.get("/new",isInstructor,CourseController.createCourse); //Used middleware function isInstructor to 
                                            // validate that only an instructor can add a course

router.get("/:id",CourseController.showCourse);                                            
router.get("/:id/edit",isInstructor,CourseController.showEditPage);
router.post("/new",isInstructor,CourseController.createCourseProcess);   
router.put("/:id/edit",isInstructor,CourseController.updateCourse);        
router.delete("/:id",isInstructor,CourseController.deleteCourse);


module.exports = router;