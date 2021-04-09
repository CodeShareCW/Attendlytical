const {model, Schema}=require('mongoose')

const courseSchema=new Schema({
    creator:{
        type: Schema.Types.ObjectId,
        required: true
    },
    shortID:{
        type: String,
        default: "abc"
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
    }
},
{timestamps: true})

module.exports=model('Course', courseSchema)