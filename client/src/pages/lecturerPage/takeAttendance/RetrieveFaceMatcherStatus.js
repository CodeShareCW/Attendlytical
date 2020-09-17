import { LoadingOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';

export default ({loading, error, length}) => (
  <Card>
    <span>Face Descriptor Matcher: </span>
    {loading ? (
      <strong>
        Retrieving... <LoadingOutlined />
      </strong>
    ) : !!error ? (
      <strong>Retrieve Error</strong>
    ) : (
      <strong> {length} samples in total</strong>
    )}
  </Card>
);
