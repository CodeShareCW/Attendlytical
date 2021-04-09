const { UserInputError } = require('apollo-server');
const Attendance = require('../../models/attendance.model');
const Course = require('../../models/course.model');

const {
  CoursegqlParser,
  AttendancegqlParser,
} = require('./merge');

const { validateAttendanceInput } = require('../../util/validators');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getAttendancesCount(_, __, context) {
      const currUser = checkAuth(context);
      try {
        let attendances;

        if (currUser.userLevel === 0) {
          attendances = await Attendance.find({ participants: currUser._id }, [
            '_id',
          ]);
        } else if (currUser.userLevel === 1) {
          attendances = await Attendance.find({ creator: currUser._id }, [
            '_id',
          ]);
        } else
          throw new Error(
            `Something wrong with your role index: ${currUser.userLevel}!`
          );

        return attendances.length;
      } catch (err) {
        throw err;
      }
    },
    async getAttendancesCountInCourse(_, { courseID }, context) {
      const currUser = checkAuth(context);
      try {
        const course = await Course.findOne({ shortID: courseID });
        if (!course) {
          throw new Error('Course do not exist', { errors });
        }

        if (
          course.creator != currUser._id &&
          !course.enrolledStudents.find((stud) => stud._id == currUser._id)
        ) {
          throw new Error(
            'Access forbidden. You are not the course owner or join this course.'
          );
        }
        let attendances;

        if (currUser.userLevel === 0) {
          attendances = await Attendance.find(
            { participants: currUser._id, course: course._id },
            ['id']
          );
        } else if (currUser.userLevel === 1) {
          attendances = await Attendance.find(
            { creator: currUser._id, course: course._id },
            ['id']
          );
        } else
          throw new Error(
            `Something wrong with your role index: ${currUser.userLevel}!`
          );

        return attendances.length;
      } catch (err) {
        throw err;
      }
    },

    async getAttendance(_, { attendanceID }, context) {
      const currUser = checkAuth(context);
      try {
        const attendance = await Attendance.findById(attendanceID);
        if (!attendance) {
          throw new Error('Attendance do not exist', { errors });
        }

        const course = await Course.findById(attendance.course);

        if (course.creator != currUser._id && !course.enrolledStudents.find(user=>user._id==currUser._id)) {
          throw new Error('Access forbidden. You are not the course owner or participants in this course.');
        }

        return AttendancegqlParser(attendance);
      } catch (err) {
        throw err;
      }
    },
    async getAttendances(_, { currPage, pageSize }, context) {
      const currUser = checkAuth(context);
      console.log(currPage, pageSize);
      try {
        let attendanceList = [];
        if (currUser.userLevel === 0) {
          attendanceList = await Attendance.find({
            participants: currUser._id,
          })
            .skip((currPage - 1) * pageSize)
            .limit(pageSize)
            .sort({ _id: -1 });
        } else if (currUser.userLevel === 1) {
          attendanceList = await Attendance.find({
            creator: currUser._id,
          })
            .skip((currPage - 1) * pageSize)
            .limit(pageSize)
            .sort({ _id: -1 });
        } else {
          throw new Error('Something wrong');
        }

        return attendanceList.map((attendance) =>
          AttendancegqlParser(attendance)
        );
      } catch (err) {
        throw err;
      }
    },
    async getAttendancesInCourse(_, { courseID, currPage, pageSize }, context) {
      const currUser = checkAuth(context);
      try {
        const course = await Course.findOne({ shortID: courseID });

        if (!course) {
          throw new Error('Course do not exist', { errors });
        }

        console.log(currPage);
        if (
          course.creator != currUser._id &&
          !course.enrolledStudents.find((stud) => stud._id == currUser._id)
        ) {
          throw new Error(
            'Access forbidden. You are not the course owner or join this course.'
          );
        }

        let createdAttendance_list = [];
        if (currUser.userLevel === 0) {
          createdAttendance_list = await Attendance.find({
            participants: currUser._id,
            course: course._id,
          })
            .skip((currPage - 1) * pageSize)
            .limit(pageSize)
            .sort({ _id: -1 });
        } else if (currUser.userLevel === 1) {
          createdAttendance_list = await Attendance.find({
            creator: currUser._id,
            course: course._id,
          })
            .skip((currPage - 1) * pageSize)
            .limit(pageSize)
            .sort({ _id: -1 });
        } else {
          throw new Error('Something wrong');
        }

        return {
          course: CoursegqlParser(course),
          attendances: createdAttendance_list.map((attendance) =>
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
      {
        attendanceInput: {
          date,
          time,
          courseID,
          participants,
          absentees,
          attendees,
        },
      },
      context
    ) {
      const currUser = checkAuth(context);
      const { valid, errors } = validateAttendanceInput(date, time);
      try {
        if (!valid) {
          throw new UserInputError('Errors', { errors });
        }
        const attendance = new Attendance({
          date,
          time,
          course: courseID,
          creator: currUser._id,
          participants,
          absentees,
          attendees,
        });

        await attendance.save();
        return AttendancegqlParser(attendance);
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
          errors.general = 'Try to delete a non existing attendance';
          throw new UserInputError('Try to delete a non existing attendance', {
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
