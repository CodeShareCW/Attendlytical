import React, { createContext, useReducer } from 'react';
import { actionTypes } from '../globalData';

const initialState = {
  courses: [],
  newCourses: [],
  fetchedDone: false,
  initialAccess: true
};

const CourseContext = createContext({});

function courseReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_DONE_ACTION:
      return {
        ...state,
        fetchedDone: action.done,
      };

    case actionTypes.LOAD_COURSES_ACTION:
      return {
        ...state,
        courses: [...state.newCourses, ...action.courses],
        initialAccess: false
      };

    case actionTypes.ADD_COURSE_ACTION:
      //here we check whether the courses is not fully loaded, mean the course should be included in the fetch
      if (state.initialAccess) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        newCourses: [action.course, ...state.newCourses],
      };
  }
}

function CourseProvider(props) {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  function loadCourses(courses) {
    dispatch({ type: actionTypes.LOAD_COURSES_ACTION, courses });
  }

  function setFetchedDone(done) {
    dispatch({ type: actionTypes.FETCH_DONE_ACTION, done });
  }

  function addCourse(course) {
    dispatch({
      type: actionTypes.ADD_COURSE_ACTION,
      course,
    });
  }

  return (
    <CourseContext.Provider
      value={{
        courses: state.courses,
        fetchedDone: state.fetchedDone,
        setFetchedDone,
        loadCourses,
        addCourse,
      }}
      {...props}
    />
  );
}

export { CourseContext, CourseProvider };
