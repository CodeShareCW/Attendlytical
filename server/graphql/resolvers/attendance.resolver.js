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
    async getAllAttendance(_, __, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const createdAttendance_list = await Attendance.find({
          creator: currUser.id,
        }).sort({ createdAt: -1 });
        return createdAttendance_list.map((attendance) =>
          AttendancegqlParser(attendance)
        );
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

        const course = await Course.find({_id: courseID, creator: currUser.id});
        if (course.length===0) {
          errors.general = "Course do not exist or current user is not course owner";
          throw new UserInputError("Course do not exist or current user is not course owner", { errors });
        }
        console.log(course)
        
        const attendance = new Attendance({
          start,
          end,
          date,
          course: courseID,
          creator: currUser.id,
        });

        //Because the course give the array, we need to put index
        course[0].attendanceList.push(attendance);
        await course[0].save();
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
