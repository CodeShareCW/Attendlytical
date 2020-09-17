import gql from 'graphql-tag';

export const DELETE_FACE_PHOTO_MUTATION = gql`
  mutation deleteFacePhoto($photoID: ID!) {
    deleteFacePhoto(photoID: $photoID)
  }
`;
