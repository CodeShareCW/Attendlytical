import gql from 'graphql-tag';

export const CREATE_ATTENDANCE_MUTATION = gql`
  mutation createAttendance(
    $courseID: String!
    $date: String!
    $time: String!
  ) {
    createAttendance(
      attendanceInput: {
        courseID: $courseID
        date: $date
        time: $time
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
