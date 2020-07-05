const Person = require("../../models/person.model");
const Course = require("../../models/course.model");
const Notification = require("../../models/notification.model");
const Attendance = require("../../models/attendance.model");

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
    if (results)
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

const courses = async (courseID) => {
  try {
    const results = await Course.find({ _id: { $in: courseID } });
    return results.map((r) => {
      return CoursegqlParser(r);
    });
  } catch (err) {
    throw err;
  }
};

const notifications = async (notificationID) => {
  try {
    const results = await Notification.find({ _id: { $in: notificationID } });
    return results.map((r) => {
      return NotificationgqlParser(r);
    });
  } catch (err) {
    throw err;
  }
};

const PersongqlParser = (person, token) => {
  return {
    ...person._doc,
    createdAt: new Date(person._doc.createdAt).toString(),
    lastLogin: new Date(person._doc.lastLogin).toString(),
    enrolledCourses: courses.bind(this, person._doc.enrolledCourses),
    createdCourses: courses.bind(this, person._doc.createdCourses),
    notification: notifications.bind(this, person._doc.notification),
    token: token,
  };
};

const CoursegqlParser = (course) => {
  return {
    ...course._doc,
    createdAt: new Date(course._doc.createdAt).toString(),
    updatedAt: new Date(course._doc.updatedAt).toString(),
    creator: person.bind(this, course._doc.creator),
    enrolledStudents: people.bind(this, course._doc.enrolledStudents),
  };
};

const NotificationgqlParser = (notification) => {
  return {
    ...notification._doc,
    createdAt: new Date(notification._doc.createdAt).toString(),
    updatedAt: new Date(notification._doc.updatedAt).toString(),
    receiver: person.bind(this, notification._doc.receiver),
  };
};

const AttendancegqlParser = (attendance) => {
  console.log(attendance);
  return {
    ...attendance._doc,
    creator: person.bind(this, attendance._doc.creator),
    course: course.bind(this, attendance._doc.course),
  };
};

module.exports = {
  person,
  people,
  course,
  courses,
  notifications,
  CoursegqlParser,
  PersongqlParser,
  NotificationgqlParser,
  AttendancegqlParser,
};
