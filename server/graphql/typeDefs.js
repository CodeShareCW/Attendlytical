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
    cardID: String!
    profilePictureURL: String
    profilePicturePublicID: String
    notifications: [Notification!]
    createdAt: String
    lastLogin: String
    userLevel: Int!
    token: String
  }

  type pendingEnrolledCourse {
    _id: ID!
    student: Person!
    course: Course!
    status: String!
    message: String!
  }

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
    hasNextPage: Boolean
  }

  type Notification {
    _id: ID!
    receiver: Person!
    title: String!
    content: String!
    checked: Boolean!
    createdAt: String!
    updatedAt: String!
    hasNextPage: Boolean
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
    cardID: String!
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

    getCreatedCourses(cursor: String, first: Int!): [Course]
    getEnrolledCourses(cursor: String, first: Int!): [Course]
    getCreatedCoursesCount: Int!
    getEnrolledCoursesCount: Int!
    getCourse(courseID: ID!): Course!

    getWarning(courseID: ID!): Int!

    getNotifications(cursor: String, limit: Int!): [Notification]
    getNotification(notificationID: ID!): Notification!
    getUncheckedNotificationsCount: Int!

    getAttendance(attendanceID: ID!): Attendance!
    getAllAttendance: [Attendance!]
  }

  type Mutation {
    #TODO: Remove this later
    testingRegisterStudent(courseID: String!): String
    register(personInput: personInput!): Person!
    login(email: String!, password: String!): Person!

    editProfile(
      firstName: String!
      lastName: String!
      cardID: String!
      profilePicture: String
    ): Person!

    testingCreateCourse: String
    testingDeleteAllCourse: String

    createCourse(courseInput: courseInput!): Course!
    deleteCourse(courseID: ID!): Course
    approveEnrolment(notificationID: ID!): String
    rejectEnrolment(notificationID: ID!): String

    addParticipant(email: String!, courseID: String!): Person!
    kickParticipant(participantID: ID!, courseID: String!): String!
    warnParticipant(participantID: ID!, courseID: String!): String!
    obtainStudentWarning(participantID: ID!, courseID: String!): Int!

    enrolCourse(courseID: ID!): Course!
    withdrawCourse(courseID: ID!): Course!

    createAttendance(attendanceInput: attendanceInput!): Attendance!
    deleteAttendance(attendanceID: ID!): String

    addPhoto(faceDescriptor: [Float!], data: String!): Photo!
    deletePhoto(facePhotoID: ID!): String

    addGroupPhoto(attendanceID: ID!, data: String!): GroupPhoto!

    getNotifications: [Notification!]
    getNotification(notificationID: ID!): Notification!
    createNotification: String
    deleteAllNotification: String
    checkNotification(notificationID: ID!): Notification!
  }
`;
