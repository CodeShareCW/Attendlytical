import gql from 'graphql-tag';

export const REGISTER_USER = gql`
  mutation register(
    $firstName: String!
    $lastName: String!
    $email: String!
    $cardID: String!
    $password: String!
    $confirmPassword: String!
    $userLevel: Int!
  ) {
    register(
      personInput: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        cardID: $cardID
        password: $password
        confirmPassword: $confirmPassword
        userLevel: $userLevel
      }
    ) {
      _id
      email
      firstName
      lastName
      cardID
      profilePictureURL
      userLevel
      token
    }
  }
`;
