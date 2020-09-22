const { gql } = require('apollo-server');
module.exports = gql`
  type Notification {
    _id: ID!
    receiver: Person!
    title: String!
    content: String!
    checked: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Notifications {
    notifications: [Notification!]
    hasNextPage: Boolean
  }

  input notificationInput {
    receiverID: ID!
    title: String!
    content: String!
  }

  extend type Query {
    getNotifications(cursor: ID, limit: Int!): Notifications
    getNotification(notificationID: ID!): Notification!
    getUncheckedNotificationsCount: Int!
  }

  extend type Mutation{
    checkNotification(notificationID: ID!): Notification!

  }
`;
