const { UserInputError } = require('apollo-server');

const Person = require('../../models/person.model');
const FacePhoto = require('../../models/facePhoto.model');
const PhotoPrivacy = require('../../models/photoPrivacy.model');
const Course = require('../../models/course.model');

const checkAuth = require('../../util/check-auth');
const { cloudinary } = require('../../util/cloudinary');

const {
  PersongqlParser,
  CoursegqlParser,
  FacePhotogqlParser,
  FacePhotosgqlParser,
  PhotoPrivacygqlParser,
} = require('./merge');

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
          ['id']
        );
        return existingPhotos.length;
      } catch (err) {
        throw err;
      }
    },

    async getPhotoPrivacy(_, __, context) {
      const currUser = checkAuth(context);
      let errors = {};

      try {
        const privacy = await PhotoPrivacy.findOne({ creator: currUser._id });

        if (!privacy) {
          throw new UserInputError('Something wrong');
        }

        return privacy.public;
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
    async getFaceMatcherInCourse(_, { courseID }, context) {
      const currUser = checkAuth(context);

      try {
        
        const course = await Course.findOne({ shortID: courseID });

        if (course.creator != currUser._id){
          throw new Error("Access Prohibited. You are not the owner of the course");
        }
        const matcher = course.enrolledStudents.map(async (stud) => {
          const photos = await FacePhoto.find({ creator: stud });
          const privacy = await PhotoPrivacy.findOne({ creator: stud });
          const student = await Person.findById(stud);

          return {
            student: PersongqlParser(student),
            facePhotos: photos.map((photo) => FacePhotogqlParser(photo)),
            photoPrivacy: PhotoPrivacygqlParser(privacy),
          };
        });

        return { course: CoursegqlParser(course), matcher: matcher };
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
        const uploadedResponse = await cloudinary.uploader.upload(photoData, {
          folder: `Attendlytical/FaceGallery/${currUser._id}`,
        });

        const facePhoto = new FacePhoto({
          creator: currUser._id,
          photoURL: uploadedResponse.secure_url,
          photoPublicID: uploadedResponse.public_id,
          faceDescriptor,
          expression,
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
        if (!targetPhoto) throw new UserInputError('Photo not exist');
        await cloudinary.uploader.destroy(targetPhoto.photoPublicID);
        await FacePhoto.deleteOne(targetPhoto);
        return 'Delete Success';
      } catch (err) {
        throw err;
      }
    },

    async togglePhotoPrivacy(_, { isPublic }, context) {
      const currUser = checkAuth(context);
      let errors = {};
      try {
        const privacy = await PhotoPrivacy.findOne({ creator: currUser._id });

        if (!privacy) {
          throw new UserInputError('Something wrong');
        }

        await PhotoPrivacy.findOneAndUpdate(
          { creator: currUser._id },
          { $set: { public: isPublic } }
        );

        return isPublic;
      } catch (err) {
        throw err;
      }
    },
  },
};
