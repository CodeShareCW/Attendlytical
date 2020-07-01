const {model, Schema}=require('mongoose')

const notificationSchema=new Schema({
    receiver:{
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    }
},
{timestamps: true})

module.exports=model('Notification', notificationSchema)