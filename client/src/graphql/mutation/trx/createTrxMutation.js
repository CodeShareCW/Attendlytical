import gql from "graphql-tag";

export const CREATE_TRX_MUTATION = gql`
  mutation createTrx($attendanceID: ID!, $studentID: ID!) {
    createTrx(
      trxInput: { attendanceID: $attendanceID, studentID: $studentID }
    )
  }
`;
