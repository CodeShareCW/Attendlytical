const { gql } = require('apollo-server');
module.exports = gql`
  type FacePhoto {
    _id: ID!
    creator: Person!
    photoURL: String!
    faceDescriptor: String!
    expression: String!
    createdAt: String
    updatedAt: String
  }

  type FacePhotos {
    facePhotos: [FacePhoto!]
    hasNextPage: Boolean
  }


  type PhotoPrivacy {
    _id: ID!
    creator: Person!
    public: Boolean
  }

  type FaceProfile {
    student: Person!
    facePhotos: [FacePhoto!]
    photoPrivacy: PhotoPrivacy!
  }
  type FaceMatcher {
    course: Course!
    matcher: [FaceProfile!]
  }

  extend type Query {
    getFacePhotosCount: Int!
    getFacePhotos(cursor: ID, limit: Int!): FacePhotos
    getPhotoPrivacy: Boolean!
    getFaceMatcherInCourse(courseID: String!): FaceMatcher!
  }

  extend type Mutation {
    addFacePhoto(
      photoData: String!
      faceDescriptor: String!
      expression: String
    ): FacePhoto!
    deleteFacePhoto(photoID: ID!): String
    togglePhotoPrivacy(isPublic: Boolean!): Boolean!
  }
`;
