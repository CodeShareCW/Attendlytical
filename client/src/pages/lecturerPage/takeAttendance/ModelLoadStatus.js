import { Card } from 'antd';
import React from 'react';

export default ({loadedModel}) => (
  <Card style={{opacity: 0.8}}>
    <p>
      Face Detector:{' '}
      {loadedModel.find((item) => item === 'FD') ? (
        <strong>Loaded</strong>
      ) : (
        <strong>Not loaded</strong>
      )}
    </p>
    <p>
      Facial Landmark Detector:{' '}
      {loadedModel.find((item) => item === 'FLD') ? (
        <strong>Loaded</strong>
      ) : (
        <strong>Not loaded</strong>
      )}
    </p>
    <p>
      Feature Extractor:{' '}
      {loadedModel.find((item) => item === 'FR') ? (
        <strong>Loaded</strong>
      ) : (
        <strong>Not loaded</strong>
      )}
    </p>
    <p>
      Facial Expression Detector:{' '}
      {loadedModel.find((item) => item === 'FE') ? (
        <strong>Loaded</strong>
      ) : (
        <strong>Not loaded</strong>
      )}
    </p>
  </Card>
);
