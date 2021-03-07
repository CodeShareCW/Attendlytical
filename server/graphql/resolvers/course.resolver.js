var shortid = require('shortid');
const { UserInputError } = require('apollo-server');
const Attendance = require('../../models/attendance.model');

const Expression = require('../../models/expression.model');
const Course = require('../../models/course.model');
const Person = require('../../models/person.model');
const PendingEnrolledCourse = require('../../models/pendingEnrolledCourse.model');
const Notification = require('../../models/notification.model');
const Warning = require('../../models/warning.model');

const { validateCourseInput } = require('../../util/validators');

const {
  ParticipantsgqlParser,
  PersongqlParser,
  CoursegqlParser,
  CoursesgqlParser,
  PendingEnrolledCoursegqlParser,
} = require('./merge');

const checkAuth = require('../../util/check-auth');

const { sendEmail } = require('../../util/mail');

//global mail type naming
const { MAIL_TEMPLATE_TYPE } = require('../../globalData');

module.exports = {
  Query: {
    async getEnrolledCourses(_, { cursor, limit }, context) {
      const currUser = checkAuth(context);
      try {
        let coursesEnrolled;
        if (!cursor) {
          coursesEnrolled = await Course.find({
            enrolledStudents: currUser._id,
          })
            .limit(limit)
            .sort({ _id: -1 });
        } else {
          coursesEnrolled = await Course.find({
            enrolledStudents: currUser._id,
            _id: { $lt: cursor },
          })
            .limit(limit)
            .sort({ _id: -1 });
        }
        let hasNextPage = true;

        if (coursesEnrolled.length < limit) hasNextPage = false;

        return CoursesgqlParser(coursesEnrolled, hasNextPage);
      } catch (err) {
        throw err;
      }
    },

    async getAllCreatedCourses(_, __, context) {
      const currUser = checkAuth(context);
      try {
        const courseCreated = await Course.find({
          creator: currUser._id,
        }).sort({ _id: -1 });

        return courseCreated.map((course) => CoursegqlParser(course));
      } catch (err) {
        throw err;
      }
    },
    async getCreatedCourses(_, { cursor, limit }, context) {
      const currUser = checkAuth(context);
      try {
        let courseCreated;
        if (!cursor) {
          courseCreated = await Course.find({
            creator: currUser._id,
          })
            .limit(limit)
            .sort({ _id: -1 });
        } else {
          courseCreated = await Course.find({
            creator: currUser._id,
            _id: { $lt: cursor },
          })
            .limit(limit)
            .sort({ _id: -1 });
        }
        let hasNextPage = true;

        if (courseCreated.length < limit) hasNextPage = false;

        return CoursesgqlParser(courseCreated, hasNextPage);
      } catch (err) {
        throw err;
      }
    },
    async getCreatedCoursesCount(_, __, context) {
      const currUser = checkAuth(context);
      try {
        const courseCreated = await Course.find(
          {
            creator: currUser._id,
          },
          ['id']
        );
        return courseCreated.length;
      } catch (err) {
        throw err;
      }
    },
    async getEnrolledCoursesCount(_, __, context) {
      const currUser = checkAuth(context);
      try {
        const courseEnrolled = await Course.find(
          {
            enrolledStudents: currUser._id,
          },
          ['id']
        );
        return courseEnrolled.length;
      } catch (err) {
        throw err;
      }
    },
    async getCourseAndParticipants(_, { courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const course = await Course.findOne({ shortID: courseID });
        if (!course) {
          errors.general = 'Course do not exist';
          throw new UserInputError('Course do not exist', { errors });
        }
        if (currUser.userLevel === 1) {
          if (course.creator != currUser._id) {
            errors.general = 'Access forbidden. You do not own this course.';
            throw new UserInputError(
              'Access forbidden. You do not own this course.',
              {
                errors,
              }
            );
          }
        } else {
          const student = course.enrolledStudents.find(
            (s) => s == currUser._id
          );
          if (!student) {
            errors.general =
              'Access forbidden. You do not enrol to this course.';
            throw new UserInputError(
              'Access forbidden. You do not enrol to this course.',
              {
                errors,
              }
            );
          }
        }

        const courseAttendance = await Attendance.find(
          {
            course: course._id,
          },
          ['_id']
        );

        return {
          course: CoursegqlParser(course),
          attendanceCount: courseAttendance.length,
          participants: ParticipantsgqlParser(course.enrolledStudents, course),
        };
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    //TODO:/*Test*/
    async testingCreateCourse(_, __, context) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        if (currUser.userLevel !== 1) {
          errors.general =
            'The user is not a lecturer but want to create course!';
          throw new UserInputError(
            'The user is not a lecturer but want to create course!',
            { errors }
          );
        }
        for (i = 0; i < 50; i++) {
          let existingShortID;
          let id;
          do {
            id = shortid.generate();
            existingShortID = await Course.find({ shortID: id });
          } while (existingShortID.length > 0);
          const newCourse = new Course({
            shortID: 'Course_' + id,
            creator: currUser._id,
            code: i + ' SCSV2013',
            name: i + ' Graphic',
            session: '20192020-01',
          });
          await newCourse.save();
        }
        return 'Create 50 Course...';
      } catch (err) {
        throw err;
      }
    },
    //TODO:/*Test*/
    async testingDeleteAllCourse(_, __, context) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        if (currUser.userLevel !== 1) {
          errors.general =
            'The user is not a lecturer but want to delete course!';
          throw new UserInputError(
            'The user is not a lecturer but want to delete course!',
            { errors }
          );
        }

        await Course.deleteMany({ create: currUser._id });

        return 'CDelete 50 Course...';
      } catch (err) {
        throw err;
      }
    },
    /*
        Course owner:
    */
    async createCourse(_, { courseInput: { code, name, session } }, context) {
      const currUser = checkAuth(context);

      const { valid, errors } = validateCourseInput(code, name, session);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      try {
        if (currUser.userLevel !== 1) {
          errors.general = 'You are not a lecturer but want to create course!';
          throw new UserInputError(
            'You are not a lecturer but want to create course!',
            { errors }
          );
        }

        let existingShortID;
        let id;
        do {
          id = shortid.generate();
          existingShortID = await Course.find({ shortID: id });
        } while (existingShortID.length > 0);

        const newCourse = new Course({
          creator: currUser._id,
          shortID: id,
          code,
          name,
          session,
        });

        await newCourse.save();

        return CoursegqlParser(newCourse);
      } catch (err) {
        throw err;
      }
    },

    async deleteCourse(_, { courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel !== 1) {
          errors.general = 'You are not a lecturer but want to delete course!';
          throw new UserInputError(
            'You are not a lecturer but want to delete course!',
            { errors }
          );
        }

        const course2Delete = await Course.findById(courseID);

        if (!course2Delete) {
          errors.general = 'Try to delete a non existing course';
          throw new UserInputError('Try to delete a non existing course', {
            errors,
          });
        }
        await Course.deleteOne(course2Delete);

        //also delete the enrolment
        const enrolments = await PendingEnrolledCourse.find({
          course: courseID,
        });
        enrolments.map(async (enrolment) => {
          //notify the student who enrol still pending in this course
          const sendNotification = new Notification({
            receiver: enrolment.student,
            title: `Course Deleted Notification - Course ID: ${course2Delete.shortID}`,
            content: `Course owner: [${currUser.firstName} ${currUser.lastName}] had deleted the course: ${course2Delete.name} (${course2Delete.code}-${course2Delete.session}),
             hence deleted from your enrolment pending list`,
          });
          await sendNotification.save();

          const studentDoc = await Person.findById(enrolment.student);
          //notify student through email
          await sendEmail(
            studentDoc.email,
            studentDoc.firstName,
            MAIL_TEMPLATE_TYPE.DeletePendingCourse,
            { owner: currUser, course: course2Delete }
          );
        });

        await PendingEnrolledCourse.deleteMany({ course: courseID });

        //delete the pending course

        //delete all related attendance
        const attendanceList = await Attendance.find({ course: courseID });

        attendanceList.map(async (attendance) => {
          //delete all related expression
          await Expression.deleteMany({ attendance: attendance._id });
        });

        await Attendance.deleteMany({ course: courseID });

        //TODO: Notification to student who enrol to this
        course2Delete.enrolledStudents.map(async (stud) => {
          //delete all related warning
          await Warning.deleteOne({ student: stud, course: courseID });

          notification = new Notification({
            receiver: stud,
            title: `Course Deleted Notification - Course ID: ${course2Delete.shortID}`,
            content: `Course owner: [${currUser.firstName} ${currUser.lastName}] had deleted the course: ${course2Delete.name} (${course2Delete.code}-${course2Delete.session})`,
          });

          await notification.save();

          const studentDoc = await Person.findById(stud);

          //notify student through email
          await sendEmail(
            studentDoc.email,
            studentDoc.firstName,
            MAIL_TEMPLATE_TYPE.DeleteCourse,
            { owner: currUser, course: course2Delete }
          );
        });
        return CoursegqlParser(course2Delete);
      } catch (err) {
        throw err;
      }
    },

    /*
        Student
    */
    async enrolCourse(_, { courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel !== 0) {
          errors.general = 'You are not a student but want to enrol course!';
          throw new UserInputError(
            'You are not a student but want to enrol course!',
            { errors }
          );
        }

        const course2enrol = await Course.findOne({ shortID: courseID });

        if (!course2enrol) {
          errors.general = 'Course do not exist but you wish to enrol!';
          throw new UserInputError(
            'Course do not exist but you wish to enrol!',
            { errors }
          );
        }

        const checkPending = await PendingEnrolledCourse.find({
          course: course2enrol.id,
          student: currUser._id,
          status: 'pending',
        });

        if (checkPending.length > 0) {
          errors.general = `Course enrolment: ${course2enrol.name} (${course2enrol.code}-${course2enrol.session}) is pending!`;
          throw new UserInputError(
            `Course enrolment: ${course2enrol.name} (${course2enrol.code}-${course2enrol.session}) is pending!`,
            { errors }
          );
        }

        if (course2enrol.enrolledStudents.length > 0) {
          const student = course2enrol.enrolledStudents.find(
            (s) => s == currUser._id
          );

          if (student) {
            errors.general = 'You already enrolled!';
            throw new UserInputError('You already enrol the course');
          }
        }
        //just pending the course
        const pending = new PendingEnrolledCourse({
          student: currUser._id,
          course: course2enrol.id,
          courseOwner: course2enrol.creator,
        });

        await pending.save();

        const owner = await Person.findById(course2enrol.creator);

        if (!owner) {
          errors.general = 'Course owner do not exist';
          throw new UserInputError('Course owner do not exist', { errors });
        }

        //notify lecturer
        notification = new Notification({
          receiver: owner.id,
          title: `Enrolment Request - Course ID: ${courseID}`,
          content: `Student: [${currUser.firstName} ${currUser.lastName}(${currUser.cardID})] requested to enrol course: ${course2enrol.name} (${course2enrol.code}-${course2enrol.session}).`,
        });

        await notification.save();

        //notify lecturer through email
        await sendEmail(
          owner.email,
          owner.firstName,
          MAIL_TEMPLATE_TYPE.EnrolRequest,
          { student: currUser, course: course2enrol }
        );

        return PendingEnrolledCoursegqlParser(pending);
      } catch (err) {
        throw err;
      }
    },
    async withdrawCourse(_, { courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel !== 0) {
          errors.general = 'You are not a student but want to unenrol course!';
          throw new UserInputError(
            'You are not a student but want to unenrol course!',
            { errors }
          );
        }

        const course2withdraw = await Course.findById(courseID);
        if (!course2withdraw) {
          errors.general = 'Course not exist but student wish to withdraw!';
          throw new UserInputError(
            'Course not exist but student wish to withdraw!',
            { errors }
          );
        }
        const student = course2withdraw.enrolledStudents.find(
          (s) => s == currUser._id
        );

        if (!student) {
          errors.general = 'Student do not enrol the course';
          throw new UserInputError('Student do not enrol the course', {
            errors,
          });
        }

        await Course.findByIdAndUpdate(
          course2withdraw.id,
          { $pull: { enrolledStudents: currUser._id } },
          { safe: true, upsert: true }
        );


        const owner = await Person.findById(course2withdraw.creator);

        if (!owner) {
          errors.general = 'Course owner do not exist';
          throw new UserInputError('Course owner do not exist', { errors });
        }

        await Warning.deleteOne({ student: currUser._id, course: courseID });

        //notify lecturer
        notification = new Notification({
          receiver: owner.id,
          title: `Course Withdrawal - Course ID: ${course2withdraw.shortID}`,
          content: `Student: [${currUser.firstName} ${currUser.lastName}(${currUser.cardID})] had withdrawn the course: ${course2withdraw.name} (${course2withdraw.code}-${course2withdraw.session}).`,
        });

        //notify lecturer through email
        await sendEmail(
          owner.email,
          owner.firstName,
          MAIL_TEMPLATE_TYPE.WithdrawCourse,
          { student: currUser, course: course2withdraw }
        );

        await notification.save();

        return 'Withdraw success!';
      } catch (err) {
        throw err;
      }
    },

    async addParticipant(_, { email, courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel !== 1) {
          errors.general = 'You are not a lecturer';
          throw new UserInputError('You are not a lecturer', { errors });
        }
        const addedPerson = await Person.findOne({ email });
        const course = await Course.findOne({ shortID: courseID });

        if (!addedPerson) {
          errors.general = 'Student do not exist';
          throw new UserInputError('Student do not exist', { errors });
        }

        if (addedPerson.userLevel !== 0) {
          errors.general =
            'Added person is a lecturer and is not allowed to join any course';
          throw new UserInputError(
            'Added person is a lecturer and is not allowed to join any course',
            { errors }
          );
        }

        if (!course) {
          errors.general = 'Course do not exist';
          throw new UserInputError('Course do not exist', { errors });
        }

        const checkPending = await PendingEnrolledCourse.find({
          course: course.id,
          student: addedPerson.id,
        });

        if (checkPending.length > 0) {
          errors.general = `The student you added have this course in pending, check your notifications`;
          throw new UserInputError(
            `The student you added have this course in pending, check your notifications`,
            { errors }
          );
        }

        if (course.enrolledStudents.length > 0) {
          const student = course.enrolledStudents.find(
            (s) => s == addedPerson.id
          );

          if (student) {
            errors.general = 'Student already enrolled the course!';
            throw new UserInputError('Student already enrolled the course', {
              errors,
            });
          }
        }

        course.enrolledStudents.push(addedPerson.id);
        await course.save();

        const notification = new Notification({
          receiver: addedPerson.id,
          title: `Added Notification - Course ID: ${courseID}`,
          content: `Course owner: [${currUser.firstName} ${currUser.lastName}] have added you in the course: ${course.name} (${course.code}-${course.session})`,
        });

        await notification.save();

        return PersongqlParser(addedPerson);
      } catch (err) {
        throw err;
      }
    },

    async kickParticipant(_, { participantID, courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const course = await Course.findOne({ shortID: courseID });
        const kickedPerson = await Person.findById(participantID);

        if (!course) {
          errors.general = 'Course do not exist';
          throw new UserInputError('Course do not exist', { errors });
        }

        if (course.creator != currUser._id) {
          errors.general = 'You cannot kick the participant';
          throw new Error('You cannot kick the participant', { errors });
        }

        if (!kickedPerson) {
          errors.general = 'Participant do not exist';
          throw new UserInputError('Participant do not exist', { errors });
        }

        const checkStudentExist = course.enrolledStudents.find(
          (id) => id == participantID
        );
        if (!checkStudentExist) {
          errors.general = 'Participant do not exist in this course';
          throw new UserInputError('Participant do not exist in this course', {
            errors,
          });
        }

        await Course.findOneAndUpdate(
          { shortID: courseID },
          { $pull: { enrolledStudents: participantID } },
          { safe: true, upsert: true }
        );

        await Warning.deleteOne({ student: participantID, course: course.id });

        const notification = new Notification({
          receiver: participantID,
          title: `Kicked Out Notification - Course ID: ${courseID}`,
          content: `Course owner: [${currUser.firstName} ${currUser.lastName}] have kicked you out from the course: ${course.name} (${course.code}-${course.session})`,
        });

        await notification.save();

        //notify student through email
        await sendEmail(
          kickedPerson.email,
          kickedPerson.firstName,
          MAIL_TEMPLATE_TYPE.KickStudent,
          { owner: currUser, course: course }
        );

        return 'Kick Success!';
      } catch (err) {
        throw err;
      }
    },

    async warnParticipant(_, { participantID, courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const course = await Course.findOne({ shortID: courseID });
        const warnedPerson = await Person.findById(participantID);

        if (!course) {
          errors.general = 'Course do not exist';
          throw new UserInputError('Course do not exist', { errors });
        }

        if (course.creator != currUser._id) {
          errors.general = 'You cannot warn the participant';
          throw new Error('You cannot warn the participant', { errors });
        }

        if (!warnedPerson) {
          errors.general = 'Participant do not exist';
          throw new UserInputError('Participant do not exist', { errors });
        }

        const checkStudentExist = course.enrolledStudents.find(
          (id) => id == participantID
        );
        if (!checkStudentExist) {
          errors.general = 'Participant do not exist in this course';
          throw new UserInputError('Participant do not exist in this course', {
            errors,
          });
        }

        const warning = await Warning.findOne({
          student: participantID,
          course: course.id,
        });

        if (!warning) {
          const newWarning = new Warning({
            student: participantID,
            course: course.id,
          });
          await newWarning.save();

          const notification = new Notification({
            receiver: participantID,
            title: `Attendance Warning (limit time) Notification - Course ID: ${courseID}`,
            content: `Course owner: [${currUser.firstName} ${currUser.lastName}] have warned your low attendance in the course: ${course.name} (${course.code}-${course.session})`,
          });
          await notification.save();
        } else {
          warning.count += 1;
          await warning.save();
          const notification = new Notification({
            receiver: participantID,
            title: `Attendance Warning (${warning.count} times) Notification - Course ID: ${courseID}`,
            content: `Course owner: [${currUser.firstName} ${currUser.lastName}] have warned your low attendance in the course: ${course.name} (${course.code}-${course.session})`,
          });
          await notification.save();
        }

        //notify student through email
        await sendEmail(
          warnedPerson.email,
          warnedPerson.firstName,
          MAIL_TEMPLATE_TYPE.WarnStudent,
          { owner: currUser, course: course }
        );

        return 'Warn Success!';
      } catch (err) {
        throw err;
      }
    },
  },
};
