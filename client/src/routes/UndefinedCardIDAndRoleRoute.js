import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

export default ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);
  console.log(rest)
  return (    
    <Route
      render={(props) =>
        user && user.userLevel==-1 ? (
          <Component {...props} />
        ) : (
          <Redirect to='/' />
        )
      }
    />
  );
};
