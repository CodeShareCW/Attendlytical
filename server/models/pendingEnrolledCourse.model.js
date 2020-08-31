const {model, Schema}=require('mongoose')

const pendingEnrolledCourseSchema=new Schema({
    message:{
        type: String,
        default: "pending"
    },
    status:{
        type: String,
        default: "pending"
    },
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