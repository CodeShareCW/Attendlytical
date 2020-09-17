import gql from 'graphql-tag';

export const GET_WARNING_COUNT_QUERY = gql`
  query getWarningCount($courseID: ID!) {
    getWarningCount(courseID: $courseID)
  }
`;
