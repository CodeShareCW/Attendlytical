import { Card } from 'antd';
import React from 'react';
import {
  isFaceDetectionModelLoaded,
  isFacialExpressionModelLoaded,
  isFeatureExtractionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
} from '../faceUtil';
export default () => (
  <Card style={{ opacity: 0.8 }}>
    <p>
      Face Detector:{' '}
      {isFaceDetectionModelLoaded() ? (
        <strong>Loaded</strong>
      ) : (
        <strong>Not loaded</strong>
      )}
    </p>
    <p>
      Facial Landmark Detector:{' '}
      {isFacialLandmarkDetectionModelLoaded() ? (
        <strong>Loaded</strong>
      ) : (
        <strong>Not loaded</strong>
      )}
    </p>
    <p>
      Feature Extractor:{' '}
      {isFeatureExtractionModelLoaded() ? (
        <strong>Loaded</strong>
      ) : (
        <strong>Not loaded</strong>
      )}
    </p>
    <p>
      Facial Expression Detector:{' '}
      {isFacialExpressionModelLoaded() ? (
        <strong>Loaded</strong>
      ) : (
        <strong>Not loaded</strong>
      )}
    </p>
  </Card>
);
