import React, { createContext, useReducer } from "react";
import { actionTypes } from "../globalData";

const initialState = {
  facePhotos: [],
  newFacePhotos: [],
  removeFacePhotos: [],
  fetchedDone: false,
  initialState: false,
};

const FacePhotoContext = createContext({});

function facePhotoReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_DONE_ACTION:
      return {
        ...state,
        fetchedDone: action.done,
      };
    case actionTypes.LOAD_FACE_PHOTOS_ACTION:
      var updatedFacePhotos = [
        ...state.newFacePhotos,
        ...action.facePhotos,
      ].filter((facePhoto) => !state.removeFacePhotos.includes(facePhoto));

      return {
        ...state,
        facePhotos: updatedFacePhotos,
        initialState: true,
      };

    default:
      return state;
  }
}

function FacePhotoProvider(props) {
  const [state, dispatch] = useReducer(facePhotoReducer, initialState);

  function setFetchedDone(done) {
    dispatch({ type: actionTypes.FETCH_DONE_ACTION, done });
  }

  function loadFacePhotos(facePhotos) {
    dispatch({ type: actionTypes.LOAD_FACE_PHOTOS_ACTION, facePhotos });
  }

  return (
    <FacePhotoContext.Provider
      value={{
        facePhotos: state.facePhotos,
        fetchedDone: state.fetchedDone,

        loadFacePhotos,
        setFetchedDone,
      }}
      {...props}
    />
  );
}

export { FacePhotoContext, FacePhotoProvider };
