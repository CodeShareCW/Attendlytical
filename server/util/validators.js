module.exports.validateRegisterInput = (
  firstName,
  lastName,
  email,
  cardID,
  password,
  confirmPassword
) => {
  const errors = {};

  if (firstName.trim() === "") {
    errors.firstName = "First name must not be empty";
  }

  if (lastName.trim() === "") {
    errors.lastName = "Last name must not be empty";
  }
  
  if (cardID.trim() === "") {
    errors.lastName = "CardID must not be empty";
  }

  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (password === "") {
    errors.password = "Password must not empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }


  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateCourseInput = (code, name, session) => {
  const errors = {};
  if (code.trim() === "") {
    errors.code = "Course Code must not be empty";
  }
  if (name.trim() === "") {
    errors.name = "Course name must not be empty";
  }
  if (session.trim() === "") {
    errors.section = "Course session must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateAttendanceInput = (date, time) => {
  const errors = {};
  if (date.trim() === "") {
    errors.start = "Date must not be empty";
  }
  if (time.trim() === "") {
    errors.end = "Time must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
