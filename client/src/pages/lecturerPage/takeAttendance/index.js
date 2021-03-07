import {
  CheckOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlayCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button, Card, Layout, message, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Prompt } from 'react-router';
import { Player } from 'video-react';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { CheckError, ErrorComp } from '../../../ErrorHandling';
import {
  createMatcher,
  getFullFaceDescription,
  isFaceDetectionModelLoaded,
  isFacialExpressionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
} from '../../../faceUtil';
import WebcamFR from '../../../faceUtil/WebcamFR';
import {
  DEFAULT_WEBCAM_RESOLUTION,
  inputSize,
  webcamResolutionType,
} from '../../../globalData';
import { FETCH_FACE_MATCHER_IN_COURSE_QUERY } from '../../../graphql/query';
import { CREATE_ATTENDANCE_MUTATION } from '../../../graphql/mutation';
import AttendanceForm from './attendanceForm';
import ModelLoading from './ModelLoading';
import ModelLoadStatus from '../../../utils/ModelLoadStatus';
import ParticipantAttendanceDisplay from './ParticipantAttendanceDisplay';
import { AttendanceContext } from '../../../context';
import './TakeAttendance.css';

const { Title } = Typography;
const { Content } = Layout;

export default (props) => {
  const { addAttendance } = useContext(AttendanceContext);

  const webcam = useRef();
  const mediaRecorderRef = useRef(null);

  const [selectedWebcam, setSelectedWebcam] = useState();
  const [selectedDate, setSelectedDate] = useState(moment().toISOString());
  const [selectedTime, setSelectedTime] = useState(moment().toISOString());

  const [capturing, setCapturing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoURL, setVideoURL] = useState('');
  const [videoBase64, setVideoBase64] = useState('');

  const [isVideoSave, setIsVideoSave] = useState(false);

  const [inputDevices, setInputDevices] = useState([]);
  const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
  const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);

  const [course, setCourse] = useState({});
  const [participants, setParticipants] = useState([]);
  const [facePhotos, setFacePhotos] = useState([]);
  const [absentees, setAbsentees] = useState([]);

  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingMessageError, setLoadingMessageError] = useState('');

  const [detectionCount, setDetectionCount] = useState(0);

  const [faceMatcher, setFaceMatcher] = useState(null);
  const [fullDesc, setFullDesc] = useState(null);

  const [isAttendanceSubmit, setIsAttendanceSubmit] = useState(false);

  const [waitText, setWaitText] = useState('');

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
          message.info('Course do not have any participant yet!');
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
        message.success('Success Submit.');
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        date: selectedDate,
        time: selectedTime,
        videoData: videoBase64,
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
        (device) => device.kind === 'videoinput'
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
        const profileList = await createMatcher(validMatcher);
        setFaceMatcher(profileList);
      }
    }
    if (!!data) {
      matcher();
    }
  }, [data, facePhotos]);

  useEffect(() => {
    function capture() {
      if (!!webcam.current) {
        getFullFaceDescription(webcam.current.getScreenshot(), inputSize)
          .then((data) => {
            setFullDesc(data);
            setWaitText('');
          })
          .catch((err) => {
            setWaitText('Preparing face matcher and device setup, please wait...');
          });
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

  //record and download
  const handleStartCaptureClick = React.useCallback(() => {
    if (!webcam.current) return;

    setCapturing(true);
    setRecordedChunks([]);
    mediaRecorderRef.current = new MediaRecorder(webcam.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcam, setCapturing, mediaRecorderRef, setRecordedChunks]);

  useEffect(() => {
    let interval;
    if (capturing) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [capturing, timer, setTimer]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    setTimer(0);
  }, [mediaRecorderRef, webcam, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'Attendance Record.webm';
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const handleSave = async () => {
    await setVideoURL(
      window.URL.createObjectURL(
        new Blob(recordedChunks, {
          type: 'video/webm',
        })
      )
    );
    setIsVideoSave(true);
  };

  const handleRemove = () => {
    setRecordedChunks([]);
    setIsVideoSave(false);
  };

  useEffect(() => {
    if (isVideoSave && recordedChunks.length > 0) {
      var reader = new window.FileReader();
      reader.readAsDataURL(recordedChunks[0]);
      reader.onloadend = function () {
        let base64 = reader.result;
        base64 = base64.split(',')[1];
        setVideoBase64(base64);
        console.log(base64); //TODO: Save to cloudinary
      };
    }
  }, [isVideoSave, recordedChunks]);

  //submit attendance
  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      message.info('Please fill up both the date and time');
      return;
    }
    submitAttendanceCallback();
  };

  const titleList = [
    { name: 'Home', link: '/dashboard' },
    {
      name: `Course: ${props.match.params.id}`,
      link: `/course/${props.match.params.id}`,
    },
    { name: 'Take Attendance', link: 'takeAttendance' },
  ];

  return (
    <Layout className='layout'>
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb titleList={titleList} />

        {console.log(recordedChunks)}
        <Content>
          {error && <ErrorComp err={error} />}
          {/* 
          {videoBase64 && (
            <video>
              <source src={videoBase64} />
            </video>
          )} */}
          <Card>
            {data && (
              <Title level={4}>
                Course:{' '}
                {course.code + '-' + course.name + '(' + course.session + ')'}
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
              <span>Face Descriptor Matcher: {facePhotos.length}</span>
            </Card>

            {facePhotos.length === 0 && (
              <p className='alert'>No have any face matcher.</p>
            )}
            <ModelLoadStatus />

            {facePhotos.length > 0 && (
              <Card className='takeAttendance__card__webcam'>
                {!isAllModelLoaded ? (
                  <ModelLoading loadingMessage={loadingMessage} />
                ) : loadingMessageError ? (
                  <div className='error'>{loadingMessageError}</div>
                ) : (
                  <>
                  <p style={{fontSize: "18px"}}>{waitText}</p>
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
                    mode='Recognition'
                  />
                  </>
                )}

                <div style={{ display: 'none' }}>
                  {' '}
                  //TODO: remove
                  <p className='alert'>
                    Record for future reference if you wish
                  </p>
                  {!capturing && recordedChunks.length === 0 ? (
                    <Button
                      onClick={handleStartCaptureClick}
                      icon={<PlayCircleOutlined />}
                      disabled={loading || !isAllModelLoaded || !webcam.current}
                    >
                      Start Record
                    </Button>
                  ) : capturing ? (
                    <Button
                      danger
                      onClick={handleStopCaptureClick}
                      icon={<MinusCircleOutlined />}
                    >
                      Stop Record ({timer} s)
                    </Button>
                  ) : (
                    <>
                      <Button
                        style={
                          isVideoSave
                            ? {
                                color: 'rgba(0,150, 0, 0.8)',
                                backgroundColor: 'rgba(125,255, 125, 0.3)',
                              }
                            : {}
                        }
                        onClick={handleSave}
                        shape='round'
                        icon={<SaveOutlined />}
                        disabled={isVideoSave}
                      >
                        <span>Save {isVideoSave && <CheckOutlined />}</span>
                      </Button>
                      <Button
                        type='danger'
                        onClick={handleRemove}
                        shape='round'
                        icon={<DeleteOutlined />}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                  {/* {recordedChunks.length > 0 && (
                <Button
                  onClick={handleDownload}
                  shape='round'
                  icon={<DownloadOutlined />}
                >
                  Download
                </Button>
              )} */}
                  {recordedChunks.length > 0 && isVideoSave && (
                    <Card>
                      <Player
                        playsInline
                        poster='/assets/poster.png'
                        src={videoURL}
                      />
                    </Card>
                  )}
                </div>
              </Card>
            )}

            <p
              style={{
                textAlign: 'center',
                fontWeight: 900,
                fontSize: '20px',
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '30px',
              }}
            >
              <Button
                type='primary'
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
                message='You have not submit the attendance, are you sure to leave?'
              />
            </div>
          </Card>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
