import { ADD_COURSE_MUTATION } from "./course/addCourseMutation";
import { DELETE_COURSE_MUTATION } from "./course/deleteCourseMutation";
import { ENROL_COURSE_MUTATION } from "./course/enrolCourseMutation";
import { WITHDRAW_COURSE_MUTATION } from "./course/withdrawCourseMutation";
import {
  APPROVE_ENROLMENT_MUTATION,
  REJECT_ENROLMENT_MUTATION
} from "./enrolment/enrolmentMutation";
import { ADD_FACE_PHOTO_MUTATION } from "./facePhoto/addFacePhotoMutation";
import { LOGIN_USER } from "./login_register/loginUserMutation";
import { REGISTER_USER } from "./login_register/registerUserMutation";
import {
  ADD_PARTICIPANT_MUTATION,
  KICK_PARTICIPANT_MUTATION,
  WARN_PARTICIPANT_MUTATION
} from "./participant/participantMutation";
import { EDIT_PROFILE_MUTATION } from "./user/editProfileMutation";
import { OBTAIN_STUDENT_WARNING_MUTATION } from "./warning/obtainStudentWarningMutation";
import {DELETE_FACE_PHOTO_MUTATION} from "./facePhoto/deleteFacePhotoMutation";

export { LOGIN_USER, REGISTER_USER };
export { EDIT_PROFILE_MUTATION };
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
export { ADD_FACE_PHOTO_MUTATION };
export {DELETE_FACE_PHOTO_MUTATION}

