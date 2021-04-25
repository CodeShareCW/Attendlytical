import { useMutation } from "@apollo/react-hooks";
import { Card, Form, Layout, message, Row, Select, Typography } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FaceThresholdDistanceContext } from "../../../context";
import { CheckError } from "../../../utils/ErrorHandling";
import {
  getFullFaceDescription,
  isFaceDetectionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
} from "../../../faceUtil";
import {
  DEFAULT_WEBCAM_RESOLUTION,
  inputSize,
  webcamResolutionType,
} from "../../../globalData";
import { CREATE_TRX_MUTATION } from "../../../graphql/mutation";
import { drawRectAndLabelFace } from "../../../utils/drawRectAndLabelFace";
import ModelLoading from "../../../utils/ModelLoading";
import ModelLoadStatus from "../../../utils/ModelLoadStatus";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

export default (props) => {
  const { participants, faceMatcher, facePhotos } = props;

  const { threshold } = useContext(FaceThresholdDistanceContext);

  const webcamRef = useRef();
  const canvasRef = useRef();

  const [selectedWebcam, setSelectedWebcam] = useState();

  const [inputDevices, setInputDevices] = useState([]);
  const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
  const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);

  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingMessageError, setLoadingMessageError] = useState("");
  const [fullDesc, setFullDesc] = useState(null);
  const [waitText, setWaitText] = useState("");

  const [ createTrxCallback ] = useMutation(
    CREATE_TRX_MUTATION,
    {
      update(_, { data }) {
        if (data.createTrx != "") message.success(data.createTrx);
      },
      onError(err) {
        CheckError(err);
      },
    }
  );

  useEffect(() => {
    async function loadingtheModel() {
      await loadModels(setLoadingMessage, setLoadingMessageError);
      setIsAllModelLoaded(true);
    }
    if (
      !!isFaceDetectionModelLoaded() &&
      !!isFacialLandmarkDetectionModelLoaded() &&
      !!isFeatureExtractionModelLoaded()
    ) {
      setIsAllModelLoaded(true);
      return;
    }
    loadingtheModel();
  }, [isAllModelLoaded]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === "videoinput"
      );
      setInputDevices({ ...inputDevices, inputDevice });
    });
  }, []);

  useEffect(() => {
    function capture() {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set canvas height and width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // 4. TODO - Make Detections
        // e.g. const obj = await net.detect(video);

        // Draw mesh
        getFullFaceDescription(webcamRef.current.getScreenshot(), inputSize)
          .then((data) => {
            setFullDesc(data);
            setWaitText("");
          })
          .catch((err) => {
            setWaitText(
              "Preparing face matcher and device setup, please wait..."
            );
          });
        const ctx = canvasRef.current.getContext("2d");

        drawRectAndLabelFace(fullDesc, faceMatcher, participants, ctx);

        if (!!fullDesc) {
          console.log("Now got full desc");
          fullDesc.map((desc) => {
            const bestMatch = faceMatcher.findBestMatch(desc.descriptor);
            console.log(bestMatch);
            if (bestMatch._label != "unknown") {
              createTrxCallback({
                variables: {
                  attendanceID: props.match.params.attendanceID,
                  studentID: bestMatch._label,
                },
              });
              console.log("Saving in db now");
            }
          });
        }
      }
    }

    let interval = setInterval(() => {
      capture();
    }, 700);

    return () => clearInterval(interval);
  });

  const handleSelectWebcam = (value) => {
    setSelectedWebcam(value);
  };

  const handleWebcamResolution = (value) => {
    webcamResolutionType.map((type) => {
      if (value === type.label) {
        setCamWidth(type.width);
        setCamHeight(type.height);
      }
    });
  };

  return (
    <Content>
      <Card>
        <Form>
          <Form.Item label="Webcam">
            <Select
              defaultValue="Select Webcam"
              style={{ width: 500 }}
              onChange={handleSelectWebcam}
            >
              {inputDevices?.inputDevice?.map((device) => (
                <Option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Webcam Size">
            <Select
              defaultValue={DEFAULT_WEBCAM_RESOLUTION.label}
              style={{ width: 200 }}
              onChange={handleWebcamResolution}
            >
              {webcamResolutionType.map((type) => (
                <Option key={type.label} value={type.label}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <Card>
          <Row>Face Descriptor Matcher: {facePhotos.length}</Row>
          <Row>Threshold Distance: {threshold}</Row>
        </Card>

        {facePhotos.length === 0 && (
          <p className="alert">No have any face matcher.</p>
        )}
        <ModelLoadStatus errorMessage={loadingMessageError} />

        {!isAllModelLoaded ? (
          <ModelLoading loadingMessage={loadingMessage} />
        ) : loadingMessageError ? (
          <div className="error">{loadingMessageError}</div>
        ) : (
          <div></div>
        )}

        {isAllModelLoaded && loadingMessageError.length == 0 && (
          <Card className="takeAttendance__card__webcam">
            <>
              <p>{waitText}</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Webcam
                  muted={true}
                  ref={webcamRef}
                  audio={false}
                  width={camWidth}
                  height={camHeight}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    deviceId: selectedWebcam,
                  }}
                  mirrored
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: "absolute",
                    textAlign: "center",
                    zindex: 8,
                    width: camWidth,
                    height: camHeight,
                  }}
                />
              </div>
            </>
          </Card>
        )}
      </Card>
    </Content>
  );
};
