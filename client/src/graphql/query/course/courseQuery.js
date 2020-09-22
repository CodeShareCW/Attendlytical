import gql from 'graphql-tag';

export const FETCH_COURSE_QUERY = gql`
  query getCourseAndParticipants($id: ID!) {
    getCourseAndParticipants(courseID: $id) {
      course {
        _id
        shortID
        name
        code
        session
        createdAt
      }
      participants {
        info {
          _id
          firstName
          lastName
          profilePictureURL
          cardID
        }
        warningCount
        attendRate
      }
      attendanceCount

    }
  }
`;
