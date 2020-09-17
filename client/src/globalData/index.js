import { actionTypes } from './actionTypes';
import { FETCH_COURSE_LIMIT } from './course';
import { EmojiExpressionsType } from './EmojiExpressionType';
import { FETCH_ENROLMENT_LIMIT } from './enrolment';
import { inputSize } from './faceAPI';
import {
  FETCH_FACE_PHOTOS_LIMIT,
  DEFAULT_UPLOAD_OPTION,
  UPLOAD_OPTION,
} from './facePhoto';
import { INITIAL_COLLAPSE } from './navbar';
import { FETCH_NOTIFICATION_LIMIT } from './notification';
import {
  DEFAULT_WEBCAM_RESOLUTION,
  webcamResolutionType,
} from './webcamResolutionType';

import { modalItems } from './customModalItems';

export { INITIAL_COLLAPSE };
export { FETCH_COURSE_LIMIT };
export { FETCH_ENROLMENT_LIMIT };
export { FETCH_NOTIFICATION_LIMIT };
export { actionTypes };
export { webcamResolutionType, DEFAULT_WEBCAM_RESOLUTION };
export { EmojiExpressionsType };
export { inputSize };
export { FETCH_FACE_PHOTOS_LIMIT, DEFAULT_UPLOAD_OPTION, UPLOAD_OPTION };

export const OfficialURL = 'https://localhost:3000';

export { modalItems };
