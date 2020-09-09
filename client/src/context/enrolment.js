import React, { createContext, useReducer } from "react";
import { actionTypes } from "../globalData";

const initialState = {
  enrolments: [],
  initialCountDone: false,
  enrolCount: 0,
  fetchedDone: false,
};

const EnrolmentContext = createContext({});

function enrolmentReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_INITIALCOUNTDONE_ACTION:
      return {
        ...state,
        initialCountDone: action.done
      };

    case actionTypes.GET_ENROLCOUNT_ACTION:
      return {
        ...state,
        enrolCount: action.count
      };
    case actionTypes.FETCH_ENROLMENTS_DONE_ACTION:
      return {
        ...state,
        fetchedDone: action.done,
      };
    case actionTypes.LOAD_ENROLMENTS_ACTION:
      return {
        ...state,
        enrolments: [...state.enrolments, ...action.enrolments],
      };

    case actionTypes.ACCEPT_ENROLMENT_ACTION:
      var updatedEnrolments = state.enrolments.filter(
        (enrolment) => enrolment._id !== action.enrolment._id
      );

      return {
        ...state,
        enrolments: updatedEnrolments,
      };

    case actionTypes.REJECT_ENROLMENT_ACTION:
      var updatedEnrolments = state.enrolments.filter(
        (enrolment) => enrolment._id !== action.enrolment._id
      );

      return {
        ...state,
        enrolments: updatedEnrolments,
      };
    default:
      return state;
  }
}

function EnrolmentProvider(props) {
  const [state, dispatch] = useReducer(enrolmentReducer, initialState);

  function setInitialCountDone(done) {
    dispatch({ type: actionTypes.SET_INITIALCOUNTDONE_ACTION, done });
  }

  function setEnrolCount(count) {
    dispatch({ type: actionTypes.GET_ENROLCOUNT_ACTION, count });
  }

  function setFetchedDone(done) {
    dispatch({ type: actionTypes.FETCH_ENROLMENTS_DONE_ACTION, done });
  }

  function loadEnrolments(enrolments) {
    dispatch({ type: actionTypes.LOAD_ENROLMENTS_ACTION, enrolments });
  }

  function approveEnrolment(enrolment) {
    dispatch({ type: actionTypes.ACCEPT_ENROLMENT_ACTION, enrolment });
  }

  function rejectEnrolment(enrolment) {
    dispatch({ type: actionTypes.REJECT_ENROLMENT_ACTION, enrolment });
  }

  return (
    <EnrolmentContext.Provider
      value={{
        enrolments: state.enrolments,
        initialCountDone: state.initialCountDone,
        enrolCount: state.enrolCount,
        fetchedDone: state.fetchedDone,

        setInitialCountDone,
        setEnrolCount,
        loadEnrolments,
        setFetchedDone,
        approveEnrolment,
        rejectEnrolment,
      }}
      {...props}
    />
  );
}

export { EnrolmentContext, EnrolmentProvider };

