import React, { createContext, useReducer } from 'react';
import { actionTypes } from '../globalData';

const initialState = {
  enrolments: [],
  newEnrolments: [],
  initialCountDone: false,
  enrolCount: 0,
  fetchedDone: false,
  initialAccess: true,
};

const EnrolmentContext = createContext({});

function enrolmentReducer(state, action) {
  switch (action.type) {
    case actionTypes.GET_ENROLCOUNT_ACTION:
      if (!state.initialCountDone) {
        return {
          ...state,
          enrolCount: action.count,
          initialCountDone: true,
        };
      }
      return {
        ...state,
      };
    case actionTypes.SET_ENROLCOUNT_ACTION:
      return {
        ...state,
        enrolCount: action.count,
      };

    case actionTypes.FETCH_DONE_ACTION:
      return {
        ...state,
        fetchedDone: action.done,
      };
    case actionTypes.LOAD_ENROLMENTS_ACTION:
      var updatedEnrolments = [...state.newEnrolments, ...action.enrolments];
      return {
        ...state,
        enrolments: updatedEnrolments,
        initialAccess: false,
      };

    case actionTypes.ENROL_COURSE_ACTION:
      if (state.initialAccess) return { ...state };
      return {
        ...state,
        newEnrolments: [action.enrolment, ...state.newEnrolments],
      };

    default:
      return state;
  }
}

function EnrolmentProvider(props) {
  const [state, dispatch] = useReducer(enrolmentReducer, initialState);

  function getEnrolCount(count) {
    dispatch({ type: actionTypes.GET_ENROLCOUNT_ACTION, count });
  }

  function setEnrolCount(count) {
    dispatch({ type: actionTypes.SET_ENROLCOUNT_ACTION, count });
  }

  function setFetchedDone(done) {
    dispatch({ type: actionTypes.FETCH_DONE_ACTION, done });
  }

  function loadEnrolments(enrolments) {
    dispatch({ type: actionTypes.LOAD_ENROLMENTS_ACTION, enrolments });
  }

  function enrolCourse(enrolment) {
    dispatch({ type: actionTypes.ENROL_COURSE_ACTION, enrolment });
  }

  return (
    <EnrolmentContext.Provider
      value={{
        enrolments: state.enrolments,
        enrolCount: state.enrolCount,
        fetchedDone: state.fetchedDone,
        initialCountDone: state.initialCountDone,
        getEnrolCount,
        setEnrolCount,
        loadEnrolments,
        setFetchedDone,
        enrolCourse,
      }}
      {...props}
    />
  );
}

export { EnrolmentContext, EnrolmentProvider };
