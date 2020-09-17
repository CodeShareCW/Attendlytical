import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function ProtectedRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to='/dashboard' /> : <Component {...props} />
      }
    />
  );
}

export default ProtectedRoute;
