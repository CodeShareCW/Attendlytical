const { UserInputError } = require('apollo-server');
const Notification=require('../../models/notification.model')
const Person=require('../../models/person.model')
const {NotificationgqlParser, notifications}=require('./merge')

const checkAuth=require('../../util/check-auth')
const handcoardPerson="5ee3116c8c29144f6896ec40"
module.exports={
    Query:{
        async getNotifications(_,__, context)
        {
            const user=checkAuth(context)
            
            console.log(user)
            try{
                const searchedNotifications=await Notification.find({receiver: user.id}).sort({createdAt: -1})
                return searchedNotifications.map(n=>{
                    return NotificationgqlParser(n)
                })
            }catch(err)
            {
                throw err
            }
        },
        async getNotification(_, {notificationID})
        {
            try {
                const searchedNotification = await Notification.findById(notificationID)
                if (searchedNotification){
                    return PersongqlParser(searchedNotification)
                }
                else
                {
                    throw new UserInputError('Notification do not exist')
                }
            } catch (err) {
                 throw new UserInputError(err);
            }
        }
    },
    Mutation:{
        async createNotification(_, args, context)
        {
            const newNotification=new Notification({
                receiver: args.notificationInput.receiverID,
                title: args.notificationInput.title,
                content: args.notificationInput.content,
            })
            try{
                const savedNotification=await newNotification.save()
                const searchedReceiver=await Person.findById(newNotification.receiver)
                

                if (!searchedReceiver)
                    throw new UserInputError('Receiver not found but receive notification!')
                searchedReceiver.notifications.push(savedNotification)
                await searchedReceiver.save()
                
                return NotificationgqlParser(savedNotification)
            }
            catch(err)
            {
                throw err
            }
        }
    }
}