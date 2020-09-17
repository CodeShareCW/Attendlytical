import { Spin } from 'antd';
import React from 'react';

export const LoadingSpin = ({ loading }) => {
  return (
    loading && (
      <div style={{ textAlign: 'center' }}>
        <Spin tip='Loading...' />
      </div>
    )
  );
};
