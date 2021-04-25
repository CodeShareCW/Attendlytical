import gql from 'graphql-tag';


export const FETCH_COURSES_COUNT_QUERY = gql`
  query getCoursesCount {
    getCoursesCount
  }
`;

export const FETCH_COURSE_QUERY = gql`
  query getCourse($id: ID!) {
    getCourse(courseID: $id) {
        _id
        shortID
        name
        code
        session
    }
  }
`;

export const FETCH_PARTICIPANTS_QUERY = gql`
  query getParticipants($id: ID!) {
    getParticipants(courseID: $id) {
      _id
      firstName
      lastName
      profilePictureURL
      cardID
    }
  }
`;

export const FETCH_COURSES_QUERY = gql`
  query getCourses($currPage: Int!, $pageSize: Int!) {
    getCourses(currPage: $currPage, pageSize: $pageSize) {
      courses {
        _id
        shortID
        creator {
          firstName
          lastName
          cardID
        }
        name
        code
        session
        createdAt
      }
    }
  }
`;