import gql from "graphql-tag";

export const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String!
    $lastName: String!
    $cardID: String!
    $profilePicture: String
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      cardID: $cardID
      profilePicture: $profilePicture
    ) {
      _id
      email
      firstName
      lastName
      cardID
      profilePictureURL
      userLevel
      createdAt
      token
    }
  }
`;

export const APPROVE_ENROLMENT_MUTATION = gql`
  mutation approveEnrolment($id: ID!) {
    approveEnrolment(notificationID: $id)
  }
`;

export const REJECT_ENROLMENT_MUTATION = gql`
  mutation approveEnrolment($id: ID!) {
    rejectEnrolment(notificationID: $id)
  }
`;
