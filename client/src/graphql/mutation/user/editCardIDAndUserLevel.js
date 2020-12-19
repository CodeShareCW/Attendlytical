import gql from 'graphql-tag';

export const EDIT_CARDID_AND_ROLE_MUTATION = gql`
  mutation editCardIDAndUserLevel($cardID: String!, $userLevel: Int!) {
    editCardIDAndUserLevel(cardID: $cardID, userLevel: $userLevel) {
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
