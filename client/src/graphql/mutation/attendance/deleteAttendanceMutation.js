import gql from 'graphql-tag';

export const DELETE_ATTENDANCE_MUTATION = gql`
  mutation deleteAttendance($attendanceID: ID!) {
    deleteAttendance(attendanceID: $attendanceID) {
      _id
    }
  }
`;
