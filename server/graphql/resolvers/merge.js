const Person = require("../../models/person.model");
const Course = require("../../models/course.model");

const person = async (personID) => {
  try {
    const result = await Person.findById(personID);
    if (result) return PersongqlParser(result);
    else return null;
  } catch (err) {
    throw err;
  }
};

const people = async (personID) => {
  try {
    const results = await Person.find({ _id: { $in: personID } });
    return results.map((r) => {

        return PersongqlParser(r);
      });
  } catch (err) {
    throw err;
  }
};


const course = async (courseID) => {
  try {
    const result = await Course.findById(courseID);
    if (result) return CoursegqlParser(result);
    else return null;
  } catch (err) {
    throw err;
  }
};

const courseUsingShortID = async (courseID) => {
  try {
    const result = await Course.findOne({ shortID: courseID });
    if (result) return CoursegqlParser(result);
    else return null;
  } catch (err) {
    throw err;
  }
};

const courses = async (courseList) => {
  try {
    return courseList.map((r) => {
      return CoursegqlParser(r);
    });
  } catch (err) {
    throw err;
  }
};

const notifications = async (notificationList) => {
  try {
    return notificationList.map((r) => {
      return NotificationgqlParser(r);
    });
  } catch (err) {
    throw err;
  }
};

const PersongqlParser = (person, token) => {
  return {
    ...person._doc,
    createdAt: new Date(person._doc.createdAt).toISOString(),
    lastLogin: new Date(person._doc.lastLogin).toISOString(),
    token,
  };
};

const CoursegqlParser = (course) => {
  return {
    ...course._doc,
    createdAt: new Date(course._doc.createdAt).toISOString(),
    updatedAt: new Date(course._doc.updatedAt).toISOString(),
    creator: person.bind(this, course._doc.creator),
    enrolledStudents: people.bind(this, course._doc.enrolledStudents),
  };
};

const CoursesgqlParser = (coursesList) => {
  return {
    courses: courses.bind(this, coursesList),
  };
};


const NotificationgqlParser = (notification, hasNextPage) => {
  return {
    ...notification._doc,
    createdAt: new Date(notification._doc.createdAt).toISOString(),
    updatedAt: new Date(notification._doc.updatedAt).toISOString(),
    receiver: person.bind(this, notification._doc.receiver),
    hasNextPage,
  };
};

const NotificationsgqlParser = (notificationList, hasNextPage) => {
  return {
    notifications: notifications.bind(this, notificationList),
    hasNextPage,
  };
};

const AttendancegqlParser = (attendanceData) => {
  return {
    ...attendanceData._doc,
    course: courseUsingShortID.bind(this, attendanceData._doc.course),
  };
};

const TrxgqlParser = (trxData) => {
  return {
    ...trxData._doc,
    attendanceID: trxData._doc.attendance,
    studentID: trxData._doc.student,
    createdAt: new Date(trxData._doc.createdAt).toISOString(),
    updatedAt: new Date(trxData._doc.updatedAt).toISOString(),
  };
};

const FacePhotogqlParser = (photo) => {
  return {
    ...photo._doc,
    creator: person.bind(this, photo._doc.creator),
    createdAt: new Date(photo._doc.createdAt).toISOString(),
    updatedAt: new Date(photo._doc.updatedAt).toISOString(),
  };
};

const FacePhotosgqlParser = (photoList, hasNextPage) => {
  return {
    facePhotos: photoList.map((photo) => FacePhotogqlParser(photo)),
    hasNextPage,
  };
};

module.exports = {
  person,
  people,
  course,
  courses,
  notifications,
  CoursegqlParser,
  CoursesgqlParser,
  PersongqlParser,
  NotificationgqlParser,
  NotificationsgqlParser,
  AttendancegqlParser,
  TrxgqlParser,
  FacePhotogqlParser,
  FacePhotosgqlParser,
};
