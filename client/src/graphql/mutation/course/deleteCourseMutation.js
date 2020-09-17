import gql from 'graphql-tag';

export const DELETE_COURSE_MUTATION = gql`
  mutation deleteCourse($id: ID!) {
    deleteCourse(courseID: $id) {
      _id
      name
      code
      session
    }
  }
`;
