const participantTypeDefs = require('./participant.type');
const testingTypeDefs = require('./testing.type');
const facePhotoTypeDefs = require('./facePhoto.type');
const attendanceTypeDef = require('./attendance.type');
const personTypeDefs = require('./person.type');
const courseTypeDefs = require('./course.type');
const enrolmentTypeDefs = require('./enrolment.type');
const notificationTypeDefs = require('./notification.type');

module.exports = [
  participantTypeDefs,
  testingTypeDefs,
  facePhotoTypeDefs,
  attendanceTypeDef,
  personTypeDefs,
  courseTypeDefs,
  enrolmentTypeDefs,
  notificationTypeDefs,
];
