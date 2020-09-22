import gql from 'graphql-tag';

export const DELETE_ATTENDANCE_MUTATION = gql`
  mutation deleteAttendance($attendanceID: ID!) {
    deleteAttendance(attendanceID: $attendanceID) {
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
      attendees {
        info {
          _id
          firstName
          lastName
          cardID
        }
      }
      absentees {
        info {
          _id
          firstName
          lastName
          cardID
        }
      }
      participants {
        info {
          _id
          firstName
          lastName
          cardID
        }
      }
    }
  }
`;
