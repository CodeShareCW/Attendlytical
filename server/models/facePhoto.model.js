const {model, Schema}=require('mongoose')

const facePhotoSchema=new Schema({
    creator:{
        type: Schema.Types.ObjectId,
        required: true
    },
    data:{
        type: String,
        required: true
    },
    faceDescriptor: {
        type: [Schema.Types.Decimal128],
        required: true
    }
},
{timestamps: true})

module.exports=model('FacePhoto', facePhotoSchema)