import gql from 'graphql-tag';

export const CREATE_ATTENDANCE_MUTATION = gql`
  mutation createAttendance(
    $courseID: ID!
    $date: String!
    $time: String!
    $attendees: [ID!]
    $absentees: [ID!]
    $participants: [ID!]
    $expressions: [String!]
  ) {
    createAttendance(
      attendanceInput: {
        courseID: $courseID
        date: $date
        time: $time
        attendees: $attendees
        absentees: $absentees
        participants: $participants
        expressions: $expressions
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
