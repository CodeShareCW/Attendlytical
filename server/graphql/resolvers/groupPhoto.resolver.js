const Attendance = require("../../models/attendance.model");
const GroupPhoto = require("../../models/groupPhoto.model");

module.exports = {
  Mutation: {
    async addGroupPhoto(_, { attendanceID, data }, context) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        const groupPhoto = new GroupPhoto({
          attendanceID,
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
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
};
