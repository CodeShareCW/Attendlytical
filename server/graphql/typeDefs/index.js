const testingTypeDefs = require('./testing.type');
const facePhotoTypeDefs = require('./facePhoto.type');
const attendanceTypeDef = require('./attendance.type');
const personTypeDefs = require('./person.type');
const courseTypeDefs = require('./course.type');
const notificationTypeDefs = require('./notification.type');
const trxTypeDefs = require('./trx.type');

module.exports = [
  facePhotoTypeDefs,
  attendanceTypeDef,
  personTypeDefs,
  courseTypeDefs,
  notificationTypeDefs,
  trxTypeDefs
];
