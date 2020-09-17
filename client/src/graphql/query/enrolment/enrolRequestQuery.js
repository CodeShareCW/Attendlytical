import gql from 'graphql-tag';

export const FETCH_ENROLREQUEST_COUNT_QUERY = gql`
  query getEnrolRequestCount {
    getEnrolRequestCount
  }
`;

export const FETCH_ENROLREQUEST_QUERY = gql`
  query getPendingEnrolledCourses($cursor: ID, $limit: Int!) {
    getPendingEnrolledCourses(cursor: $cursor, limit: $limit) {
      pendingEnrolledCourses {
        _id
        student {
          _id
          firstName
          lastName
          profilePictureURL
          cardID
        }
        course {
          _id
          shortID
          name
          code
          session
          createdAt
        }
        status
        message
      }
      hasNextPage
    }
  }
`;
