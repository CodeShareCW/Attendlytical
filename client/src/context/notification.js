import React, { createContext, useReducer } from "react";
import { actionTypes } from "../globalData";

const initialState = {
  notifications: [],
  uncheckedNotificationCount: 0,
  fetchedDone: false,
  pressedNotification: false,
  isInitialAccess: false,
};

const NotificationContext = createContext({});

function notificationReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_NOTIFICATIONS_DONE_ACTION:
      return {
        ...state,
        fetchedDone: action.done,
      };

    case actionTypes.PRESSED_NOTIFICATION_ACTION:
      return {
        ...state,
        pressedNotification: action.done,
      };

    case actionTypes.SET_IS_INITIAL_ACCESS_ACTION:
      return {
        ...state,
        isInitialAccess: action.done,
      };
      
    case actionTypes.LOAD_NOTIFICATIONS_ACTION:
      return {
        ...state,
        notifications: [...state.notifications, ...action.notifications],
      };
    case actionTypes.SET_UNCHECKED_NOTIFICATION_COUNT_ACTION:
      return {
        ...state,
        uncheckedNotificationCount: action.value,
      };

    case actionTypes.ACCEPT_ENROLMENT_ACTION:
      let approveEnrolment = state.notifications.find(
        (notification) => notification._id === action.notification._id
      );
      if (approveEnrolment) approveEnrolment.status = "accepted";

      return state;

    case actionTypes.REJECT_ENROLMENT_ACTION:
      let rejectedEnrolment = state.notifications.find(
        (notification) => notification._id === action.notification._id
      );
      if (rejectedEnrolment) rejectedEnrolment.status = "rejected";
      return state;
    default:
      return state;
  }
}

function NotificationProvider(props) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  function setIsInitialAccess(done) {
    dispatch({ type: actionTypes.SET_IS_INITIAL_ACCESS_ACTION, done });
  }

  function setFetchedDone(done) {
    dispatch({ type: actionTypes.FETCH_NOTIFICATIONS_DONE_ACTION, done });
  }

  function setPressedNotification(done) {
    dispatch({ type: actionTypes.PRESSED_NOTIFICATION_ACTION, done });
  }

  function setUncheckedNotificationCount(value) {
    dispatch({
      type: actionTypes.SET_UNCHECKED_NOTIFICATION_COUNT_ACTION,
      value,
    });
  }

  function loadNotifications(notifications) {
    dispatch({ type: actionTypes.LOAD_NOTIFICATIONS_ACTION, notifications });
  }

  function approveEnrolment(notification) {
    dispatch({ type: actionTypes.ACCEPT_ENROLMENT_ACTION, notification });
  }

  function rejectEnrolment(notification) {
    dispatch({ type: actionTypes.REJECT_ENROLMENT_ACTION, notification });
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        uncheckedNotificationCount: state.uncheckedNotificationCount,
        fetchedDone: state.fetchedDone,
        pressedNotification: state.pressedNotification,
        isInitialAccess: state.isInitialAccess,

        setIsInitialAccess,
        setPressedNotification,
        loadNotifications,
        setUncheckedNotificationCount,
        setFetchedDone,
        approveEnrolment,
        rejectEnrolment,
      }}
      {...props}
    />
  );
}

export { NotificationContext, NotificationProvider };

