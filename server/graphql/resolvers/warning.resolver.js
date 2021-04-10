const Warning = require("../../models/warning.model");
const Person = require("../../models/person.model");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getWarningCount(_, {courseID}, context) {
      try {
        const currUser=checkAuth(context)
        const warningCount=await Warning.findOne({course: courseID, student: currUser._id})

        if (!warningCount) return 0;

        return warningCount.count;
    } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
   
  }
};
