const Person = require('../../models/person.model');
const Course = require('../../models/course.model');
const Warning = require('../../models/warning.model');
const Attendance = require('../../models/attendance.model');
const Expression = require('../../models/expression.model');
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
    const results = await Person.find({ _id: { $in: personID } }).sort({
      cardID: 1,
    });
    if (results)
      return results.map((r) => {
        return PersongqlParser(r);
      });
  } catch (err) {
    throw err;
  }
};

const ParticipantsgqlParser = async (
  participantIDList,
  course,
  attendanceID
) => {
  try {
    let participants = await people(participantIDList);
    let parsedParticipants = participants.map(async (stud) => {
      let obj = {};

      const warning = await Warning.findOne({
        student: stud._id,
        course: course._id,
      });

      const expression=await Expression.findOne({
        attendance: attendanceID,
        creator: stud._id
      })

      const attendanceHistories = await Attendance.find({
        participants: stud._id,
        course: course._id,
      });

      const countAttend = attendanceHistories.reduce((prev, curr) => {
        const isAttend = curr.attendees.includes(stud._id);

        return isAttend ? prev + 1 : prev; //if got attend add 1 else remain
      }, 0);

      const info = await Person.findById(stud._id);

      Object.assign(obj, { info: await PersongqlParser(info) });

      Object.assign(obj, {
        attendRate:
          (await attendanceHistories.length) > 0
            ? ((countAttend / attendanceHistories.length) * 100).toFixed(2)
            : null,
      });
      Object.assign(obj, {
        warningCount: (await warning) ? warning.count : 0,
      });
      Object.assign(obj, {
        expression: (await expression) ? expression.expression : "-",
      });

      return obj;
    });

    return parsedParticipants;
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
    hasNextPage,
  };
};

const CoursesgqlParser = (coursesList, hasNextPage) => {
  return {
    courses: courses.bind(this, coursesList),
    hasNextPage,
  };
};

const PendingEnrolledCoursegqlParser = (enrolment) => {
  return {
    ...enrolment._doc,
    createdAt: new Date(enrolment._doc.createdAt).toISOString(),
    updatedAt: new Date(enrolment._doc.updatedAt).toISOString(),
    student: person.bind(this, enrolment._doc.student),
    course: course.bind(this, enrolment._doc.course),
    courseOwner: person.bind(this, enrolment._doc.courseOwner),
  };
};

const PendingEnrolledCoursesgqlParser = (enrolments, hasNextPage) => {
  return {
    pendingEnrolledCourses: enrolments.map((e) =>
      PendingEnrolledCoursegqlParser(e)
    ),
    hasNextPage,
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
    participants: ParticipantsgqlParser(
      attendanceData._doc.participants,
      attendanceData._doc.course,
      attendanceData._id
    ),
    absentees: ParticipantsgqlParser(
      attendanceData._doc.absentees,
      attendanceData._doc.course,
      attendanceData._id
    ),
    // attendees: expressionList.map((exp) => {
    //   return {
    //     person: PersongqlParser(exp.creator),
    //     expression: exp.expression,
    //     attendance: AttendancegqlParser(exp.attendance),
    //   };
    // }),
    attendees: ParticipantsgqlParser(
      attendanceData._doc.attendees,
      attendanceData._doc.course,
      attendanceData._id
    ),
    creator: person.bind(this, attendanceData._doc.creator),
    course: course.bind(this, attendanceData._doc.course),
  };
};

const ExpressiongqlParser = (expression) => {
  return {
    ...expression._doc,
    attendance: AttendancegqlParser(expression._doc.attendance),
    creator: PersongqlParser(expression._doc.creator),
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

const PhotoPrivacygqlParser = (privacy) => {
  console.log(privacy);
  return {
    ...privacy._doc,
    creator: person.bind(this, privacy._doc.creator),
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
  PendingEnrolledCoursesgqlParser,
  PersongqlParser,
  NotificationgqlParser,
  NotificationsgqlParser,
  AttendancegqlParser,
  FacePhotogqlParser,
  FacePhotosgqlParser,
  PhotoPrivacygqlParser,
  ParticipantsgqlParser,
  ExpressiongqlParser,
};
