import { Button, Card, Form, message, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { CheckError } from '../../../ErrorHandling';
import { getFullFaceDescription } from '../../../faceUtil';
import DrawBox from '../../../faceUtil/drawBox';
import {
  DEFAULT_WEBCAM_RESOLUTION,
  inputSize,
  webcamResolutionType,
} from '../../../globalData';
import WebcamFR from '../../../faceUtil/WebcamFR';

const { Option } = Select;

export const UploadFromWebcam = ({
  addFacePhotoCallback,
  galleryRefetch,
  countRefetch,
  loading,
}) => {
  const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
  const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);
  const [inputDevices, setInputDevices] = useState([]);
  const [selectedWebcam, setSelectedWebcam] = useState();

  const [fullDesc, setFullDesc] = useState(null);
  const [expression, setExpression] = useState('');

  const [faceDescriptor, setFaceDescriptor] = useState([]);

  const [detectionCount, setDetectionCount] = useState(0);
  const [previewImage, setPreviewImage] = useState('');


  const [waitText, setWaitText]=useState("")
  const webcam = useRef();

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
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === 'videoinput'
      );
      setInputDevices({ ...inputDevices, inputDevice });
    });
  }, []);

  useEffect(() => {
    function capture() {
      if (!!webcam.current) {
        setPreviewImage(webcam.current.getScreenshot());

        getFullFaceDescription(webcam.current.getScreenshot(), inputSize)
          .then((data) => {
            setFullDesc(data);
            data[0] &&
              setExpression(
                Object.keys(data[0]?.expressions).find(
                  (key) =>
                    data[0]?.expressions[key] ===
                    Object.values(data[0]?.expressions).reduce((a, b) =>
                      Math.max(a, b)
                    )
                )
              );
            setFaceDescriptor(data[0]?.descriptor);
            setWaitText('');

          })
          .catch((err) => {
            console.log(err);
            setWaitText('Preparing face matcher and device setup, please wait...');
          });
      }
    }

    let interval = setInterval(() => {
      capture();
    }, 500);

    return () => clearInterval(interval);
  });

  const handleSubmit = () => {
    addFacePhotoCallback({
      update() {
        galleryRefetch();
        countRefetch();
        message.success('Add Face Photo Success!');
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        photoData: previewImage,
        faceDescriptor: faceDescriptor.toString(),
        expression: expression,
      },
    });
  };

  return (
    <Card>
      <Form>
        <Form.Item label='Webcam'>
          <Select
            defaultValue='Select Webcam'
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
        <Form.Item label='Webcam Size'>
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
      <p style={{fontSize: "18px"}}>{waitText}</p>

      <WebcamFR
        webcam={webcam}
        camWidth={camWidth}
        camHeight={camHeight}
        selectedWebcam={selectedWebcam}
        detectionCount={detectionCount}
        setDetectionCount={setDetectionCount}
        fullDesc={fullDesc}
        mode='Detection'
      />

      {previewImage && (
        <div>
          <h3>Previous Capture: </h3>
          <img
            src={previewImage}
            alt='Capture'
            style={{ width: '200px', height: '200px' }}
          />
          <div style={{ marginTop: '10px' }}>
            <Button
              type='primary'
              onClick={handleSubmit}
              disabled={
                loading ||
                detectionCount !== 1 ||
                (faceDescriptor && faceDescriptor.length !== 128)
              }
              loading={loading}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      <div>
        <p>
          Number of detection: {detectionCount}{' '}
          {detectionCount > 1 && (
            <span className='alert'>Cannot more than 2</span>
          )}
        </p>
        Face Descriptors:{' '}
        {detectionCount === 0
          ? 'Empty'
          : fullDesc.map((desc, index) => (
              <div
                key={index}
                style={{
                  wordBreak: 'break-all',
                  marginBottom: '10px',
                  backgroundColor: 'lightblue',
                }}
              >
                <strong style={{ fontSize: '20px', color: 'red' }}>
                  Face #{index}:{' '}
                </strong>
                {desc.descriptor.toString()}
              </div>
            ))}
      </div>
    </Card>
  );
};
