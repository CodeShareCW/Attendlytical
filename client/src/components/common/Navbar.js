/*
  Specify navbar of user level
*/

//react
import React, { useContext } from "react";
import { Link } from "react-router-dom";

//context
import { AuthContext } from "../../context/auth";

//comp
import LecturerSiderNavbar from "../lecturerComponent/LecturerSiderNavbar";
import StudentSiderNavbar from "../studentComponent/StudentSiderNavbar";

export default () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Link to="/testing" style={{fontSize: "50px"}}>Testing</Link>

      {user.userLevel == 0 ? <StudentSiderNavbar /> : <LecturerSiderNavbar />}
    </>
  );
};
