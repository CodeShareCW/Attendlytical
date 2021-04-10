const participantTypeDefs = require('./participant.type');
const testingTypeDefs = require('./testing.type');
const facePhotoTypeDefs = require('./facePhoto.type');
const attendanceTypeDef = require('./attendance.type');
const personTypeDefs = require('./person.type');
const courseTypeDefs = require('./course.type');
const enrolmentTypeDefs = require('./enrolment.type');
const notificationTypeDefs = require('./notification.type');
const trxTypeDefs = require('./trx.type');

module.exports = [
  participantTypeDefs,
  facePhotoTypeDefs,
  attendanceTypeDef,
  personTypeDefs,
  courseTypeDefs,
  enrolmentTypeDefs,
  notificationTypeDefs,
  trxTypeDefs
];
