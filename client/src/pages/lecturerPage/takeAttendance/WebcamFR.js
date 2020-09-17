import { Typography } from 'antd';
import React from 'react';
import Webcam from 'react-webcam';
import DrawBox from '../../../faceUtil/drawBox';
const { Title } = Typography;

export default ({
  webcam,
  camWidth,
  camHeight,
  selectedWebcam,
  detectionCount,
  setDetectionCount,
  fullDesc,
  faceMatcher
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
      fullDesc={fullDesc}
      faceMatcher={faceMatcher}
      imageHeight={camHeight}
      imageWidth={camWidth}
      boxColor={'blue'}
    />
  </>
);
