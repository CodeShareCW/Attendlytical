import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

export const LOGIN_GOOGLE_USER = gql`
  mutation googleSignIn(
    $googleID: String!
    $googleEmail: String!
    $googleFirstName: String!
    $googleLastName: String!
    $googleProfilePicture: String!
  ) {
    googleSignIn(
      googlePersonInput: {
        googleID: $googleID
        googleEmail: $googleEmail
        googleFirstName: $googleFirstName
        googleLastName: $googleLastName
        googleProfilePicture: $googleProfilePicture
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
