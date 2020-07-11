const { gql } = require("apollo-server");

module.exports = gql`
  """
  Type
  Note: Here declare the object type
  """
  type Person {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    notifications: [Notification!]
    createdAt: String
    lastLogin: String
    userLevel: Int!
    token: String!
  }

  type pendingEnrolledCourse{
    _id: ID!
    student: Person!
    course: Course!
  }

  type Course {
    _id: ID!
    creator: Person!
    code: String!
    name: String!
    session: String!
    enrolledStudents: [Person!]
    attendanceList: [Attendance!]
  }

  type Notification {
    _id: ID!
    receiver: Person!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  type Attendance {
    _id: ID!
    creator: Person!
    course: Course!
    start: String!
    end: String!
    date: String!
    gPhoto: [GroupPhoto!]
    absentees: [Person!]
    attendees: [Person!]
  }

  type GroupPhoto {
    _id: ID!
    attendance: Attendance!
    data: String!
  }

  type Photo {
    _id: ID!
    creator: Person!
    data: String!
    faceDescriptor: [Float!]
  }

  """
  Input
  Note: Here Declare the input type
  """
  input personInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    confirmPassword: String!
    userLevel: Int!
  }

  input courseInput {
    code: String!
    name: String!
    session: String!
  }

  input notificationInput {
    receiverID: ID!
    title: String!
    content: String!
  }

  input attendanceInput {
    start: String!
    end: String!
    date: String!
    courseID: ID!
    attendees: [ID!]
    absentees: [ID!]
  }

  """
  Main Type
  Note: Here declare the main Query and Mutation rules
  """
  type Query {
    getPeople: [Person]
    getPerson(personID: ID!): Person!

    getCourses: [Course]
    getCourse(courseID: ID!): Course!

    getNotifications: [Notification]
    getNotification(notificationID: ID!): Notification!

    getAttendance(attendanceID: ID!): Attendance!
    getAllAttendance: [Attendance!]    
  }

  type Mutation {
    register(personInput: personInput!): Person!
    login(email: String!, password: String!): Person!

    createCourse(courseInput: courseInput!): Course!
    deleteCourse(personID: ID!, courseID: ID!): Course
    approveEnrolment(enrolmentID: ID!): String
    rejectEnrolment(enrolmentID: ID!): String

    enrolCourse(courseID: ID!): Course!
    unEnrolCourse(courseID: ID!): Course!

    createAttendance(attendanceInput: attendanceInput!): Attendance!
    deleteAttendance(attendanceID: ID!): String

    addPhoto(faceDescriptor: [Float!], data: String!): Photo!
    deletePhoto(facePhotoID: ID!): String

    addGroupPhoto(attendanceID: ID!, data: String!): GroupPhoto!
  }
`;
