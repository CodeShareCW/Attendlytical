module.exports.Welcome = (firstName) => {
  return `
        <p>Dear ${firstName}: </p>
        <p>Thank you for signing up Face In! Do send me an email to:
        <a href="mailto:faceinattendanceapp@gmail.com">faceinattendanceapp@gmail.com</a></p>
        if you have any inquiry, suggestion or found bug.<p>Thank you again and have a nice day ahead!</p>
        <i>Note: This mail is auto-generated for every signup</i>
        <p>
        Best regards, <br/>
        Face In
        </p>
    `;
};

module.exports.EnrolRequest = (firstName, payload) => {
  console.log(payload);
  return `
          <p>Dear ${firstName}: </p>

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

          Click <a href="https://www.google.com">here</a> to sign in
          <p>
          Best regards, <br/>
          Face In
          </p>
      `;
};

module.exports.ApproveEnrolment = (firstName, payload) => {
  console.log(payload);
  return `
        <p>Dear ${firstName}: </p>
        <p>
          Your enrolment to the course below had been approved. 
        </p>
        
        <p>---------------------Course Detail---------------------</p>
        <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
        <p>Course Owner: <strong>${payload.owner.firstName} ${payload.owner.lastName}</strong></p>
        <p>Course Code: <strong>${payload.course.code}</strong> </p>
        <p>Course Name: <strong>${payload.course.name}</strong> </p>
        <p>Course Session: <strong>${payload.course.session}</strong> </p>
        
        Click <a href="https://www.google.com">here</a> to sign in
        <p>
        Best regards, <br/>
        Face In
        </p>
    `;
};

module.exports.WarnStudent = (firstName, payload) => {
  console.log(payload);
  return `
        <p>Dear ${firstName}: </p>
        <p>
          Course owner warned about your attendance (20%) in the course below. 
        </p>
        
        <p>---------------------Course Detail---------------------</p>
        <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
        <p>Course Owner: <strong>${payload.owner.firstName} ${payload.owner.lastName}</strong></p>
        <p>Course Code: <strong>${payload.course.code}</strong> </p>
        <p>Course Name: <strong>${payload.course.name}</strong> </p>
        <p>Course Session: <strong>${payload.course.session}</strong> </p>
        
        Click <a href="https://www.google.com">here</a> to sign in
        <p>
        Best regards, <br/>
        Face In
        </p>
    `;
};

module.exports.KickStudent = (firstName, payload) => {
  console.log(payload);
  return `
        <p>Dear ${firstName}: </p>
        <p>
          Course owner had kicked you out from the course below. 
        </p>
        
        <p>---------------------Course Detail---------------------</p>
        <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
        <p>Course Owner: <strong>${payload.owner.firstName} ${payload.owner.lastName}</strong></p>
        <p>Course Code: <strong>${payload.course.code}</strong> </p>
        <p>Course Name: <strong>${payload.course.name}</strong> </p>
        <p>Course Session: <strong>${payload.course.session}</strong> </p>
        
        Click <a href="https://www.google.com">here</a> to sign in
        <p>
        Best regards, <br/>
        Face In
        </p>
    `;
};

module.exports.DeleteCourse = (firstName, payload) => {
  console.log(payload);
  return `
        <p>Dear ${firstName}: </p>
        <p>
          Course owner had deleted the course below, hence disappeared in your enrolled course list. Sayonara.
        </p>
      
        <p>---------------------Course Detail---------------------</p>
        <p>Course ID: <strong>${payload.course.shortID}</strong> </p>
        <p>Course Owner: <strong>${payload.owner.firstName} ${payload.owner.lastName}</strong></p>
        <p>Course Code: <strong>${payload.course.code}</strong> </p>
        <p>Course Name: <strong>${payload.course.name}</strong> </p>
        <p>Course Session: <strong>${payload.course.session}</strong> </p>
      
        Click <a href="https://www.google.com">here</a> to sign in
        <p>
        Best regards, <br/>
        Face In
        </p>
    `;
};
