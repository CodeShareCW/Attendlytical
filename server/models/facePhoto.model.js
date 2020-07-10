const {model, Schema}=require('mongoose')

const facePhotoSchema=new Schema({
    creatorID:{
        type: Schema.Types.ObjectId,
        required: true
    },
    data:{
        type: String,
        required: true
    },
    faceDescriptor: {
        type: [Schema.Types.Double],
        required: true
    }
},
{timestamps: true})

module.exports=model('FacePhoto', facePhotoSchema)