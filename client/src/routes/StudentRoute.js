import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../context/auth";

function StudentRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        user && user.userLevel === 0 ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

export default StudentRoute;
