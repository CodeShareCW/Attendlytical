import jwtDecode from 'jwt-decode';
import React, { createContext, useReducer } from 'react';
import { actionTypes } from '../globalData';

const initialState = {
  user: null,
  avatarColor: {
    backgroundColor: `rgb(${Math.random() * 150 + 30}, ${
      Math.random() * 150 + 30
    }, ${Math.random() * 150 + 30})`,
  },
};

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOGIN_ACTION:
      return {
        ...state,
        user: action.payload,
      };
    case actionTypes.EDIT_PROFILE_ACTION:
      return {
        ...state,
        user: action.updated,
      };
    case actionTypes.LOGOUT_ACTION:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem('jwtToken', userData.token);
    dispatch({
      type: actionTypes.LOGIN_ACTION,
      payload: userData,
    });
  }

  function editProfile(updated) {
    localStorage.setItem('jwtToken', updated.token);
    dispatch({ type: actionTypes.EDIT_PROFILE_ACTION, updated });
  }

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({ type: actionTypes.LOGOUT_ACTION });
    window.location.reload();
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        avatarColor: state.avatarColor,
        login,
        logout,
        editProfile,
      }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
