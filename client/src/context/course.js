import React, { createContext, useReducer } from "react";
import { actionTypes } from "../globalData";

const initialState = {
  courses: [],
  isInitialAccess: false,
  fetchedDone: false,
};

const CourseContext = createContext({});

function courseReducer(state, action) {
  switch (action.type) {

    case actionTypes.SET_IS_INITIAL_ACCESS_ACTION:
      return {
        ...state,
        isInitialAccess: action.done,
      };

    case actionTypes.FETCH_COURSES_DONE_ACTION:
      return {
        ...state,
        fetchedDone: action.done,
      };
    case actionTypes.LOAD_COURSES_ACTION:
      return {
        ...state,
        courses: [...state.courses, ...action.courses],
      };

    case actionTypes.ADD_COURSE_ACTION:
      console.log(state);
      if (state.courses) {
        return {
          ...state,
          courses: [action.course, ...state.courses],
        };
      }
      return {
        ...state,
        courses: [action.course],
      };
    case actionTypes.DELETE_COURSE_ACTION:
      let newCourses = [...state.courses];
      newCourses = newCourses.filter((course) => course._id !== action._id);

      return {
        ...state,
        courses: newCourses,
      };
    case actionTypes.ENROL_COURSE_ACTION:
      return {
        ...state,
      };
    case actionTypes.WITHDRAW_COURSE_ACTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}

function CourseProvider(props) {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  function setIsInitialAccess(done) {
    dispatch({ type: actionTypes.SET_IS_INITIAL_ACCESS_ACTION, done });
  }

  function loadCourses(courses) {
    dispatch({ type: actionTypes.LOAD_COURSES_ACTION, courses });
  }

  function setFetchedDone(done) {
    dispatch({ type: actionTypes.FETCH_COURSES_DONE_ACTION, done });
  }

  function addCourse(course) {
    dispatch({
      type: actionTypes.ADD_COURSE_ACTION,
      course,
    });
  }

  function deleteCourse(_id) {
    dispatch({ type: actionTypes.DELETE_COURSE_ACTION, _id });
  }

  return (
    <CourseContext.Provider
      value={{
        courses: state.courses,
        fetchedDone: state.fetchedDone,
        isInitialAccess: state.isInitialAccess,
        setIsInitialAccess,
        setFetchedDone,
        loadCourses,
        addCourse,
        deleteCourse
      }}
      {...props}
    />
  );
}

export { CourseContext, CourseProvider };

