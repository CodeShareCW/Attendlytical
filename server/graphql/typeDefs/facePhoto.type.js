const { gql } = require('apollo-server');
module.exports = gql`
  type FacePhoto {
    _id: ID!
    creator: Person!
    photoURL: String!
    faceDescriptor: String!
    createdAt: String
    updatedAt: String
  }

  type FacePhotos {
    facePhotos: [FacePhoto!]
    hasNextPage: Boolean
  }

  type FaceProfile {
    student: Person!
    facePhotos: [FacePhoto!]
  }
  type FaceMatcher {
    course: Course!
    matcher: [FaceProfile!]
  }

  type Query {
    getFacePhotosCount: Int!
    getFacePhotos(cursor: ID, limit: Int!): FacePhotos
    getFaceMatcherInCourse(courseID: String!): FaceMatcher!
  }

  type Mutation {
    addFacePhoto(
      photoData: String!
      faceDescriptor: String!
    ): FacePhoto!
    deleteFacePhoto(photoID: ID!): String
  }
`;
