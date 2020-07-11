const { UserInputError } = require("apollo-server");

const FacePhoto = require("../../models/facePhoto.model");
const checkAuth = require("../../util/check-auth");

const { FacePhotogqlParser } = require("./merge");

module.exports = {
  Mutation: {
    async addPhoto(_, { faceDescriptor, data }, context) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        const facePhoto = new FacePhoto({
          creator: currUser.id,
          data,
          faceDescriptor
        });
        
        await facePhoto.save();
        return FacePhotogqlParser(facePhoto);

      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
};
