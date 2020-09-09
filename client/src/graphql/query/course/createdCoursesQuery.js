import gql from "graphql-tag";

export const FETCH_CREATEDCOURSES_COUNT_QUERY = gql`
  query getCreatedCoursesCount {
    getCreatedCoursesCount
  }
`;

export const FETCH_CREATEDCOURSES_QUERY = gql`
  query getCreatedCourses($cursor: String, $limit: Int!) {
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
      }
      hasNextPage
    }
  }
`;