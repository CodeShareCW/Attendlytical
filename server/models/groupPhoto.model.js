const {model, Schema}=require('mongoose')

const groupPhotoSchema=new Schema({
    attendanceID:{
        type: Schema.Types.ObjectId,
        required: true
    },
    data:{
        type: String,
        required: true
    }
},
{timestamps: true})

module.exports=model('GroupPhoto', groupPhotoSchema)