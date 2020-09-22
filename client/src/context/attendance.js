import React, { createContext, useReducer } from 'react';
import { actionTypes } from '../globalData';

const initialState = {
  attendances: [],
  newAttendances: [],
  initialAccess: true,
};

const AttendanceContext = createContext({});

function attendanceReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOAD_ATTENDANCES_ACTION:
      return {
        ...state,
        attendances: [...state.newAttendances, ...action.attendances],
        initialAccess: false,
      };

    case actionTypes.ADD_ATTENDANCE_ACTION:
      //here we check whether the attendances is not fully loaded, mean the attendance should be included in the fetch
      if (state.initialAccess) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        newAttendances: [action.attendance, ...state.newAttendances],
      };

    case actionTypes.RESET_STATE_ACTION:
      return {
        ...state,
        attendances: [],
        newAttendances: []
      };

    default:
      return state;
  }
}

function AttendanceProvider(props) {
  const [state, dispatch] = useReducer(attendanceReducer, initialState);

  function loadAttendances(attendances) {
    dispatch({ type: actionTypes.LOAD_ATTENDANCES_ACTION, attendances });
  }

  function addAttendance(attendance) {
    dispatch({
      type: actionTypes.ADD_ATTENDANCE_ACTION,
      attendance,
    });
  }

  function resetState(attendance) {
    dispatch({
      type: actionTypes.RESET_STATE_ACTION,
      attendance,
    });
  }

  return (
    <AttendanceContext.Provider
      value={{
        attendances: state.attendances,
        loadAttendances,
        addAttendance,
        resetState
      }}
      {...props}
    />
  );
}

export { AttendanceContext, AttendanceProvider };
