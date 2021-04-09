import gql from 'graphql-tag';


export const FETCH_COURSES_COUNT_QUERY = gql`
  query getCoursesCount {
    getCoursesCount
  }
`;

export const FETCH_COURSE_QUERY = gql`
  query getCourseAndParticipants($id: ID!) {
    getCourseAndParticipants(courseID: $id) {
      course {
        _id
        shortID
        name
        code
        session
        createdAt
      }
      participants {
        info {
          _id
          firstName
          lastName
          profilePictureURL
          cardID
        }
        warningCount
        attendRate
      }
      attendanceCount

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