import gql from 'graphql-tag';

export const FETCH_PEOPLE_QUERY = gql`
  {
    getPeople{
        _id
        firstName
        lastName
        userLevel
        email
    }
  }
`;