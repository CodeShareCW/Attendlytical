const {model, Schema}=require('mongoose')

const courseSchema=new Schema({
    creator:{
        type: Schema.Types.ObjectId,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    session:{
        type: String,
        required: true
    },
    enrolledStudents: {
        type: [Schema.Types.ObjectId],
        ref: 'Person'
    },
    attendanceList: {
        type: [Schema.Types.ObjectId],
        ref: 'Attendance'
    }

},
{timestamps: true})

module.exports=model('Course', courseSchema)