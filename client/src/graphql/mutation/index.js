import { CREATE_ATTENDANCE_MUTATION } from './attendance/createAttendanceMutation';
import { EDIT_ATTENDANCE_MODE_MUTATION } from './attendance/editAttendanceModeMutation';
import { EDIT_ATTENDANCE_ON_OFF_MUTATION } from './attendance/editAttendanceOnOffMutation';

import { DELETE_ATTENDANCE_MUTATION } from './attendance/deleteAttendanceMutation';
import { ADD_COURSE_MUTATION } from './course/addCourseMutation';
import { DELETE_COURSE_MUTATION } from './course/deleteCourseMutation';
import { ENROL_COURSE_MUTATION } from './course/enrolCourseMutation';
import { WITHDRAW_COURSE_MUTATION } from './course/withdrawCourseMutation';
import {
  APPROVE_ENROLMENT_MUTATION,
  REJECT_ENROLMENT_MUTATION
} from './enrolment/enrolmentMutation';
import { ADD_FACE_PHOTO_MUTATION } from './facePhoto/addFacePhotoMutation';
import { DELETE_FACE_PHOTO_MUTATION } from './facePhoto/deleteFacePhotoMutation';
import {
  LOGIN_GOOGLE_USER, LOGIN_USER
} from './login_register/loginUserMutation';
import { REGISTER_USER } from './login_register/registerUserMutation';
import {
  ADD_PARTICIPANT_MUTATION,
  KICK_PARTICIPANT_MUTATION,
  WARN_PARTICIPANT_MUTATION
} from './participant/participantMutation';
import { EDIT_PROFILE_MUTATION } from './user/editProfileMutation';
import {EDIT_CARDID_AND_ROLE_MUTATION} from "./user/editCardIDAndUserLevel";
import { OBTAIN_STUDENT_WARNING_MUTATION } from './warning/obtainStudentWarningMutation';
import {CREATE_TRX_MUTATION} from "./trx/createTrxMutation";

export { LOGIN_USER, LOGIN_GOOGLE_USER, REGISTER_USER };
export { EDIT_PROFILE_MUTATION, EDIT_CARDID_AND_ROLE_MUTATION };
export { APPROVE_ENROLMENT_MUTATION, REJECT_ENROLMENT_MUTATION };
export {
  WARN_PARTICIPANT_MUTATION,
  KICK_PARTICIPANT_MUTATION,
  ADD_PARTICIPANT_MUTATION,
};
export {
  ADD_COURSE_MUTATION,
  DELETE_COURSE_MUTATION,
  ENROL_COURSE_MUTATION,
  WITHDRAW_COURSE_MUTATION,
};
export { OBTAIN_STUDENT_WARNING_MUTATION };
export { ADD_FACE_PHOTO_MUTATION, DELETE_FACE_PHOTO_MUTATION };
export { CREATE_ATTENDANCE_MUTATION, EDIT_ATTENDANCE_MODE_MUTATION, EDIT_ATTENDANCE_ON_OFF_MUTATION, DELETE_ATTENDANCE_MUTATION };
export {CREATE_TRX_MUTATION}
