import { LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Card, Form, Layout, message, Select, Switch, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { AuthContext, FaceThresholdDistanceContext } from "../../../context";
import { createMatcher } from "../../../faceUtil";
import { attendanceMode, DEFAULT_ATTENDANCE_MODE } from "../../../globalData";
import {
  EDIT_ATTENDANCE_MODE_MUTATION,
  EDIT_ATTENDANCE_ON_OFF_MUTATION,
} from "../../../graphql/mutation";
import {
  FETCH_ATTENDANCE_QUERY,
  FETCH_FACE_MATCHER_IN_COURSE_QUERY,
} from "../../../graphql/query";
import { CheckError } from "../../../utils/ErrorHandling";
import { LoadingSpin } from "../../../utils/LoadingSpin";
import ProcessFaceRecognition from "./ProcessFaceRecognition";
import TrxDashboard from "./TrxDashboard";

const { Option } = Select;
const { Title } = Typography;
export default (props) => {
  const { user } = useContext(AuthContext);
  const { threshold, setFaceThresholdDistance } = useContext(
    FaceThresholdDistanceContext
  );
  const [mode, setMode] = useState(DEFAULT_ATTENDANCE_MODE);
  const [isOn, setIsOn] = useState(true);

  const [participants, setParticipants] = useState([]);
  const [facePhotos, setFacePhotos] = useState([]);
  const [faceMatcher, setFaceMatcher] = useState(null);

  const [absentees, setAbsentees] = useState([]);
  const [course, setCourse] = useState({});

  const { data, loading, error } = useQuery(
    FETCH_FACE_MATCHER_IN_COURSE_QUERY,
    {
      onError(err) {
        console.log(err);
        // props.history.push("/dashboard");
        CheckError(err);
      },
      variables: {
        courseID: props.match.params.courseID,
      },
    }
  );

  useEffect(() => {
    if (data) {
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
    }
  }, [data, participants]);
  const attendanceGQLQuery = useQuery(FETCH_ATTENDANCE_QUERY, {
    onError(err) {
      props.history.push(
        `/course/${props.match.params.courseID}/attendanceList`
      );
      CheckError(err);
    },
    pollInterval: 2000,

    variables: {
      attendanceID: props.match.params.attendanceID,
    },
  });

  useEffect(() => {
    if (attendanceGQLQuery.data) {
      setMode(attendanceGQLQuery.data.getAttendance.mode);
      message.info(
        "Attendance Mode: " + attendanceGQLQuery.data.getAttendance.mode
      );
      setIsOn(attendanceGQLQuery.data.getAttendance.isOn);
      if (attendanceGQLQuery.data.getAttendance.isOn)
        message.info("Attendance is currently opened");
      else {
        if (user.userLevel == 0)
          message.info("Attendance had been closed by the host.");
        else {
          message.info(
            "You closed the attendance, no transaction will be recorded"
          );
        }
      }
    }
  }, [attendanceGQLQuery.data]);

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

  const [editAttendanceModeCallback, editAttendanceModeStatus] = useMutation(
    EDIT_ATTENDANCE_MODE_MUTATION,
    {
      onCompleted: async (data) => {
        setMode(data.editAttendanceMode.mode);
        message.success(`Set Mode To ${data.editAttendanceMode.mode}`);
      },
      onError(err) {
        CheckError(err);
      },
    }
  );

  const [editAttendanceOnOffCallback, editAttendanceOnOffStatus] = useMutation(
    EDIT_ATTENDANCE_ON_OFF_MUTATION,
    {
      onCompleted: async (data) => {
        setIsOn(data.editAttendanceOnOff.isOn);
        message.success(
          `Attendance is ${data.editAttendanceOnOff.isOn == 1 ? " on" : " off"}`
        );
      },
      onError(err) {
        CheckError(err);
      },
    }
  );

  const handleModeChange = (value) => {
    editAttendanceModeCallback({
      variables: {
        attendanceID: props.match.params.attendanceID,
        mode: value,
      },
    });
  };

  const handleIsOnChange = (value) => {
    editAttendanceOnOffCallback({
      variables: {
        attendanceID: props.match.params.attendanceID,
        isOn: value,
      },
    });
  };

  const titleList = [
    { name: "Home", link: "/dashboard" },
    {
      name: `Course: ${props.match.params.courseID}`,
      link: `/course/${props.match.params.courseID}`,
    },
    {
      name: `Attendance List`,
      link: `/course/${props.match.params.courseID}/attendanceList`,
    },
    {
      name: `Attendance Room: ${props.match.params.attendanceID}`,
      link: `/course/${props.match.params.courseID}/attendanceRoom/${props.match.params.attendanceID}`,
    },
  ];
  const { Content } = Layout;

  return (
    <Layout className="layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb titleList={titleList} />
        <Content>
          <Card
            title={
              mode == "F2F" ? (
                <Title level={4}>F2F Attendance</Title>
              ) : (
                <Title level={4}>Remote Attendance</Title>
              )
            }
          >
            {data && (
              <Title level={4}>
                Course:{" "}
                {course.code + "-" + course.name + "(" + course.session + ")"}
              </Title>
            )}
          </Card>

          {user.userLevel == 1 && (
            <Card title={<Title level={4}>Attendance Setting</Title>}>
              <Form>
                <Form.Item label="Mode">
                  {editAttendanceModeStatus.loading ? (
                    <LoadingOutlined
                      style={{ fontSize: "25px", color: "blue" }}
                    />
                  ) : (
                    <Select value={mode} onChange={handleModeChange}>
                      {attendanceMode.map((mode) => (
                        <Option key={mode} value={mode}>
                          {mode}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Open">
                  {editAttendanceOnOffStatus.loading ? (
                    <LoadingOutlined
                      style={{ fontSize: "25px", color: "blue" }}
                    />
                  ) : (
                    <>
                      <Switch onChange={handleIsOnChange} checked={isOn} />
                      {isOn
                        ? " (Attendance transaction activate)"
                        : " (Attendance transaction deactivate)"}
                    </>
                  )}
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* For F2F, use Lecturer PC For FR */}
          {attendanceGQLQuery.data &&
            isOn &&
            mode == "F2F" &&
            user.userLevel == 1 && (
              <ProcessFaceRecognition
                {...props}
                faceMatcher={faceMatcher}
                facePhotos={facePhotos}
                participants={participants}
              />
            )}
          {/* For Remote, use Student PC For FR */}

          {attendanceGQLQuery.data &&
            isOn &&
            mode == "Remote" &&
            user.userLevel == 0 && (
              <ProcessFaceRecognition
                {...props}
                faceMatcher={faceMatcher}
                facePhotos={facePhotos}
                participants={participants}
              />
            )}

          {!isOn && user.userLevel == 0 && (
            <Card>
              <p>The host has closed the attendance</p>
            </Card>
          )}

          <LoadingSpin loading={attendanceGQLQuery.loading} />
          <TrxDashboard {...props} participants={participants} />
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};
