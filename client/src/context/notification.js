import React, { useReducer, createContext } from "react";

const initialState = {
  notifications: [],
  uncheckedNotificationCount: 0,
  fetchedDone: false,
  pressedNotification: false,
};

const NotificationContext = createContext({});

function notificationReducer(state, action) {
  switch (action.type) {
    case "FETCH_DONE":
      return {
        ...state,
        fetchedDone: action.done,
      };
    case "ALREADY_CLICK_NOTIFICATION_BUTTON":
      return {
        ...state,
        pressedNotification: action.value
      }
    case "LOAD_NOTIFICATIONS":
      return {
        ...state,
        notifications: [...state.notifications, ...action.notifications],
      };
    case "SET_UNCHECKED_NOTIFICATION_COUNT":
      return {
        ...state,
        uncheckedNotificationCount: action.value,
      };

    case "ACCEPT_ENROLMENT":
      let approveEnrolment = state.notifications.find(
        (notification) => notification._id === action.notification._id
      );
      if (approveEnrolment) approveEnrolment.status = "accepted";

      return state;

    case "REJECT_ENROLMENT":
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

  function setFetchedDone(done) {
    dispatch({ type: "FETCH_DONE", done });
  }

  function setPressedNotification(value){
    dispatch({ type: "ALREADY_CLICK_NOTIFICATION_BUTTON", value });
  }

  function setUncheckedNotificationCount(value) {
    dispatch({ type: "SET_UNCHECKED_NOTIFICATION_COUNT", value });
  }

  function loadNotifications(notifications) {
    dispatch({ type: "LOAD_NOTIFICATIONS", notifications });
  }

  function approveEnrolment(notification) {
    dispatch({ type: "ACCEPT_ENROLMENT", notification });
  }

  function rejectEnrolment(notification) {
    dispatch({ type: "REJECT_ENROLMENT", notification });
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        uncheckedNotificationCount: state.uncheckedNotificationCount,
        fetchedDone: state.fetchedDone,
        pressedNotification:state.pressedNotification,

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
