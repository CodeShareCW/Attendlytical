require("dotenv").config();

const mailer = require("nodemailer");
const { google } = require("googleapis");
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
});

const {
  Welcome,
  EnrolRequest,
  ApproveEnrolment,
  WarnStudent,
  KickStudent,
  DeleteCourse,
  WithdrawCourse,
  DeletePendingCourse,
} = require("./mailTemplate");

//global mail type naming
const { MAIL_TEMPLATE_TYPE } = require("../globalData");

oAuth2Client.generateAuthUrl({
  access_type: "offline",
});

const getEmailData = (to, firstName, template, payload) => {
  let data = null;

  switch (template) {
    case MAIL_TEMPLATE_TYPE.Welcome:
      data = {
        from: "Attendlytical <attendlytical@gmail.com>",
        to,
        subject: `Welcome To Attendlytical!`,
        html: Welcome(firstName),
      };
      break;
    case MAIL_TEMPLATE_TYPE.EnrolRequest:
      data = {
        from: "Attendlytical <attendlytical@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - You have a new enrol request`,
        html: EnrolRequest(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.ApproveEnrolment:
      data = {
        from: "Attendlytical <attendlytical@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - Your enrolment is approved`,
        html: ApproveEnrolment(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.WarnStudent:
      data = {
        from: "Attendlytical <attendlytical@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - You have an attendance warning`,
        html: WarnStudent(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.KickStudent:
      data = {
        from: "Attendlytical <attendlytical@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - You had been kicked out`,
        html: KickStudent(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.DeleteCourse:
      data = {
        from: "Attendlytical <attendlytical@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - A course was deleted by course owner`,
        html: DeleteCourse(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.DeletePendingCourse:
      data = {
        from: "Attendlytical <attendlytical@gmail.com>",
        to,
        subject: `Course ID: ${payload.course.shortID} - A course was deleted by course owner`,
        html: DeletePendingCourse(firstName, payload),
      };
      break;
    case MAIL_TEMPLATE_TYPE.WithdrawCourse:
      data = {
        from: "Attendlytical <attendlytical@gmail.com>",
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

const sendEmail = async (to, name, type, payload) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const smtpTransport = mailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_OAUTH_USERNAME,
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
        accessToken: accessToken,
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
  } catch (e) {}
};

module.exports = { sendEmail };
