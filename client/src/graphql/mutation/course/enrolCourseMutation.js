import gql from 'graphql-tag';

export const ENROL_COURSE_MUTATION = gql`
  mutation enrolCourse($id: ID!) {
    enrolCourse(courseID: $id)
  }
`;
