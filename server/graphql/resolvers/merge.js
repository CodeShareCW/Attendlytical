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
    const results = await Person.find({ _id: { $in: personID } }).sort({firstName: 1});
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

const courses = async (coursesData) => {
  try {
    return coursesData.map((r) => {
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

const attendance = async (attendanceID) => {
  try {
    const results = await Attendance.findByID(attendanceID);
    return results.map((r) => {
      return AttendancegqlParser(r);
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
    enrolledCourses: courses.bind(this, person._doc.enrolledCourses),
    createdCourses: courses.bind(this, person._doc.createdCourses),
    notifications: notifications.bind(this, person._doc.notification),
    token,
  };
};

const CoursegqlParser = (course, hasNextPage) => {
  return {
    ...course._doc,
    createdAt: new Date(course._doc.createdAt).toISOString(),
    updatedAt: new Date(course._doc.updatedAt).toISOString(),
    creator: person.bind(this, course._doc.creator),
    enrolledStudents: people.bind(this, course._doc.enrolledStudents),
    hasNextPage
  };
};

const CoursesgqlParser=(coursesData, hasNextPage)=>{
  
  return {
   courses: courses.bind(this, coursesData),
   hasNextPage
  }
}

const PendingEnrolledCoursegqlParser = (enrolment, hasNextPage) => {
  return {
    ...enrolment._doc,
    createdAt: new Date(enrolment._doc.createdAt).toISOString(),
    updatedAt: new Date(enrolment._doc.updatedAt).toISOString(),
    student: person.bind(this, enrolment._doc.student),
    course: course.bind(this, enrolment._doc.course),
    courseOwner: person.bind(this, enrolment._doc.courseOwner),
    hasNextPage
  };
};

const NotificationgqlParser = (notification, hasNextPage) => {
  return {
    ...notification._doc,
    createdAt: new Date(notification._doc.createdAt).toISOString(),
    updatedAt: new Date(notification._doc.updatedAt).toISOString(),
    receiver: person.bind(this, notification._doc.receiver),
    hasNextPage
  };
};

const AttendancegqlParser = (attendance) => {
  console.log(attendance);
  return {
    ...attendance._doc,
    attendees: people.bind(this, attendance._doc.attendees),
    absentees: people.bind(this, attendance._doc.absentees),
    creator: person.bind(this, attendance._doc.creator),
    course: course.bind(this, attendance._doc.course),
  };
};

const FacePhotogqlParser = (photo) => {
  console.log(photo);
  return {
    ...photo._doc,
    creator: person.bind(this, photo._doc.creator),
    faceDescriptor: photo._doc.faceDescriptor.map(p=>p.toISOString())
  };
};

const GroupPhotogqlParser = (gPhoto) => {
  console.log(gPhoto);
  return {
    ...gPhoto._doc,
    attendance: attendance.bind(this, gPhoto._doc.attendance),
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

  PendingEnrolledCoursegqlParser,
  PersongqlParser,
  NotificationgqlParser,
  AttendancegqlParser,
  FacePhotogqlParser,
  GroupPhotogqlParser
};
