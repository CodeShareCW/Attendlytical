import gql from 'graphql-tag';

export const ADD_COURSE_MUTATION = gql`
  mutation createCourse($start: String!, $end: String!, $date: String!) {
    createCourse(courseInput: { code: $code, name: $name, session: $session }) {
      _id
      shortID
      code
      name
      session
      createdAt
    }
  }
`;
