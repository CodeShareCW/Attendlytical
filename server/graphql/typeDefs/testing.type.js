const { gql } = require('apollo-server');
module.exports = gql`
  extend type Mutation {
    #TODO: Remove this later
    testingRegisterStudent(courseID: String!): String
    testingCreateCourse: String
    testingDeleteAllCourse: String

    createNotification: String
    deleteAllNotification: String

    obtainStudentWarning(participantID: ID!, courseID: String!): Int!

}
`;
