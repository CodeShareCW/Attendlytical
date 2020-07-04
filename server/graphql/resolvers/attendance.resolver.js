const { UserInputError } = require("apollo-server");

const Attendance = require("../../models/attendance.model");
const Course = require("../../models/course.model");

const { AttendancegqlParser } = require("./merge");

const { validateAttendanceInput } = require("../../util/validators");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getAttendance(_, { attendanceID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const attendance = await Attendance.findById(attendanceID);
        if (!attendance) {
          errors.general = "Attendance ID do not exist";
          throw new UserInputError("Attendance ID do not exist", { errors });
        }
        return AttendancegqlParser(attendance);
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
    async getCourseAttendance(_, { courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const course = await Course.findById(courseID);

        if (!course) {
          errors.general = "Course do not exist";
          throw new UserInputError("Course do not exist", { errors });
        }

        const all_attendance_for_this_course = await Attendance.find({
          course: courseID,
        }).sort({ createdAt: -1 });
        return all_attendance_for_this_course.map((attendance) => {
          return AttendancegqlParser(attendance);
        });
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
    async getCoursesAttendance(_, __, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const courses = await Course.find({ creator: currUser.id });

        //TODO: BUG!! Give null items from the array
        return courses.map(async course => {
          const all_attendance_for_this_course = await Attendance.find({
            course: course.id
          }).sort({ createdAt: -1 });
          return all_attendance_for_this_course.map((attendance) => AttendancegqlParser(attendance)
          );
        });
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
  Mutation: {
    async createAttendance(
      _,
      { attendanceInput: { start, end, date, courseID } },
      context
    ) {
      const currUser = checkAuth(context);
      const { valid, errors } = validateAttendanceInput(start, end, date);
      try {
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }
        if (currUser.userLevel !== 1) {
          errors.general =
            "The user is not a lecturer but want to create attendance!";
          throw new UserInputError(
            "The user is not a lecturer but want to create attendance!",
            { errors }
          );
        }
        console.log("here");

        const attendance = new Attendance({
          start,
          end,
          date,
          course: courseID,
        });

        await attendance.save();

        return AttendancegqlParser(attendance);
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
    async deleteAttendance(_, { attendanceID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }
        if (currUser.userLevel !== 1) {
          errors.general =
            "The user is not a lecturer but want to delete attendance!";
          throw new UserInputError(
            "The user is not a lecturer but want to delete attendance!",
            { errors }
          );
        }

        const attendance2Delete = await Attendance.findById(attendanceID);

        if (!attendance2Delete) {
          errors.general = "Try to delete a non existing attendance";
          throw new UserInputError("Try to delete a non existing attendance", {
            errors,
          });
        }
        await Attendance.deleteOne(attendance2Delete);

        return "Delete Success";
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
};
