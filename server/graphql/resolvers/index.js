const personResolvers=require('./person.resolver')
const courseResolvers=require('./course.resolver')
const notificationResolvers=require('./notification.resolver')
const attendanceResolvers=require('./attendance.resolver')
module.exports={
    Query: {
        ...personResolvers.Query,
        ...courseResolvers.Query,
        ...notificationResolvers.Query,
        ...attendanceResolvers.Query
    },
    Mutation: {
        ...personResolvers.Mutation,
        ...courseResolvers.Mutation,
        ...attendanceResolvers.Mutation
    }
}