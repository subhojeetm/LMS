const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name : {
        type: String,
        required: [true,"Course name is mandatory"]
    },
    category : {
        type: String,
        required: true
    },
    oneLiner : {
        type: String
    },
    description : {
        type: String
    },
    duration : {
        type: Number,
        required: [true,"Course duration is mandatory"]
    },
    photo: {
        type: String,
        required: [true,"Course photo URL is mandatory"]
    }
});

const Course = mongoose.model("Course",courseSchema);

module.exports = Course;