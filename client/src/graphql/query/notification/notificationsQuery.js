import gql from "graphql-tag";

export const FETCH_UNCHECKED_NOTIFICATIONS_QUERY = gql`
  query getUncheckedNotificationsCount {
    getUncheckedNotificationsCount
  }
`;

export const FETCH_NOTIFICATION_QUERY = gql`
  query getNotifications($cursor: String, $limit: Int!) {
    getNotifications(cursor: $cursor, limit: $limit) {
      _id
      title
      content
      checked
      createdAt
      updatedAt
    }
  }
`;