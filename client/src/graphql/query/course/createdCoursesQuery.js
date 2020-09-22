import gql from 'graphql-tag';

export const FETCH_CREATEDCOURSES_COUNT_QUERY = gql`
  query getCreatedCoursesCount {
    getCreatedCoursesCount
  }
`;

export const FETCH_CREATEDCOURSES_QUERY = gql`
  query getCreatedCourses($cursor: ID, $limit: Int!) {
    getCreatedCourses(cursor: $cursor, limit: $limit) {
      courses {
        _id
        shortID
        creator {
          firstName
          lastName
        }
        name
        code
        session
        createdAt
        enrolledStudents {
          _id
          firstName
          lastName
          profilePictureURL
          cardID
        }
      }
      hasNextPage
    }
  }
`;

export const FETCH_ALL_CREATEDCOURSES_QUERY = gql`
  query getAllCreatedCourses {
    getAllCreatedCourses {
      _id
      shortID
      name
      code
      session
    }
  }
`;
