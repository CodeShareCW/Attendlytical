const { gql } = require('apollo-server');
module.exports = gql`
  type pendingEnrolledCourse {
    _id: ID!
    student: Person!
    course: Course!
    courseOwner: Person!
    status: String!
    message: String!
  }

  type pendingEnrolledCourses {
    pendingEnrolledCourses: [pendingEnrolledCourse!]
    hasNextPage: Boolean
  }

  extend type Query {
    getPendingEnrolledCourses(cursor: ID, limit: Int!): pendingEnrolledCourses
    getEnrolRequestCount: Int!
    getEnrolPendingCount: Int!
  }

  extend type Mutation{
    approveEnrolment(enrolmentID: ID!): String
    rejectEnrolment(enrolmentID: ID!): String
  }
`;
