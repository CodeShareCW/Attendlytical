import gql from "graphql-tag";

export const FETCH_ENROLPENDING_COUNT_QUERY = gql`
  query getEnrolPendingCount {
    getEnrolPendingCount
  }
`;

export const FETCH_ENROLPENDING_QUERY = gql`
  query getPendingEnrolledCourse($cursor: String, $limit: Int!) {
    getPendingEnrolledCourse(cursor: $cursor, limit: $limit) {
      _id
      courseOwner {
        firstName
        lastName
        cardID
      }
      course {
        name
        code
        session
      }
      status
      message
    }
  }
`;
