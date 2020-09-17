import gql from 'graphql-tag';

export const ADD_FACE_PHOTO_MUTATION = gql`
  mutation addFacePhoto(
    $photoData: String!
    $faceDescriptor: String!
    $expression: String!
  ) {
    addFacePhoto(
      photoData: $photoData
      faceDescriptor: $faceDescriptor
      expression: $expression
    ) {
      faceDescriptor
      photoURL
      expression
    }
  }
`;
