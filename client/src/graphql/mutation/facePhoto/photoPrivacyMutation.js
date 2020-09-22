import gql from 'graphql-tag';

export const TOGGLE_PHOTO_PRIVACY_MUTATION = gql`
  mutation togglePhotoPrivacy($isPublic: Boolean!) {
    togglePhotoPrivacy(isPublic: $isPublic)
  }
`;
