const FacePhoto = require("../../models/facePhoto.model");

module.exports = {
  Mutation: {
    async addFacePhoto(_, { faceDescriptor, data }, context) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        const facePhoto = new FacePhoto({
          creatorID: currUser.id,
          data,
          faceDescriptor
        });
        
        await facePhoto.save();
      } catch (err) {
        errors.general = err.message;
        throw new UserInputError(err.message, { errors });
      }
    },
  },
};
