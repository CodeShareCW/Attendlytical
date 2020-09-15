import gql from "graphql-tag";

export const FETCH_ENROLLEDCOURSES_COUNT_QUERY = gql`
  query getEnrolledCoursesCount {
    getEnrolledCoursesCount
  }
`;

export const FETCH_ENROLLEDCOURSES_QUERY = gql`
  query getEnrolledCourses($cursor: ID, $limit: Int!) {
    getEnrolledCourses(cursor: $cursor, limit: $limit) {
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
      }
      hasNextPage
    }
  }
`;
