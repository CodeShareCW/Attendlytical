import React, { createContext, useReducer } from 'react';
import { actionTypes } from '../globalData';

const initialState = {
  notifications: [],
  uncheckedNotificationCount: 0,
  fetchedDone: false,
  pressedNotification: false,
};

const NotificationContext = createContext({});

function notificationReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_DONE_ACTION:
      return {
        ...state,
        fetchedDone: action.done,
      };

    case actionTypes.PRESSED_NOTIFICATION_ACTION:
      return {
        ...state,
        pressedNotification: action.done,
      };

    case actionTypes.LOAD_NOTIFICATIONS_ACTION:
      return {
        ...state,
        notifications: [...action.notifications],
      };
    case actionTypes.SET_UNCHECKED_NOTIFICATION_COUNT_ACTION:
      return {
        ...state,
        uncheckedNotificationCount: action.value,
      };

    default:
      return state;
  }
}

function NotificationProvider(props) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  function setFetchedDone(done) {
    dispatch({ type: actionTypes.FETCH_DONE_ACTION, done });
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

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        uncheckedNotificationCount: state.uncheckedNotificationCount,
        fetchedDone: state.fetchedDone,
        pressedNotification: state.pressedNotification,
        setPressedNotification,
        loadNotifications,
        setUncheckedNotificationCount,
        setFetchedDone,
      }}
      {...props}
    />
  );
}

export { NotificationContext, NotificationProvider };
