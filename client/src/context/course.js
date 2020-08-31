import React, { useReducer, createContext } from "react";

const initialState = {
  courses: [],
  fetchedDone: false,
};

const CourseContext = createContext({});

function courseReducer(state, action) {
  switch (action.type) {
    case "FETCHED_DONE":
      return {
        ...state,
        fetchedDone: action.done,
      };
    case "LOAD_COURSES":
      return {
        ...state,
        courses: [...state.courses, ...action.courses],
      };

    case "ADD_COURSE":
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
    case "DELETE_COURSE":
      let newCourses = [...state.courses];
      newCourses = newCourses.filter((course) => course._id !== action._id);

      return {
        ...state,
        courses: newCourses,
      };
    case "ENROL_COURSE":
      return {
        ...state,
      };
    case "WITHDRAW_COURSE":
      return {
        ...state,
      };

    default:
      return state;
  }
}

function CourseProvider(props) {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  function loadCourses(courses) {
    dispatch({ type: "LOAD_COURSES", courses });
  }

  function setFetchedDone(done) {
    dispatch({ type: "FETCHED_DONE", done });
  }

  function addCourse(course) {
    dispatch({
      type: "ADD_COURSE",
      course,
    });
  }

  function deleteCourse(_id) {
    dispatch({ type: "DELETE_COURSE", _id });
  }

  return (
    <CourseContext.Provider
      value={{
        courses: state.courses,
        fetchedDone: state.fetchedDone,
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
