import gql from 'graphql-tag';

export const CREATE_ATTENDANCE_MUTATION = gql`
  mutation createAttendance(
    $courseID: String!
    $date: String!
    $time: String!
    $mode: String!
  ) {
    createAttendance(
      attendanceInput: {
        courseID: $courseID
        date: $date
        time: $time
        mode: $mode
      }
    ) {
      _id
      course {
        _id
        shortID
        name
        code
        session
      }
      date
      time
      mode
    }
  }
`;
