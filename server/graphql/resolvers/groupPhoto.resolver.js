const { UserInputError } = require("apollo-server");

const Attendance = require("../../models/attendance.model");
const GroupPhoto = require("../../models/groupPhoto.model");
const checkAuth = require("../../util/check-auth");

const { GroupPhotogqlParser } = require("./merge");

module.exports = {
  Mutation: {
    async addGroupPhoto(_, { attendanceID, data }, context) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        const groupPhoto = new GroupPhoto({
          attendance: attendanceID,
          data,
        });
        const attendance = await Attendance.findByID(attendanceID);
        if (!attendance) {
          errors.general = "Attendance do not exist";
          throw new UserInputError("Attendance do not exist", {
            errors,
          });
        }
        await groupPhoto.save();

        return GroupPhotogqlParser(groupPhoto);
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
};
