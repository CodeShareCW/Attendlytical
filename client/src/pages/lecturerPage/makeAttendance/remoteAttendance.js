import { useQuery } from "@apollo/react-hooks";
import {
  Card,
  Col,
  Form,
  Layout,
  message,
  Row,
  Select,
  Slider,
  Typography,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaceThresholdDistanceContext } from "../../../context";
import { CheckError, ErrorComp } from "../../../ErrorHandling";
import {
  createMatcher,
  getFullFaceDescription,
  isFaceDetectionModelLoaded,
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
import { FETCH_FACE_MATCHER_IN_COURSE_QUERY } from "../../../graphql/query";
import ModelLoading from "../../../utils/ModelLoading";
import ModelLoadStatus from "../../../utils/ModelLoadStatus";
import ParticipantAttendanceDisplay from "./ParticipantAttendanceDisplay";

const { Title } = Typography;
const { Content } = Layout;

export default (props) => {
  const [course, setCourse] = useState({});
  const [participants, setParticipants] = useState([]);
  const [facePhotos, setFacePhotos] = useState([]);
  const [absentees, setAbsentees] = useState([]);

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
        courseID: props.match.params.courseID,
      },
    }
  );





  return (
    <Content>
      {error && <ErrorComp err={error} />}
      <Card>
        <Title level={4}>Remote Attendance Mode</Title>

        {data && (
          <Title level={4}>
            Course:{" "}
            {course.code + "-" + course.name + "(" + course.session + ")"}
          </Title>
        )}
        <Card>
          <strong>Student are taking attendance remotely now...</strong>
        </Card>
        <Card>
          <Row>Face Descriptor Matcher: {facePhotos.length}</Row>
        </Card>
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
        ></div>
      </Card>
    </Content>
  );
};
