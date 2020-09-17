import gql from 'graphql-tag';

export const KICK_PARTICIPANT_MUTATION = gql`
  mutation kickParticipant($participantID: ID!, $courseID: String!) {
    kickParticipant(participantID: $participantID, courseID: $courseID)
  }
`;

export const WARN_PARTICIPANT_MUTATION = gql`
  mutation warnParticipant($participantID: ID!, $courseID: String!) {
    warnParticipant(participantID: $participantID, courseID: $courseID)
  }
`;

export const ADD_PARTICIPANT_MUTATION = gql`
  mutation addParticipant($email: String!, $courseID: String!) {
    addParticipant(email: $email, courseID: $courseID) {
      _id
      firstName
      lastName
      cardID
      profilePictureURL
    }
  }
`;
