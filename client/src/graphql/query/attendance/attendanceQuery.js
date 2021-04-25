import gql from "graphql-tag";

export const FETCH_ATTENDANCE_LIST_COUNT_IN_COURSE_QUERY = gql`
  query getAttendanceListCountInCourse($courseID: String!) {
    getAttendanceListCountInCourse(courseID: $courseID)
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
      mode
      isOn
    }
  }
`;

export const FETCH_ATTENDANCE_LIST_IN_COURSE_QUERY = gql`
  query getAttendanceListInCourse(
    $courseID: String!
    $currPage: Int!
    $pageSize: Int!
  ) {
    getAttendanceListInCourse(
      courseID: $courseID
      currPage: $currPage
      pageSize: $pageSize
    ) {
      course{
        _id
        shortID
        code
        name
        session
      }
      attendanceList{
        _id
        time
        date
        mode
        isOn
      }
    }
  }
`;
