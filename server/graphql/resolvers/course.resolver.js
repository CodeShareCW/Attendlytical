const { UserInputError } = require("apollo-server");

const Course = require("../../models/course.model");
const Person = require("../../models/person.model");
const PendingEnrolledCourse = require("../../models/pendingEnrolledCourse.model");
const Notification = require("../../models/notification.model");

const { validateCourseInput } = require("../../util/validators");

const { CoursegqlParser } = require("./merge");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getCourses(_, __, context) {
      const currUser = checkAuth(context);
      try {
        const course2enrol = await Course.find({
          enrolledStudents: currUser.id,
        }).sort({ createdAt: -1 });
        return course2enrol.map((course) => {
          return CoursegqlParser(course);
        });
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
    async getCourse(_, { courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const course = await Course.findById(courseID);
        if (!course) {
          errors.general = "Course do not exist";
          throw new UserInputError("Course do not exist", { errors });
        }

        const student = course.enrolledStudents.find((s) => s == currUser.id);
        if (!student) {
          errors.general = "Student do not enrol this course";
          throw new UserInputError("Student do not enrol this course", {
            errors,
          });
        }

        return CoursegqlParser(course);
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
  Mutation: {
    /*
        Lecturer
    */
    async createCourse(_, { courseInput: { code, name, session } }, context) {
      const currUser = checkAuth(context);

      const { valid, errors } = validateCourseInput(code, name, session);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      try {
        if (currUser.userLevel !== 1) {
          errors.general =
            "The user is not a lecturer but want to create course!";
          throw new UserInputError(
            "The user is not a lecturer but want to create course!",
            { errors }
          );
        }

        const newCourse = new Course({
          creator: currUser.id,
          code,
          name,
          session,
        });

        await newCourse.save();
        return CoursegqlParser(newCourse);
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },

    async deleteCourse(_, { courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel !== 1) {
          errors.general =
            "The user is not a lecturer but want to delete course!";
          throw new UserInputError(
            "The user is not a lecturer but want to delete course!",
            { errors }
          );
        }

        const course2Delete = await Course.findById(courseID);

        if (!course2Delete) {
          errors.general = "Try to delete a non existing course";
          throw new UserInputError("Try to delete a non existing course", {
            errors,
          });
        }

        await Course.deleteOne(course2Delete);

        //TODO: Notification to student who enrol to this

        return CoursegqlParser(course2Delete);
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },

    async approveEnrolment(_, { enrolmentID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel !== 1) {
          errors.general =
            "The user is not a lecturer but want to approve course enrolment";
          throw new UserInputError(
            "The user is not a lecturer but want to approve course enrolment",
            { errors }
          );
        }

        const pending = await PendingEnrolledCourse.findById(enrolmentID);

        if (!pending) {
          errors.general = "The enrolment do not exist";
          throw new UserInputError("The enrolment do not exist", { errors });
        }

        const course = await Course.findById(pending.course);

        if (!course) {
          errors.general = "The course do not exist";
          throw new UserInputError("The course do not exist", { errors });
        }

        if (course.creator != currUser.id) {
          errors.general = "User is not the course owner";
          throw new UserInputError("User is not the course owner", { errors });
        }

        const course2enrol = await Course.findById(pending.course);

        if (!course2enrol) {
          errors.general = "Course do not exist";
          throw new UserInputError("Course do not exist", { errors });
        }

        const owner = await Person.findById(course.creator);

        if (!owner) {
          errors.general = "Course owner do not exist";
          throw new UserInputError("Course owner do not exist", { errors });
        }
        //notify student
        notification = new Notification({
          receiver: pending.student,
          title: `Enrolment Status: Approved`,
          content: `Lecturer: ${owner.firstName} ${owner.lastName} had approved your enrolment to course: ${course.name} (${course.code}-${course.session})`,
        });

        await notification.save();

        //remove the pending
        await pending.deleteOne(pending);

        course2enrol.enrolledStudents.push(pending.student);
        await course2enrol.save();

        return "Approve Success!";
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },

    async rejectEnrolment(_, { enrolmentID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel !== 1) {
          errors.general =
            "The user is not a lecturer but want to reject course enrolment";
          throw new UserInputError(
            "The user is not a lecturer but want to reject course enrolment",
            { errors }
          );
        }

        const pending = await PendingEnrolledCourse.findById(enrolmentID);

        if (!pending) {
          errors.general = "The enrolment do not exist";
          throw new UserInputError("The enrolment do not exist", { errors });
        }

        const course = await Course.findById(pending.course);

        if (!course) {
          errors.general = "The course do not exist";
          throw new UserInputError("The course do not exist", { errors });
        }

        if (course.creator != currUser.id) {
          errors.general = "User is not the course owner";
          throw new UserInputError("User is not the course owner", { errors });
        }

        const course2enrol = await Course.findById(pending.course);

        if (!course2enrol) {
          errors.general = "Course do not exist";
          throw new UserInputError("Course do not exist", { errors });
        }

        const owner = await Person.findById(course.creator);

        if (!owner) {
          errors.general = "Course owner do not exist";
          throw new UserInputError("Course owner do not exist", { errors });
        }
        //notify student
        notification = new Notification({
          receiver: pending.student,
          title: `Enrolment Status: Rejected`,
          content: `Lecturer: ${owner.firstName} ${owner.lastName} had rejected your enrolment to course: ${course.name} (${course.code}-${course.session})`,
        });

        await notification.save();

        //remove the pending
        await pending.deleteOne(pending);

        course2enrol.enrolledStudents.push(pending.student);
        await course2enrol.save();

        return "Approve Success!";
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
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
          errors.general =
            "The user is not a student but want to enrol course!";
          throw new UserInputError(
            "The user is not a student but want to enrol course!",
            { errors }
          );
        }

        const course2enrol = await Course.findById(courseID);

        if (!course2enrol) {
          errors.general = "Course do not exist but student wish to enrol!";
          throw new UserInputError(
            "Course do not exist but student wish to enrol!",
            { errors }
          );
        }

        const student = course2enrol.enrolledStudents.find(
          (s) => s == currUser.id
        );

        if (student) {
          errors.general = "Student already enrolled!";
          throw new UserInputError("Student already enrol the course");
        }

        //just pending the course
        const pending = new PendingEnrolledCourse({
          student: currUser.id,
          course: courseID,
        });

        await pending.save();

        const owner = await Person.findById(course2enrol.creator);

        if (!owner) {
          errors.general = "Course owner do not exist";
          throw new UserInputError("Course owner do not exist", { errors });
        }

        //notify lecturer
        notification = new Notification({
          receiver: owner.id,
          title: `Enrolment Status: Pending`,
          content: `Your enrolment to course: ${course2enrol.name} (${course2enrol.code}-${course2enrol.session}) had been submitted for approval.`,
        });

        await notification.save();

        return CoursegqlParser(course2enrol);
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
    async unEnrolCourse(_, { courseID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        if (currUser.userLevel !== 0) {
          errors.general =
            "The user is not a student but want to unenrol course!";
          throw new UserInputError(
            "The user is not a student but want to unenrol course!",
            { errors }
          );
        }

        const course2unenrol = await Course.findById(courseID);
        if (!course2unenrol) {
          errors.general = "Course not exist but student wish to unenrol!";
          throw new UserInputError(
            "Course not exist but student wish to unenrol!",
            { errors }
          );
        }
        const student = course2unenrol.enrolledStudents.find(
          (s) => s == currUser.id
        );

        if (!student) {
          errors.general = "Student do not enrol the course";
          throw new UserInputError("Student do not enrol the course", {
            errors,
          });
        }

        await Course.findByIdAndUpdate(
          course2unenrol.id,
          { $pull: { enrolledStudents: currUser.id } },
          { safe: true, upsert: true }
        );

        //TODO: Notification to lecturer for approval
        return CoursegqlParser(course2enrol);
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
};
