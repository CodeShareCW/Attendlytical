const {model, Schema}=require('mongoose')

const facePhotoSchema=new Schema({
    creator:{
        type: Schema.Types.ObjectId,
        required: true
    },
    photoURL:{
        type: String,
        required: true
    },
    photoPublicID:{
        type: String,
        required: true
    },
    faceDescriptor: {
        type: String,
        required: true
    }
},
{timestamps: true})

module.exports=model('FacePhoto', facePhotoSchema)