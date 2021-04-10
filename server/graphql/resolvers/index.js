const personResolvers=require('./person.resolver')
const courseResolvers=require('./course.resolver')
const courseEnrolmentResolvers=require('./courseEnrolment.resolver')
const notificationResolvers=require('./notification.resolver')
const attendanceResolvers=require('./attendance.resolver')
const facePhotoResolvers=require('./facePhoto.resolver')
const warningResolvers=require('./warning.resolver')
const trxResolvers=require('./trx.resolver')

module.exports={
    Query: {
        ...personResolvers.Query,
        ...courseResolvers.Query,
        ...courseEnrolmentResolvers.Query,
        ...notificationResolvers.Query,
        ...attendanceResolvers.Query,
        ...facePhotoResolvers.Query,
        ...warningResolvers.Query,
        ...trxResolvers.Query
    },
    Mutation: {
        ...personResolvers.Mutation,
        ...courseResolvers.Mutation,
        ...courseEnrolmentResolvers.Mutation,
        ...notificationResolvers.Mutation,
        ...attendanceResolvers.Mutation,
        ...facePhotoResolvers.Mutation,
        ...warningResolvers.Mutation,
        ...trxResolvers.Mutation
    }
}