import gql from 'graphql-tag';

export const WITHDRAW_COURSE_MUTATION = gql`
  mutation withdrawCourse($id: ID!) {
    withdrawCourse(courseID: $id)
  }
`;
