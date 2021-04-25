import gql from 'graphql-tag';

export const FETCH_TRX_LIST_IN_ATTENDANCE = gql`
  query getTrxListInAttendance($attendanceID: ID!) {
    getTrxListInAttendance(attendanceID: $attendanceID){
        studentID
        createdAt
    }
  }
`;
