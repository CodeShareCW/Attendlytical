const personResolvers=require('./person.resolver')
const courseResolvers=require('./course.resolver')
const notificationResolvers=require('./notification.resolver')

module.exports={
    Query: {
        ...personResolvers.Query,
        ...courseResolvers.Query,
        ...notificationResolvers.Query
    },
    Mutation: {
        ...personResolvers.Mutation,
        ...courseResolvers.Mutation,
        ...notificationResolvers.Mutation
    }
}