const { gql } = require('apollo-server');
module.exports = gql`
  type Course {
    _id: ID!
    shortID: String!
    creator: Person!
    code: String!
    name: String!
    session: String!
    enrolledStudents: [Person!]
    attendanceList: [Attendance!]
    createdAt: String
  }

  type Courses {
    courses: [Course!]
  }

  type CourseVParticipants {
    course: Course!
    attendanceCount: Int!
    participants: [Participant!]
  }

  input courseInput {
    code: String!
    name: String!
    session: String!
  }

  extend type Query {
    getCourses(currPage: Int!, pageSize: Int!): Courses
    getCoursesCount: Int!
    getCourseAndParticipants(courseID: ID!): CourseVParticipants!
    getCourse(courseID: ID!): Course!

  }

  extend type Mutation {
    createCourse(courseInput: courseInput!): Course!
    deleteCourse(courseID: ID!): Course

    enrolCourse(courseID: ID!): pendingEnrolledCourse!
    withdrawCourse(courseID: ID!): String
  }
`;
