import gql from 'graphql-tag';

export const APPROVE_ENROLMENT_MUTATION = gql`
  mutation approveEnrolment($id: ID!) {
    approveEnrolment(enrolmentID: $id)
  }
`;

export const REJECT_ENROLMENT_MUTATION = gql`
  mutation approveEnrolment($id: ID!) {
    rejectEnrolment(enrolmentID: $id)
  }
`;
