const { UserInputError } = require("apollo-server");
const Attendance = require("../../models/attendance.model");
const Course = require("../../models/course.model");
const Notification = require("../../models/notification.model");
const Person = require("../../models/person.model");

const { CoursegqlParser, AttendancegqlParser } = require("./merge");
const { validateAttendanceInput } = require("../../util/validators");
const checkAuth = require("../../util/check-auth");
const { OfficialURL, MAIL_TEMPLATE_TYPE } = require("../../globalData");
const { sendEmail } = require("../../util/mail");

module.exports = {
  Query: {
    async getAttendanceListCountInCourse(_, { courseID }, context) {
      const currUser = checkAuth(context);
      try {
        const course = await Course.findOne({ shortID: courseID });
        if (!course) {
          throw new Error("Course do not exist");
        }

        if (
          course.creator != currUser._id &&
          !course.enrolledStudents.find((stud) => stud._id == currUser._id)
        ) {
          throw new Error(
            "Access forbidden. You are not the course owner or join this course."
          );
        }
        let attendanceList;

        if (currUser.userLevel === 0) {
          attendanceList = await Attendance.find({ course: course.shortID }, [
            "id",
          ]);
        } else if (currUser.userLevel === 1) {
          attendanceList = await Attendance.find({ course: course.shortID }, [
            "id",
          ]);
        } else
          throw new Error(
            `Something wrong with your role index: ${currUser.userLevel}!`
          );
        return attendanceList.length;
      } catch (err) {
        throw err;
      }
    },

    async getAttendance(_, { attendanceID }, context) {
      const currUser = checkAuth(context);
      try {
        const attendance = await Attendance.findById(attendanceID);

        if (!attendance) {
          throw new Error("Attendance do not exist");
        }

        const course = await Course.findOne({ shortID: attendance.course });
        if (!course) {
          throw new Error("Course do not exist");
        }

        if (
          course.creator != currUser._id &&
          !course.enrolledStudents.find((user) => user._id == currUser._id)
        ) {
          throw new Error(
            "Access forbidden. You are not the course owner or participants in this course."
          );
        }

        return AttendancegqlParser(attendance);
      } catch (err) {
        throw err;
      }
    },

    async getAttendanceListInCourse(
      _,
      { courseID, currPage, pageSize },
      context
    ) {
      const currUser = checkAuth(context);
      try {
        const course = await Course.findOne({ shortID: courseID });

        if (!course) {
          throw new Error("Course do not exist");
        }
        if (
          course.creator != currUser._id &&
          !course.enrolledStudents.find((stud) => stud._id == currUser._id)
        ) {
          throw new Error(
            "Access forbidden. You are not the course owner or join this course."
          );
        }

        let createdAttendance_list = [];
        if (currUser.userLevel === 0) {
          createdAttendance_list = await Attendance.find({
            course: course.shortID,
          })
            .skip((currPage - 1) * pageSize)
            .limit(pageSize)
            .sort({ _id: -1 });
        } else if (currUser.userLevel === 1) {
          createdAttendance_list = await Attendance.find({
            course: course.shortID,
          })
            .skip((currPage - 1) * pageSize)
            .limit(pageSize)
            .sort({ _id: -1 });
        } else {
          throw new Error("Something wrong");
        }
        return {
          course: CoursegqlParser(course),
          attendanceList: createdAttendance_list.map((attendance) =>
            AttendancegqlParser(attendance)
          ),
        };
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    async createAttendance(
      _,
      { attendanceInput: { date, time, courseID } },
      context
    ) {
      const currUser = checkAuth(context);
      const { valid, errors } = validateAttendanceInput(date, time);
      try {
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }
        const attendance = new Attendance({
          date,
          time,
          course: courseID,
        });
        await attendance.save();

        const course = await Course.findOne({ shortID: courseID });
        if (!course) {
          throw new Error("Course does not exist.");
        }

        await Promise.all(course.enrolledStudents.map(async (studentID) => {
          const sendNotification = new Notification({
            receiver: studentID,
            title: `New Attendance Notification - Course ID: ${course.shortID}`,
            content: `Course owner: [${currUser.firstName} ${currUser.lastName}] had created an attendance in the course: ${course.name} (${course.code}-${course.session}).
            Enter room using URL: ${OfficialURL}/course/${course.shortID}/attendanceRoom/${attendance._id}`,
          });
          await sendNotification.save();
          Object.assign(course, {
            attendanceID: attendance.id,
            attendanceURL: `${OfficialURL}/course/${course.shortID}/attendanceRoom/${attendance._id}`,
          });

          const studentDoc = await Person.findById(studentID);
          //notify student through email
          await sendEmail(
            studentDoc.email,
            studentDoc.firstName,
            MAIL_TEMPLATE_TYPE.CreateAttendance,
            { owner: currUser, course: course }
          );
        }))

        return AttendancegqlParser(attendance);
      } catch (err) {
        throw err;
      }
    },

    async editAttendanceMode(_, { attendanceID, mode }, context) {
      const currUser = checkAuth(context);
      try {
        const attendance = await Attendance.findById(attendanceID);

        if (!attendance) {
          throw new Error("Edit a non existing attendance");
        }

        const course = await Course.findOne({ shortID: attendance.course });
        if (!course) {
          throw new Error("Course does not exist");
        }

        if (course.creator != currUser._id) {
          throw new Error("You are not the course owner");
        }

        await Attendance.findByIdAndUpdate(attendanceID, {
          $set: {
            mode,
          },
        });
        const editedAttendance = await Attendance.findById(attendanceID);

        return AttendancegqlParser(editedAttendance);
      } catch (err) {
        throw err;
      }
    },

    async editAttendanceOnOff(_, { attendanceID, isOn }, context) {
      const currUser = checkAuth(context);
      try {
        const attendance = await Attendance.findById(attendanceID);

        if (!attendance) {
          throw new Error("Edit a non existing attendance");
        }

        const course = await Course.findOne({ shortID: attendance.course });
        if (!course) {
          throw new Error("Course does not exist");
        }

        if (course.creator != currUser._id) {
          throw new Error("You are not the course owner");
        }

        await Attendance.findByIdAndUpdate(attendanceID, {
          $set: {
            isOn,
          },
        });
        const editedAttendance = await Attendance.findById(attendanceID);

        return AttendancegqlParser(editedAttendance);
      } catch (err) {
        throw err;
      }
    },

    async deleteAttendance(_, { attendanceID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const attendance2Delete = await Attendance.findById(attendanceID);

        if (!attendance2Delete) {
          errors.general = "Delete a non existing attendance";
          throw new UserInputError("Delete a non existing attendance", {
            errors,
          });
        }

        await Attendance.deleteOne(attendance2Delete);

        return AttendancegqlParser(attendance2Delete);
      } catch (err) {
        throw err;
      }
    },
  },
};
