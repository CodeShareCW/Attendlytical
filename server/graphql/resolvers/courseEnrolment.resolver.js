const { UserInputError } = require("apollo-server");
const PendingEnrolledCourse = require("../../models/pendingEnrolledCourse.model");
const Course = require("../../models/course.model");
const Person = require("../../models/person.model");
const Notification = require("../../models/notification.model");

const { PendingEnrolledCoursesgqlParser } = require("./merge");

const checkAuth = require("../../util/check-auth");

const { sendEmail } = require("../../util/mail");

const { MAIL_TEMPLATE_TYPE } = require("../../globalData");

module.exports = {
  Query: {
    async getPendingEnrolledCourses(_, { cursor, limit }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel === 0) {
          let enrolments;
          if (!cursor) {
            enrolments = await PendingEnrolledCourse.find({
              student: currUser._id,
            })
              .limit(limit)
              .sort({ _id: -1 });
          } else {
            enrolments = await PendingEnrolledCourse.find({
              student: currUser._id,
              _id: { $lt: cursor },
            })
              .limit(limit)
              .sort({ _id: -1 });
          }

          let hasNextPage = true;

          if (enrolments.length < limit) hasNextPage = false;

          return PendingEnrolledCoursesgqlParser(enrolments, hasNextPage);
        } else if (currUser.userLevel === 1) {
          let enrolments;
          if (!cursor) {
            enrolments = await PendingEnrolledCourse.find({
              courseOwner: currUser._id,
            })
              .limit(limit)
              .sort({ _id: -1 });
          } else {
            enrolments = await PendingEnrolledCourse.find({
              courseOwner: currUser._id,
              _id: { $lt: cursor },
            })
              .limit(limit)
              .sort({ _id: -1 });
          }
          let hasNextPage = true;
          if (enrolments.length < limit) hasNextPage = false;

          return PendingEnrolledCoursesgqlParser(enrolments, hasNextPage);
        } else {
          errors.general = "Something wrong!";
          throw new UserInputError("Something wrong!", { errors });
        }
      } catch (err) {
        throw err;
      }
    },
    async getEnrolRequestCount(_, __, context) {
      const currUser = checkAuth(context);
      try {
        const enrolments = await PendingEnrolledCourse.find(
          {
            courseOwner: currUser._id,
            status: "pending",
          },
          ["id"]
        );
        return enrolments.length;
      } catch (err) {
        throw err;
      }
    },
    async getEnrolPendingCount(_, __, context) {
      const currUser = checkAuth(context);
      try {
        const enrolments = await PendingEnrolledCourse.find(
          {
            student: currUser._id,
            status: "pending",
          },
          ["id"]
        );
        return enrolments.length;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    async approveEnrolment(_, { enrolmentID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel !== 1) {
          errors.general =
            "You are not a lecturer but want to approve course enrolment";
          throw new UserInputError(
            "You are not a lecturer but want to approve course enrolment",
            { errors }
          );
        }

        const pending = await PendingEnrolledCourse.findById(enrolmentID);

        if (!pending) {
          errors.general = "The enrolment do not exist";
          throw new UserInputError("The enrolment do not exist", { errors });
        }

        if (pending.status !== "pending") {
          errors.general = `You already ${pending.status} the enrolment`;
          throw new UserInputError(
            `You already ${pending.status} the enrolment`,
            { errors }
          );
        }

        const course = await Course.findById(pending.course);

        if (!course) {
          errors.general = "The course do not exist";
          throw new UserInputError("The course do not exist", { errors });
        }

        if (course.creator != currUser._id) {
          errors.general = "You are not the course owner and cannot approve";
          throw new UserInputError(
            "You are not the course owner and cannot approve",
            { errors }
          );
        }

        course.enrolledStudents.push(pending.student);
        await course.save();

        const student = await Person.findById(pending.student);

        //delete pending
        await PendingEnrolledCourse.findByIdAndDelete(enrolmentID);

        //notify student
        notification = new Notification({
          receiver: pending.student,
          title: `Enrolment Status: Approved (CourseID: ${course.shortID})`,
          content: `Course owner: [${currUser.firstName} ${currUser.lastName}] had approved your enrolment to Course: [${course.name} (${course.code}-${course.session})]`,
        });

        //notify student through email
        sendEmail(
          student.email,
          student.firstName,
          MAIL_TEMPLATE_TYPE.ApproveEnrolment,
          { owner: currUser, course: course }
        );

        await notification.save();

        return "Approve Success!";
      } catch (err) {
        throw err;
      }
    },

    async rejectEnrolment(_, { enrolmentID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel !== 1) {
          errors.general =
            "You are not a lecturer but want to reject course enrolment";
          throw new UserInputError(
            "You are not a lecturer but want to reject course enrolment",
            { errors }
          );
        }

        const pending = await PendingEnrolledCourse.findById(enrolmentID);

        if (!pending) {
          errors.general = "The enrolment do not exist";
          throw new UserInputError("The enrolment do not exist", { errors });
        }

        if (pending.status !== "pending") {
          errors.general = `You already ${pending.status} the enrolment`;
          throw new UserInputError(
            `You already ${pending.status} the enrolment`,
            { errors }
          );
        }

        const course = await Course.findById(pending.course);

        if (!course) {
          errors.general = "The course do not exist";
          throw new UserInputError("The course do not exist", { errors });
        }

        if (course.creator != currUser._id) {
          errors.general = "User is not the course owner";
          throw new UserInputError("User is not the course owner", { errors });
        }

        const student = await Person.findById(pending.student);

        //delete pending
        await PendingEnrolledCourse.findByIdAndDelete(enrolmentID);

        //notify student
        notification = new Notification({
          receiver: pending.student,
          title: `Enrolment Status: Rejected (CourseID: ${course.shortID})`,
          content: `Course owner: [${currUser.firstName} ${currUser.lastName}] had rejected your enrolment to course: ${course.name} (${course.code}-${course.session})`,
        });

        await notification.save();

        return "Reject Success!";
      } catch (err) {
        throw err;
      }
    },
  },
};
