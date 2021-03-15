import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Col,
  Layout,
  message,
  Row,
  Slider,
  Typography,
} from "antd";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Prompt } from "react-router";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import {
  AttendanceContext,
  FaceThresholdDistanceContext,
} from "../../../context";
import { CheckError, ErrorComp } from "../../../ErrorHandling";
import {
  createMatcher,
  getFullFaceDescription,
  isFaceDetectionModelLoaded,
  isFacialExpressionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
} from "../../../faceUtil";
import WebcamFR from "../../../faceUtil/WebcamFR";
import {
  DEFAULT_WEBCAM_RESOLUTION,
  inputSize,
  webcamResolutionType,
} from "../../../globalData";
import { CREATE_ATTENDANCE_MUTATION } from "../../../graphql/mutation";
import { FETCH_FACE_MATCHER_IN_COURSE_QUERY } from "../../../graphql/query";
import ModelLoading from "../../../utils/ModelLoading";
import ModelLoadStatus from "../../../utils/ModelLoadStatus";
import AttendanceForm from "./attendanceForm";
import ParticipantAttendanceDisplay from "./ParticipantAttendanceDisplay";
import "./TakeAttendance.css";

const { Title } = Typography;
const { Content } = Layout;

export default (props) => {
  const { addAttendance } = useContext(AttendanceContext);
  const { threshold, setFaceThresholdDistance } = useContext(
    FaceThresholdDistanceContext
  );

  const webcam = useRef();

  const [selectedWebcam, setSelectedWebcam] = useState();
  const [selectedDate, setSelectedDate] = useState(moment().toISOString());
  const [selectedTime, setSelectedTime] = useState(moment().toISOString());

  const [inputDevices, setInputDevices] = useState([]);
  const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
  const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);

  const [course, setCourse] = useState({});
  const [participants, setParticipants] = useState([]);
  const [facePhotos, setFacePhotos] = useState([]);
  const [absentees, setAbsentees] = useState([]);

  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingMessageError, setLoadingMessageError] = useState("");

  const [detectionCount, setDetectionCount] = useState(0);

  const [faceMatcher, setFaceMatcher] = useState(null);
  const [fullDesc, setFullDesc] = useState(null);

  const [isAttendanceSubmit, setIsAttendanceSubmit] = useState(false);

  const [waitText, setWaitText] = useState("");

  const { data, loading, error } = useQuery(
    FETCH_FACE_MATCHER_IN_COURSE_QUERY,
    {
      onCompleted: async (data) => {
        setCourse(data.getFaceMatcherInCourse.course);
        setParticipants(data.getFaceMatcherInCourse.matcher);
        setAbsentees(data.getFaceMatcherInCourse.matcher);
        data.getFaceMatcherInCourse.matcher.map((item) => {
          item.facePhotos.map((photo) =>
            setFacePhotos((prevState) => [...prevState, photo])
          );
        });

        if (data.getFaceMatcherInCourse.matcher.length === 0) {
          message.info("Course do not have any participant yet!");
        }
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        courseID: props.match.params.id,
      },
    }
  );

  const [submitAttendanceCallback, submitAttendanceStatus] = useMutation(
    CREATE_ATTENDANCE_MUTATION,
    {
      onCompleted(data) {
        setIsAttendanceSubmit(true);
        addAttendance(data.createAttendance);
        message.success("Success Submit.");
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        date: selectedDate,
        time: selectedTime,
        courseID: data?.getFaceMatcherInCourse.course._id,
        absentees: absentees.map((absentee) => absentee.student._id),
        participants: participants.map(
          (participant) => participant.student._id
        ),
        attendees: participants
          .filter((participant) => !absentees.includes(participant))
          .map((participant) => participant.student._id),
        expressions: participants
          .filter((participant) => !absentees.includes(participant))
          .map((participant) => participant.expression),
      },
    }
  );

  useEffect(() => {
    async function loadingtheModel() {
      console.log(isFaceDetectionModelLoaded());
      await loadModels(setLoadingMessage, setLoadingMessageError);
      setIsAllModelLoaded(true);
    }
    if (
      !!isFaceDetectionModelLoaded() &&
      !!isFacialLandmarkDetectionModelLoaded() &&
      !!isFeatureExtractionModelLoaded() &&
      !!isFacialExpressionModelLoaded()
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
    async function matcher() {
      //check there should be at least one matcher
      if (
        data.getFaceMatcherInCourse.matcher.length > 0 &&
        facePhotos.length > 0
      ) {
        const validMatcher = data.getFaceMatcherInCourse.matcher.filter(
          (m) => m.facePhotos.length > 0
        );
        const profileList = await createMatcher(validMatcher, threshold);
        setFaceMatcher(profileList);
      }
    }
    if (!!data) {
      matcher();
    }
  }, [data, facePhotos, threshold]);

  useEffect(() => {
    function capture() {
      if (!!webcam.current) {
        getFullFaceDescription(webcam.current.getScreenshot(), inputSize)
          .then((data) => {
            setFullDesc(data);
            setWaitText("");
          })
          .catch((err) => {
            setWaitText(
              "Preparing face matcher and device setup, please wait..."
            );
          });
        console.log(fullDesc);
      }
    }

    let interval = setInterval(() => {
      capture();
    }, 500);

    return () => clearInterval(interval);
  });

  //form
  const handleDateChange = (value) => {
    setSelectedDate(value?._d.toISOString());
  };

  const handleTimeChange = (value) => {
    setSelectedTime(value?._d.toISOString());
  };

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

  //submit attendance
  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      message.info("Please fill up both the date and time");
      return;
    }
    submitAttendanceCallback();
  };

  const titleList = [
    { name: "Home", link: "/dashboard" },
    {
      name: `Course: ${props.match.params.id}`,
      link: `/course/${props.match.params.id}`,
    },
    { name: "Take Attendance", link: "takeAttendance" },
  ];

  return (
    <Layout className="layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb titleList={titleList} />
        <Content>
          {error && <ErrorComp err={error} />}
          <Card>
            {data && (
              <Title level={4}>
                Course:{" "}
                {course.code + "-" + course.name + "(" + course.session + ")"}
              </Title>
            )}

            <AttendanceForm
              inputDevices={inputDevices}
              handleDateChange={handleDateChange}
              handleTimeChange={handleTimeChange}
              handleSelectWebcam={handleSelectWebcam}
              handleWebcamResolution={handleWebcamResolution}
            />
            <Card>
              <Row>Face Descriptor Matcher: {facePhotos.length}</Row>
            </Card>

            {facePhotos.length === 0 && (
              <p className="alert">No have any face matcher.</p>
            )}
            <ModelLoadStatus errorMessage={loadingMessageError} />
            <Card>
              <Row>
                <Col>Threshold Distance: {threshold} </Col>
                &nbsp;
                <Col span={24}>
                  <Slider
                    defaultValue={threshold}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(value) => {
                      setFaceThresholdDistance(value);
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <div className="alert">
                  The larger threshold distance might be good for detecting
                  occluded and non-frontal face, but more prone to
                  misclassification
                </div>
              </Row>
              <Row>
                <div className="alert">
                  The smaller threshold distance might be good for reducing
                  misclassification, but more prone to "unknown" cases
                </div>
              </Row>
              <Row>
                <div className="alert">
                  Hence, there is no any best threshold
                </div>
              </Row>
            </Card>
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
                  <WebcamFR
                    webcam={webcam}
                    camWidth={camWidth}
                    camHeight={camHeight}
                    selectedWebcam={selectedWebcam}
                    detectionCount={detectionCount}
                    setDetectionCount={setDetectionCount}
                    setAbsentees={setAbsentees}
                    fullDesc={fullDesc}
                    faceMatcher={faceMatcher}
                    participants={participants}
                    mode="Recognition"
                  />
                </>
              </Card>
            )}

            <p
              style={{
                textAlign: "center",
                fontWeight: 900,
                fontSize: "20px",
              }}
            >
              Total Participants: {participants.length}
            </p>
            {console.log(absentees)}
            {console.log(participants)}

            <ParticipantAttendanceDisplay
              loading={loading}
              absentees={absentees}
              participants={participants}
              setAbsentees={setAbsentees}
            />
            {/* <div style={{ textAlign: 'center' }}>
              <div className='alert'>
                Something wrong? Double click the participant to reverse.
              </div>
            </div> */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "30px",
              }}
            >
              <Button
                type="primary"
                disabled={
                  loading ||
                  error ||
                  participants.length === 0 ||
                  facePhotos.length === 0
                }
                onClick={handleSubmit}
                loading={submitAttendanceStatus.loading}
              >
                Submit Attendance
              </Button>
              <Prompt
                when={
                  !isAttendanceSubmit &&
                  participants.length > 0 &&
                  facePhotos.length > 0
                }
                message="You have not submit the attendance, are you sure to leave?"
              />
            </div>
          </Card>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
