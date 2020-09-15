require("dotenv").config();

const mailer = require("nodemailer");
const {
  Welcome,
  EnrolRequest,
  ApproveEnrolment,
  WarnStudent,
  KickStudent,
  DeleteCourse,
  WithdrawCourse,
  DeletePendingCourse
} = require("./mailTemplate");

//global mail type naming
const { MAIL_TEMPLATE_TYPE } = require("../globalData");

const getEmailData = (to, firstName, template, payload) => {
  let data = null;

  switch (template) {
    case MAIL_TEMPLATE_TYPE.Welcome:
      data = {
        from: "Face In <faceinattendanceapp@gmail.com>",
        to,
        subject: `Welcome To Face In!`,
        html: Welcome(firstName),
      };
      break;
    case MAIL_TEMPLATE_TYPE.EnrolRequest:
      data = {
        from: "Face In <faceinattendanceapp@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - You have a new enrol request`,
        html: EnrolRequest(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.ApproveEnrolment:
      data = {
        from: "Face In <faceinattendanceapp@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - Your enrolment is approved`,
        html: ApproveEnrolment(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.WarnStudent:
      data = {
        from: "Face In <faceinattendanceapp@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - You have an attendance warning`,
        html: WarnStudent(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.KickStudent:
      data = {
        from: "Face In <faceinattendanceapp@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - You had been kicked out`,
        html: KickStudent(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.DeleteCourse:
      data = {
        from: "Face In <faceinattendanceapp@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - A course was deleted by course owner`,
        html: DeleteCourse(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.DeletePendingCourse:
      data = {
        from: "Face In <faceinattendanceapp@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - A course was deleted by course owner`,
        html: DeletePendingCourse(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.WithdrawCourse:
      data = {
        from: "Face In <faceinattendanceapp@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - A student had withdrawn from your course`,
        html: WithdrawCourse(firstName, payload),
      };
      break;
    default:
      data;
  }
  return data;
};

const sendEmail = (to, name, type, payload) => {
  const smtpTransport = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mail = getEmailData(to, name, type, payload);

  smtpTransport.sendMail(mail, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent to: ${to} successfully: ` + response);
    }
    smtpTransport.close();
  });
};

module.exports = { sendEmail };
