import gql from 'graphql-tag';

export const FETCH_UNCHECKED_NOTIFICATIONS_QUERY = gql`
  query getUncheckedNotificationsCount {
    getUncheckedNotificationsCount
  }
`;

export const FETCH_NOTIFICATIONS_QUERY = gql`
  query getNotifications($cursor: ID, $limit: Int!) {
    getNotifications(cursor: $cursor, limit: $limit) {
      notifications {
        _id
        title
        content
        checked
        createdAt
        updatedAt
      }
      hasNextPage
    }
  }
`;
