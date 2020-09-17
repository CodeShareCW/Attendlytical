const { UserInputError } = require("apollo-server");

const FacePhoto = require("../../models/facePhoto.model");
const checkAuth = require("../../util/check-auth");
const { cloudinary } = require("../../util/cloudinary");

const { FacePhotogqlParser, FacePhotosgqlParser } = require("./merge");

module.exports = {
  Query: {
    async getFacePhotosCount(_, __, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const existingPhotos = await FacePhoto.find(
          {
            creator: currUser._id,
          },
          ["id"]
        );
        return existingPhotos.length;
      } catch (err) {
        throw err;
      }
    },
    async getFacePhotos(_, { cursor, limit }, context) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        let photos;
        if (!cursor) {
          photos = await FacePhoto.find({
            creator: currUser._id,
          })
            .limit(limit)
            .sort({ _id: -1 });
        } else {
          photos = await FacePhoto.find({
            creator: currUser._id,
            _id: { $lt: cursor },
          })
            .limit(limit)
            .sort({ _id: -1 });
        }
        let hasNextPage = true;

        if (photos.length < limit) hasNextPage = false;

        return FacePhotosgqlParser(photos, hasNextPage);
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    async addFacePhoto(_, { photoData, faceDescriptor, expression }, context) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        const uploadedFacePhotos = await FacePhoto.find({
          creator: currUser._id,
        });
        const count = uploadedFacePhotos.length;

        if (!uploadedFacePhotos) throw new UserInputError("Upload error");

        const uploadedResponse = await cloudinary.uploader.upload(photoData, {
          folder: `FaceIn/FaceGallery/${currUser.firstName}-${currUser.lastName} (${currUser.cardID}) [${currUser._id}]`,
        });

        const facePhoto = new FacePhoto({
          creator: currUser._id,
          photoURL: uploadedResponse.secure_url,
          photoPublicID: uploadedResponse.public_id,
          faceDescriptor,
          expression
        });

        await facePhoto.save();
        return FacePhotogqlParser(facePhoto);
      } catch (err) {
        throw err;
      }
    },
    async deleteFacePhoto(_, { photoID }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const targetPhoto = await FacePhoto.findById(photoID);
        if (!targetPhoto) throw new UserInputError("Photo not exist");
        await cloudinary.uploader.destroy(targetPhoto.photoPublicID);
        await FacePhoto.deleteOne(targetPhoto);
        return "Delete Success";
      } catch (err) {
        throw err;
      }
    },

    async retrieveStudentFacePhoto(_, { studentID }, context) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        const photos = await FacePhoto.find({ creator: studentID });

        return photos.map((photo) => FacePhotogqlParser(photo));
      } catch (err) {
        throw err;
      }
    },
  },
};
