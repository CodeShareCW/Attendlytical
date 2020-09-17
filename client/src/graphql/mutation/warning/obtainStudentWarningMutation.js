import gql from 'graphql-tag';

export const OBTAIN_STUDENT_WARNING_MUTATION = gql`
  mutation obtainStudentWarning($participantID: ID!, $courseID: String!) {
    obtainStudentWarning(participantID: $participantID, courseID: $courseID)
  }
`;
