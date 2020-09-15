import {
  CloseOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/react-hooks";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Layout,
  List,
  message,
  Row,
  Select,
  Spin,
  TimePicker,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import FacebookEmoji from "react-facebook-emoji";
import Webcam from "react-webcam";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { CheckError } from "../../../ErrorHandling";
import {
  createMatcher,
  getFullFaceDescription,
  loadModels,
} from "../../../faceUtil";
import JSON_PROFILE from "../../../faceUtil/descriptors/bnk48.json";
import DrawBox from "../../../faceUtil/drawBox";
import {
  DEFAULT_WEBCAM_RESOLUTION,
  webcamResolutionType,
  inputSize,
} from "../../../globalData";
import { FETCH_CREATEDCOURSE_QUERY } from "../../../graphql/query";
import "./TakeAttendance.css";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

export default (props) => {
  const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
  const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);

  const [participants, setParticipants] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [absentees, setAbsentees] = useState([]);

  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadedModel, setLoadedModel] = useState([]);
  const [loadingMessageError, setLoadingMessageError] = useState("");

  const [inputDevices, setInputDevices] = useState([]);

  const webcam = useRef();
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [fullDesc, setFullDesc] = useState(null);

  const CreatedCourseQuery = useQuery(FETCH_CREATEDCOURSE_QUERY, {
    onCompleted: (data) => {
      setParticipants(data.getCourse.enrolledStudents);
      setAbsentees(data.getCourse.enrolledStudents);
    },
    onError(err) {
      CheckError(err);
    },
    variables: {
      id: props.match.params.id,
    },
  });

  useEffect(() => {
    async function loadingtheModel() {
      await loadModels(
        setLoadingMessage,
        setLoadedModel,
        setLoadingMessageError
      );
      setIsAllModelLoaded(true);
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
      const profileList = await createMatcher(JSON_PROFILE);
      setFaceMatcher(profileList);
    }
    matcher();
  }, []);

  const [selectedWebcam, setSelectedWebcam] = useState();
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

  useEffect(() => {
    function capture() {
      if (!!webcam.current) {
        getFullFaceDescription(webcam.current.getScreenshot(), inputSize)
          .then((data) => {
            setFullDesc(data);
          })
          .catch((err) => {
            message.info("Getting frame...");
          });
      }
    }

    let interval = setInterval(() => {
      capture();
    }, 1500);

    return () => clearInterval(interval);
  });

  return (
    <div className="takeAttendance">
      <Layout className="takeAttendance layout">
        <Navbar />
        <Layout>
          <Greeting />
          <PageTitleBreadcrumb
            titleList={[
              { name: "Home", link: "/dashboard" },
              {
                name: `Course: ${props.match.params.id}`,
                link: `/course/${props.match.params.id}`,
              },
              { name: "Take Attendance", link: "takeAttendance" },
            ]}
          />

          <Content className="takeAttendance__content">
            <Card className="takeAttendance__card">
              {CreatedCourseQuery.data && (
                <Title className="takeAttendance__title" level={4}>
                  Course:{" "}
                  {CreatedCourseQuery.data?.getCourse.code +
                    "-" +
                    CreatedCourseQuery.data?.getCourse.name +
                    "(" +
                    CreatedCourseQuery.data?.getCourse.session +
                    ")"}
                </Title>
              )}
              <Form>
                <Form.Item label="Date">
                  <DatePicker defaultValue={moment()} format="YYYY/MM/DD" />
                </Form.Item>
                <Form.Item label="Time">
                  {" "}
                  <TimePicker defaultValue={moment()} format="HH:mm" />
                </Form.Item>

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
                  <span className="alert">Please select webcam</span>
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
              <Card className="takeAttendance__card__webcam">
                {!isAllModelLoaded ? (
                  <Spin
                    tip={loadingMessage}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "500px",
                      minWidth: "1000px",
                    }}
                    indicator={
                      <div style={{ marginRight: "50px" }}>
                        <LoadingOutlined
                          style={{ fontSize: "32px" }}
                        />
                      </div>
                    }
                  />
                ) : loadingMessageError ? (
                  <div className="error">{loadingMessageError}</div>
                ) : (
                  <>
                    {console.log(window)}
                    {selectedWebcam && (
                      <Webcam
                        ref={webcam}
                        audio={false}
                        width={camWidth}
                        height={camHeight}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                          deviceId: selectedWebcam,
                        }}
                      />
                    )}

                    <DrawBox
                      fullDesc={fullDesc}
                      faceMatcher={faceMatcher}
                      imageHeight={camHeight}
                      imageWidth={camWidth}
                      boxColor={"blue"}
                    />

                    {!selectedWebcam && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "500px",
                          minWidth: "1000px",
                        }}
                      >
                        Select the available webcam to open
                      </div>
                    )}
                  </>
                )}
                <p>
                  Face Detector:{" "}
                  {loadedModel.find((item) => item === "FD") ? (
                    <strong>Loaded</strong>
                  ) : (
                    <strong>Not loaded</strong>
                  )}
                </p>
                <p>
                  Facial Landmark Detector:{" "}
                  {loadedModel.find((item) => item === "FLD") ? (
                    <strong>Loaded</strong>
                  ) : (
                    <strong>Not loaded</strong>
                  )}
                </p>
                <p>
                  Feature Extractor:{" "}
                  {loadedModel.find((item) => item === "FR") ? (
                    <strong>Loaded</strong>
                  ) : (
                    <strong>Not loaded</strong>
                  )}
                </p>
                <p>
                  Facial Expression Detector:{" "}
                  {loadedModel.find((item) => item === "FE") ? (
                    <strong>Loaded</strong>
                  ) : (
                    <strong>Not loaded</strong>
                  )}
                </p>
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

              <Row>
                <Col span={12}>
                  <Card className="takeAttendance__card__item">
                    {" "}
                    <>
                      <p
                        style={{
                          fontWeight: 900,
                          fontSize: "15px",
                        }}
                      >
                        Absentee: {absentees.length}
                      </p>
                      {CreatedCourseQuery.loading ? (
                        <Spin tip="Fetching Absentees..." />
                      ) : absentees.length === 0 ? (
                        <p>No absentees</p>
                      ) : (
                        <ListView
                          data={absentees}
                          absentees={absentees}
                          attendees={attendees}
                          setAttendees={setAttendees}
                          setAbsentees={setAbsentees}
                        />
                      )}
                    </>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="takeAttendance__card__item">
                    <>
                      <p
                        style={{
                          fontWeight: 900,
                          fontSize: "15px",
                        }}
                      >
                        Attendee: {attendees.length}
                      </p>
                      {CreatedCourseQuery.loading ? (
                        <Spin tip="Fetching Attendees..." />
                      ) : attendees.length === 0 ? (
                        <p>No attendees</p>
                      ) : (
                        <ListView
                          data={attendees}
                          absentees={absentees}
                          attendees={attendees}
                          setAttendees={setAttendees}
                          setAbsentees={setAbsentees}
                        />
                      )}
                    </>
                  </Card>
                </Col>
              </Row>

              <div style={{ textAlign: "center" }}>
                <div className="alert">
                  Something wrong? Double click the participant to reverse.
                </div>
              </div>
            </Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "30px",
              }}
            >
              <Button type="primary">Submit Attendance</Button>
            </div>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  );
};

const ListView = ({
  data,
  absentees,
  attendees,
  setAttendees,
  setAbsentees,
}) => {
  const handleDoubleClick = (item) => {
    const test = absentees.find((absentee) => absentee === item);
    if (test) {
      setAttendees((prevState) => [...prevState, item]);
      setAbsentees((prevState) =>
        prevState.filter((absentee) => absentee !== item)
      );
    } else {
      setAbsentees((prevState) => [...prevState, item]);
      setAttendees((prevState) =>
        prevState.filter((attendee) => attendee !== item)
      );
    }
  };
  return (
    <List
      pagination={{
        pageSize: 20,
      }}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar src={item.profilePictureURL} icon={<UserOutlined />} />
            }
            title={
              <span
                style={{ cursor: "pointer" }}
                onDoubleClick={() => handleDoubleClick(item)}
              >
                {item.firstName} {item.lastName} ({item.cardID}){"  "}
                <Button
                  icon={<CloseOutlined style={{ color: "red" }} />}
                  onClick={() => handleDoubleClick(item)}
                ></Button>
              </span>
            }
            description={
              <>
                <span>Mood Today: </span>
                <FacebookEmoji type="yay" size="xs" />
              </>
            }
          />
        </List.Item>
      )}
    />
  );
};
