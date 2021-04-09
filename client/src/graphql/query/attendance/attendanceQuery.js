import gql from 'graphql-tag';

export const FETCH_ATTENDANCES_COUNT_QUERY = gql`
  query getAttendancesCount {
    getAttendancesCount
  }
`;

export const FETCH_ATTENDANCES_COUNT_IN_COURSE_QUERY = gql`
  query getAttendancesCountInCourse($courseID: String!) {
    getAttendancesCountInCourse(courseID: $courseID)
  }
`;

export const FETCH_ATTENDANCE_QUERY = gql`
  query getAttendance($attendanceID: ID!) {
    getAttendance(attendanceID: $attendanceID) {
      _id
      course {
        _id
        name
        code
        session
        shortID
      }
      time
      date
      participants {
        info {
          _id
          firstName
          lastName
          cardID
          profilePictureURL
        }
        attendRate
      }
      attendees {
        info {
          _id
          firstName
          lastName
          cardID
          profilePictureURL
        }
        attendRate
      }
      absentees {
        info {
          _id
          firstName
          lastName
          cardID
          profilePictureURL
        }
        attendRate
      }
    }
  }
`;

export const FETCH_ATTENDANCES_QUERY = gql`
  query getAttendances($currPage: Int!, $pageSize: Int!) {
    getAttendances(currPage: $currPage, pageSize: $pageSize) {
      _id
      course {
        _id
        name
        code
        session
        shortID
      }
      time
      date
      participants {
        info {
          _id
        }
      }
      attendees {
        info {
          _id
        }
      }
      absentees {
        info {
          _id
        }
      }
    }
  }
`;

export const FETCH_ATTENDANCES_IN_COURSE_QUERY = gql`
  query getAttendancesInCourse(
    $courseID: String!
    $currPage: Int!
    $pageSize: Int!
  ) {
    getAttendancesInCourse(
      courseID: $courseID
      currPage: $currPage
      pageSize: $pageSize
    ) {
      course {
        _id
        name
        code
        session
        shortID
      }
      attendances {
        _id
        time
        date
        attendees {
          info {
            _id
          }
        }
        absentees {
          info {
            _id
          }
        }
        participants {
          info {
            _id
          }
        }
      }
    }
  }
`;
