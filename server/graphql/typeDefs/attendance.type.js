const { gql } = require('apollo-server');
module.exports = gql`
  type Expression {
    attendance: Attendance!
    creator: Person!
    expression: String
  }

  type Attendee {
    attendance: Attendance!
    person: Person!
    expression: String!
  }

  type Attendance {
    _id: ID!
    creator: Person!
    course: Course!
    time: String!
    date: String!
    participants: [Participant!]
    attendees: [Participant!]
    absentees: [Participant!]
  }

  type AttendancesInCourse {
    course: Course!
    attendances: [Attendance!]
  }
  input attendanceInput {
    time: String!
    date: String!
    courseID: ID!
    videoData: String
    attendees: [ID!]
    absentees: [ID!]
    participants: [ID!]
  }
  extend type Query {
    getAttendancesCount: Int!
    getAttendancesCountInCourse(courseID: String!): Int!
    getAttendance(attendanceID: ID!): Attendance!
    getAttendances(currPage: Int!, pageSize: Int!): [Attendance!]
    getAttendancesInCourse(courseID: String!, currPage: Int!, pageSize: Int!): AttendancesInCourse!
  }
  extend type Mutation {
    createAttendance(attendanceInput: attendanceInput!): Attendance!
    deleteAttendance(attendanceID: ID!): Attendance!
    createExpression(
      attendanceID: ID!
      participantID: ID!
      expression: String!
    ): Expression!
  }
`;
