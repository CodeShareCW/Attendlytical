import * as faceapi from "face-api.js";

const maxDescriptorDistance = 0.5;

export async function loadModels(setLoadingMessage, setLoadedModel,  setLoadingMessageError) {
  const MODEL_URL = process.env.PUBLIC_URL + "/models";

  try {
    setLoadingMessage("Loading Face Detector");
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    setLoadedModel(prevState=>[...prevState, "FD"]);

    setLoadingMessage("Loading 68 Facial Landmark Detector");
    await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
    setLoadedModel(prevState=>[...prevState, "FLD"]);

    setLoadingMessage("Loading Feature Extractor");
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    setLoadedModel(prevState=>[...prevState, "FR"]);

    setLoadingMessage("Loading Facial Expression Detector");
    await faceapi.loadFaceExpressionModel(MODEL_URL);
    setLoadedModel(prevState=>[...prevState, "FE"]);

  } catch (err) {
    setLoadingMessageError(
      "Model loading failed. Please contact me about the bug: faceinattendanceapp@gmail.com"
    );
  }
}

export async function getFullFaceDescription(blob, inputSize = 512) {
  // tiny_face_detector options
  let scoreThreshold = 0.8;
  const OPTION = new faceapi.SsdMobilenetv1Options({
    inputSize,
    scoreThreshold,
  });
  const useTinyModel = true;

  // fetch image to api
  let img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  let fullDesc = await faceapi
    .detectAllFaces(img, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceExpressions()
    .withFaceDescriptors();
  console.log("face", fullDesc)
  return fullDesc;
}

export async function createMatcher(faceProfile) {
  // Create labeled descriptors of member from profile
  let members = Object.keys(faceProfile);
  let labeledDescriptors = members.map(
    (member) =>
      new faceapi.LabeledFaceDescriptors(
        faceProfile[member].name,
        faceProfile[member].descriptors.map(
          (descriptor) => new Float32Array(descriptor)
        )
      )
  );

  // Create face matcher (maximum descriptor distance is 0.5)
  let faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance
  );
  return faceMatcher;
}

export function isFaceDetectionModelLoaded() {
  return !!faceapi.nets.tinyFaceDetector.params;
}
