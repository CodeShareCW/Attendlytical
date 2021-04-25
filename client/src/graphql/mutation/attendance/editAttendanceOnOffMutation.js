import gql from "graphql-tag";

export const EDIT_ATTENDANCE_ON_OFF_MUTATION = gql`
  mutation editAttendanceOnOff($attendanceID: ID!, $isOn: Boolean!) {
    editAttendanceOnOff(attendanceID: $attendanceID, isOn: $isOn) {
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
      isOn
    }
  }
`;
