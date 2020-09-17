import { useMutation, useQuery } from '@apollo/react-hooks';
import { Button, Card, Layout, message, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { CheckError } from '../../../ErrorHandling';
import {
  createMatcher,
  getFullFaceDescription,
  loadModels,
} from '../../../faceUtil';
import JSON_PROFILE from '../../../faceUtil/descriptors/bnk48.json';
import {
  DEFAULT_WEBCAM_RESOLUTION,
  inputSize,
  webcamResolutionType,
} from '../../../globalData';
import { RETRIEVE_STUDENT_FACE_PHOTOS_MUTATION } from '../../../graphql/mutation';
import { FETCH_COURSE_QUERY } from '../../../graphql/query';
import AttendanceForm from './attendanceForm';
import ModelLoading from './ModelLoading';
import ModelLoadStatus from './ModelLoadStatus';
import ParticipantAttendanceDisplay from './ParticipantAttendanceDisplay';
import RetrieveFaceMatcherStatus from './RetrieveFaceMatcherStatus';
import './TakeAttendance.css';
import WebcamFR from './WebcamFR';

const { Title } = Typography;
const { Content } = Layout;

export default (props) => {
  const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
  const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);

  const [participants, setParticipants] = useState([]);
  const [facePhotos, setFacePhotos] = useState([]);
  const [
    retrieveStudentFacePhotoError,
    setRetrieveStudentFacePhotoError,
  ] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [absentees, setAbsentees] = useState([]);

  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadedModel, setLoadedModel] = useState([]);
  const [loadingMessageError, setLoadingMessageError] = useState('');

  const [detectionCount, setDetectionCount] = useState(0);

  const [inputDevices, setInputDevices] = useState([]);

  const webcam = useRef();
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [fullDesc, setFullDesc] = useState(null);

  const { data, loading } = useQuery(FETCH_COURSE_QUERY, {
    onCompleted(data) {
      data.getCourse.enrolledStudents.map((participant) => {
        retrieveStudentFacePhotoCallback({
          variables: {
            studentID: participant._id,
          },
        });
      });
    },
    onError(err) {
      CheckError(err);
    },
    variables: {
      id: props.match.params.id,
    },
  });

  const [
    retrieveStudentFacePhotoCallback,
    retrieveStudentFacePhotoStatus,
  ] = useMutation(RETRIEVE_STUDENT_FACE_PHOTOS_MUTATION, {
    onCompleted({ retrieveStudentFacePhoto }) {
      setFacePhotos([...facePhotos, ...retrieveStudentFacePhoto]);
      var updatedParticipants = [...data.getCourse.enrolledStudents];
      updatedParticipants.map((p) =>
        Object.assign(p, {
          facePhotos: [...facePhotos, ...retrieveStudentFacePhoto].filter(
            (photo) => photo.creator._id == p._id
          ),
        })
      );
      setParticipants(updatedParticipants);
      setAbsentees(updatedParticipants);
    },
    onError(err) {
      CheckError(err);
      setRetrieveStudentFacePhotoError('Retrieve Failed');
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
        (device) => device.kind === 'videoinput'
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
            message.info(
              'Getting Face Recognition setup, there might be some lag and please dont press anything'
            );
          });
      }
    }

    let interval = setInterval(() => {
      capture();
    }, 1500);

    return () => clearInterval(interval);
  });

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

        <Content>
          <Card>
            {data && (
              <Title level={4}>
                Course:{' '}
                {data?.getCourse.code +
                  '-' +
                  data?.getCourse.name +
                  '(' +
                  data?.getCourse.session +
                  ')'}
              </Title>
            )}

            <AttendanceForm
              inputDevices={inputDevices}
              handleSelectWebcam={handleSelectWebcam}
              handleWebcamResolution={handleWebcamResolution}
            />

            <RetrieveFaceMatcherStatus
              loading={retrieveStudentFacePhotoStatus.loading}
              error={retrieveStudentFacePhotoError}
              length={facePhotos.length}
            />

            <Card className='takeAttendance__card__webcam'>
              {!isAllModelLoaded ? (
                <ModelLoading loadingMessage={loadingMessage} />
              ) : loadingMessageError ? (
                <div className='error'>{loadingMessageError}</div>
              ) : (
                <WebcamFR
                  webcam={webcam}
                  camWidth={camWidth}
                  camHeight={camHeight}
                  selectedWebcam={selectedWebcam}
                  detectionCount={detectionCount}
                  setDetectionCount={setDetectionCount}
                  fullDesc={fullDesc}
                  faceMatcher={faceMatcher}
                />
              )}
              <ModelLoadStatus loadedModel={loadedModel} />
            </Card>
            <p
              style={{
                textAlign: 'center',
                fontWeight: 900,
                fontSize: '20px',
              }}
            >
              Total Participants: {participants.length}
            </p>

            <ParticipantAttendanceDisplay
              loading={loading}
              absentees={absentees}
              attendees={attendees}
              setAbsentees={setAbsentees}
              setAttendees={setAttendees}
            />
            <div style={{ textAlign: 'center' }}>
              <div className='alert'>
                Something wrong? Double click the participant to reverse.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '30px',
              }}
            >
              <Button type='primary'>Submit Attendance</Button>
            </div>
          </Card>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
