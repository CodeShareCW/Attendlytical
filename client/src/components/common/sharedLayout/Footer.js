import { Layout } from 'antd';
import React from 'react';

const { Footer } = Layout;
export default () => (
  <Footer style={{ textAlign: 'center' }}>
    <span>&#169; Face In {new Date().getFullYear()}</span>
  </Footer>
);
