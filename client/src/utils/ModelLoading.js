import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

export default ({loadingMessage}) => (
  <Spin
    tip={loadingMessage}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '150px',
    }}
    indicator={
      <div style={{ marginRight: '50px' }}>
        <LoadingOutlined style={{ fontSize: '32px' }} />
      </div>
    }
  />
);
