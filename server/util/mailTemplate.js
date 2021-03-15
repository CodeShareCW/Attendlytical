const {OfficialURL}=require("../globalData");

module.exports.Welcome = (firstName) => {
  return `
        <p>Hi ${firstName}, </p>
        <p>Thank you for signing up Attendlytical! Do send me an email to:
        <a href="mailto:attendlytical@gmail.com">attendlytical@gmail.com</a></p>
        if you have any inquiry, suggestion or found bug.<p>Thank you again and have a nice day ahead!</p>
        <i>Note: This mail is auto-generated for every signup</i>
        <p>
        Thanks, <br/>
        Attendlytical
        </p>
    `;
};

module.exports.EnrolRequest = (firstName, payload) => {
  console.log(payload);
  return `
          <p>Hi ${firstName}, </p>

          <p>
            A student requested to enrol the course below. 
          </p>
          
          <p>---------------------Student Detail---------------------</p>
          <p>First Name: <strong>${payload.student.firstName}</strong></p>
          <p>Last Name: <strong>${payload.student.lastName}</strong> </p>
          <p>Matric No: <strong>${payload.student.cardID}</strong> </p>
          <p>Email: <strong>${payload.student.email}</strong> </p>
          <br />
          <p>---------------------Enrolled Course Detail---------------------</p>
          <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
          <p>Course Owner: <strong>You</strong></p>
          <p>Course Code: <strong>${payload.course.code}</strong> </p>
          <p>Course Name: <strong>${payload.course.name}</strong> </p>
          <p>Course Session: <strong>${payload.course.session}</strong> </p>

          Click <a href=${OfficialURL}>here</a> to sign in
          <p>
          Thanks, <br/>
          Attendlytical
          </p>
      `;
};

module.exports.ApproveEnrolment = (firstName, payload) => {
  console.log(payload);
  return `
        <p>Hi ${firstName}, </p>
        <p>
          Your enrolment to the course below had been approved. 
        </p>
        
        <p>---------------------Course Detail---------------------</p>
        <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
        <p>Course Owner: <strong>${payload.owner.firstName} ${payload.owner.lastName}</strong></p>
        <p>Course Code: <strong>${payload.course.code}</strong> </p>
        <p>Course Name: <strong>${payload.course.name}</strong> </p>
        <p>Course Session: <strong>${payload.course.session}</strong> </p>
        
        Click <a href=${OfficialURL}>here</a> to sign in
        <p>
        Thanks, <br/>
        Attendlytical
        </p>
    `;
};

module.exports.WarnStudent = (firstName, payload) => {
  return `
        <p>Hi ${firstName}, </p>
        <p>
          Your lecturer: ${payload.owner.firstName} ${payload.owner.lastName} send you a warning alert. 
        </p>
        
        <p>---------------------Course Detail---------------------</p>
        <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
        <p>Course Owner: <strong>${payload.owner.firstName} ${payload.owner.lastName}</strong></p>
        <p>Course Code: <strong>${payload.course.code}</strong> </p>
        <p>Course Name: <strong>${payload.course.name}</strong> </p>
        <p>Course Session: <strong>${payload.course.session}</strong> </p>
        
        Click <a href=${OfficialURL}>here</a> to sign in
        <p>
        Thanks, <br/>
        Attendlytical
        </p>
    `;
};

module.exports.KickStudent = (firstName, payload) => {
  console.log(payload);
  return `
        <p>Hi ${firstName}, </p>
        <p>
          Course owner had kicked you out from the course below. 
        </p>
        
        <p>---------------------Course Detail---------------------</p>
        <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
        <p>Course Owner: <strong>${payload.owner.firstName} ${payload.owner.lastName}</strong></p>
        <p>Course Code: <strong>${payload.course.code}</strong> </p>
        <p>Course Name: <strong>${payload.course.name}</strong> </p>
        <p>Course Session: <strong>${payload.course.session}</strong> </p>
        
        Click <a href=${OfficialURL}>here</a> to sign in
        <p>
        Thanks, <br/>
        Attendlytical
        </p>
    `;
};

module.exports.DeleteCourse = (firstName, payload) => {
  console.log(payload);
  return `
        <p>Hi ${firstName}, </p>
        <p>
          Course owner had deleted the course below, hence disappeared in your enrolled course list. Sayonara.
        </p>
      
        <p>---------------------Course Detail---------------------</p>
        <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
        <p>Course Owner: <strong>${payload.owner.firstName} ${payload.owner.lastName}</strong></p>
        <p>Course Code: <strong>${payload.course.code}</strong> </p>
        <p>Course Name: <strong>${payload.course.name}</strong> </p>
        <p>Course Session: <strong>${payload.course.session}</strong> </p>
      
        Click <a href=${OfficialURL}>here</a> to sign in
        <p>
        Thanks, <br/>
        Attendlytical
        </p>
    `;
};

module.exports.DeletePendingCourse = (firstName, payload) => {
  console.log(payload);
  return `
        <p>Hi ${firstName}, </p>
        <p>
          Course owner had deleted the course below, hence disappeared in your enrolment pending list.
        </p>
      
        <p>---------------------Course Detail---------------------</p>
        <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
        <p>Course Owner: <strong>${payload.owner.firstName} ${payload.owner.lastName}</strong></p>
        <p>Course Code: <strong>${payload.course.code}</strong> </p>
        <p>Course Name: <strong>${payload.course.name}</strong> </p>
        <p>Course Session: <strong>${payload.course.session}</strong> </p>
      
        Click <a href=${OfficialURL}>here</a> to sign in
        <p>
        Thanks, <br/>
        Attendlytical
        </p>
    `;
};

module.exports.WithdrawCourse = (firstName, payload) => {
  console.log(payload);
  return `
    <p>Hi ${firstName}, </p>

    <p>
      A student had withdrawn from your course below. 
    </p>
    
    <p>---------------------Student Detail---------------------</p>
    <p>First Name: <strong>${payload.student.firstName}</strong></p>
    <p>Last Name: <strong>${payload.student.lastName}</strong> </p>
    <p>Matric No: <strong>${payload.student.cardID}</strong> </p>
    <p>Email: <strong>${payload.student.email}</strong> </p>
    <br />
    <p>---------------------Enrolled Course Detail---------------------</p>
    <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
    <p>Course Owner: <strong>You</strong></p>
    <p>Course Code: <strong>${payload.course.code}</strong> </p>
    <p>Course Name: <strong>${payload.course.name}</strong> </p>
    <p>Course Session: <strong>${payload.course.session}</strong> </p>

    Click <a href=${OfficialURL}>here</a> to sign in
    <p>
    Thanks, <br/>
    Attendlytical
    </p>
      `;
};
