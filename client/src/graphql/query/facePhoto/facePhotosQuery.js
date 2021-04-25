import gql from 'graphql-tag';

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
        createdAt
      }
      hasNextPage
    }
  }
`;

export const FETCH_FACE_MATCHER_IN_COURSE_QUERY = gql`
  query getFaceMatcherInCourse($courseID: String!) {
    getFaceMatcherInCourse(courseID: $courseID) {
      course {
        _id
        code
        name
        session
        shortID
      }
      matcher {
        student {
          _id
          firstName
          lastName
          cardID
          profilePictureURL
        }
        facePhotos {
          faceDescriptor
          photoURL
        }
      }
    }
  }
`;
