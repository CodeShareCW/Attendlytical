import gql from "graphql-tag";

export const FETCH_FACE_PHOTOS_COUNT_QUERY = gql`
  query getFacePhotosCount {
    getFacePhotosCount
  }
`;

export const FETCH_FACE_PHOTOS_QUERY = gql`
  query getFacePhotos($cursor: ID, $limit: Int!) {
    getFacePhotos(cursor: $cursor, limit: $limit) {
      facePhotos {
        _id
        faceDescriptor
        photoURL
      }
      hasNextPage
    }
  }
`;

