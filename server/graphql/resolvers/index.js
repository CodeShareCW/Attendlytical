const personResolvers=require('./person.resolver')
const courseResolvers=require('./course.resolver')
const courseEnrolmentResolvers=require('./courseEnrolment.resolver')
const notificationResolvers=require('./notification.resolver')
const attendanceResolvers=require('./attendance.resolver')
const groupPhotoResolvers=require('./groupPhoto.resolver')
const facePhotoResolvers=require('./facePhoto.resolver')
const warningResolvers=require('./warning.resolver')

module.exports={
    Query: {
        ...personResolvers.Query,
        ...courseResolvers.Query,
        ...courseEnrolmentResolvers.Query,
        ...notificationResolvers.Query,
        ...attendanceResolvers.Query,
        ...groupPhotoResolvers.Query,
        ...facePhotoResolvers.Query,
        ...warningResolvers.Query,
    },
    Mutation: {
        ...personResolvers.Mutation,
        ...courseResolvers.Mutation,
        ...courseEnrolmentResolvers.Mutation,
        ...notificationResolvers.Mutation,
        ...attendanceResolvers.Mutation,
        ...groupPhotoResolvers.Mutation,
        ...facePhotoResolvers.Mutation,
        ...warningResolvers.Mutation
    }
}