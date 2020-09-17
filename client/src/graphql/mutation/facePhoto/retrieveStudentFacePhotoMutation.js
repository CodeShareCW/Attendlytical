import gql from 'graphql-tag';

export const RETRIEVE_STUDENT_FACE_PHOTOS_MUTATION = gql`
  mutation retrieveStudentFacePhoto($studentID: ID!) {
    retrieveStudentFacePhoto(studentID: $studentID) {
      _id
      faceDescriptor
      photoURL
      creator {
        _id
      }
    }
  }
`;
