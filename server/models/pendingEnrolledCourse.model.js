const {model, Schema}=require('mongoose')

const pendingEnrolledCourseSchema=new Schema({
    student: {
        type: Schema.Types.ObjectId,
        require: true
    },
    course: {
        type: Schema.Types.ObjectId,
        require: true
    },
},{timestamps: true})

module.exports=model('PendingEnrolledCourse', pendingEnrolledCourseSchema)