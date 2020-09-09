import gql from "graphql-tag";

export const FETCH_ENROLREQUEST_COUNT_QUERY = gql`
  query getEnrolRequestCount {
    getEnrolRequestCount
  }
`;

export const FETCH_ENROLREQUEST_QUERY = gql`
  query getPendingEnrolledCourse($cursor: String, $limit: Int!) {
    getPendingEnrolledCourse(cursor: $cursor, limit: $limit) {
      _id
      student {
        firstName
        lastName
        cardID
        email
      }
      course {
        shortID
        name
        code
        session
      }
      status
      message
      hasNextPage
    }
  }
`;
