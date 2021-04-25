import { useQuery } from "@apollo/react-hooks";
import { notification } from "antd";
import React, { useContext, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { CheckError } from "../utils/ErrorHandling";
import { FETCH_FACE_PHOTOS_COUNT_QUERY } from "../graphql/query";

function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  //get uploaded photos query
  const facePhotosCountQuery = useQuery(FETCH_FACE_PHOTOS_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });

  //check amount of uploaded photo to notify student
  useEffect(() => {
    if (user && user.userLevel === 0)
      if (facePhotosCountQuery.data)
        if (facePhotosCountQuery.data.getFacePhotosCount < 2) {
          notification["info"]({
            message: (
              <strong>
                Please add your face photograph for at least 2<br />
                <br />
              </strong>
            ),
            description: `Number of face photograph uploaded: ${facePhotosCountQuery.data.getFacePhotosCount}`,
          });
          if (
            window.location.pathname != "/notification" &&
            window.location.pathname != "/facegallery"
          )
            window.location.href = "/facegallery";
        }
  }, [facePhotosCountQuery]);
  return (
    <Route
      {...rest}
      render={(props) =>
        user && (user.userLevel === 0 || user.userLevel === 1) ? (
          <Component {...props} />
        ) : user && user.userLevel === -1 ? (
          <Redirect to="/aboutYourself" />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

export default AuthRoute;
