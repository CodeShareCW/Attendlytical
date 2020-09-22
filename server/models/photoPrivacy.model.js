const {model, Schema}=require('mongoose')

const PhotoPrivacySchema=new Schema({
    creator:{
        type: Schema.Types.ObjectId,
        required: true
    },
    public:{
        type: Boolean,
        default: false
    }
},
{timestamps: true})

module.exports=model('PhotoPrivacy', PhotoPrivacySchema)