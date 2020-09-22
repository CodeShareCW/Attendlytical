import { Typography } from 'antd';
import React from 'react';
import Webcam from 'react-webcam';
import DrawBox from './drawBox';
const { Title } = Typography;

export default ({
  webcam,
  camWidth,
  camHeight,
  selectedWebcam,
  detectionCount,
  setDetectionCount,
  setAbsentees,
  fullDesc,
  faceMatcher,
  participants,
  mode
}) => (
  <>
    <Webcam
      ref={webcam}
      audio={false}
      width={camWidth}
      height={camHeight}
      screenshotFormat='image/jpeg'
      videoConstraints={{
        deviceId: selectedWebcam,
      }}
    />
    <Title level={4}>Total detected faces: {detectionCount}</Title>

    <DrawBox
      setDetectionCount={setDetectionCount}
      setAbsentees={setAbsentees}
      fullDesc={fullDesc}
      faceMatcher={faceMatcher}
      participants={participants}
      
      imageHeight={camHeight}
      imageWidth={camWidth}
      boxColor={'blue'}
      mode={mode}
    />
  </>
);
