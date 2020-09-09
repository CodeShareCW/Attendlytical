import gql from "graphql-tag";

export const FETCH_ENROLLEDCOURSES_QUERY = gql`
  query getEnrolledCourses($cursor: String, $limit: Int!) {
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
