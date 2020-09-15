import gql from "graphql-tag";

export const FETCH_ENROLPENDING_COUNT_QUERY = gql`
  query getEnrolPendingCount {
    getEnrolPendingCount
  }
`;

export const FETCH_ENROLPENDING_QUERY = gql`
  query getPendingEnrolledCourses($cursor: ID, $limit: Int!) {
    getPendingEnrolledCourses(cursor: $cursor, limit: $limit) {
      pendingEnrolledCourses {
        _id
        courseOwner {
          firstName
          lastName
          cardID
        }
        course {
          _id
          name
          shortID
          code
          session
        }
        status
        message
      }
      hasNextPage
    }
  }
`;
