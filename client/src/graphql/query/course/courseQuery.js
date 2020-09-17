import gql from 'graphql-tag';

export const FETCH_COURSE_QUERY = gql`
  query getCourse($id: ID!) {
    getCourse(courseID: $id) {
      _id
      shortID
      name
      code
      session
      createdAt
      enrolledStudents {
        _id
        firstName
        lastName
        profilePictureURL
        cardID
      }
    }
  }
`;
