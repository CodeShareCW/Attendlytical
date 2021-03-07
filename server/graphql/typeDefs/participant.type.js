const { gql } = require('apollo-server');

module.exports = gql`
  type Participant {
    info: Person!
    warningCount: Int!
    attendRate: Float
    expression: String!
  }

  type Query {
    getWarningCount(courseID: ID!): Int!
  }

  type Mutation {
    addParticipant(email: String!, courseID: String!): Person!
    kickParticipant(participantID: ID!, courseID: String!): String!
    warnParticipant(participantID: ID!, courseID: String!): String!
  }
`;
