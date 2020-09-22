import { actionTypes } from './actionTypes';
import { modalItems } from './customModalItems';
import { EmojiExpressionsType } from './EmojiExpressionType';
import { inputSize } from './faceAPI';
import { DEFAULT_UPLOAD_OPTION, UPLOAD_OPTION } from './facePhoto';
import {
  FETCH_ATTENDANCE_LIMIT,
  FETCH_COURSE_LIMIT,
  FETCH_ENROLMENT_LIMIT,
  FETCH_FACE_PHOTOS_LIMIT,
  FETCH_NOTIFICATION_LIMIT
} from './limitFetch';
import { INITIAL_COLLAPSE } from './navbar';
import {
  DEFAULT_WEBCAM_RESOLUTION,
  webcamResolutionType
} from './webcamResolutionType';

export { INITIAL_COLLAPSE };
export {
  FETCH_COURSE_LIMIT,
  FETCH_ENROLMENT_LIMIT,
  FETCH_NOTIFICATION_LIMIT,
  FETCH_ATTENDANCE_LIMIT,
  FETCH_FACE_PHOTOS_LIMIT,
};
export { actionTypes };
export { webcamResolutionType, DEFAULT_WEBCAM_RESOLUTION };
export { EmojiExpressionsType };
export { inputSize };
export { DEFAULT_UPLOAD_OPTION, UPLOAD_OPTION };
export { modalItems };

export const OfficialURL = 'https://localhost:3000';
