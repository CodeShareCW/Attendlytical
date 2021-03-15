import { Button, Col, Layout, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Footer,
  Greeting,
  Navbar
} from '../../../components/common/sharedLayout';
import './NoFound.css';

const { Content } = Layout;

export default () => {
  return (
    <Layout className='nofound layout'>
      <Navbar />
      <Layout>
        <Greeting />
        <Content className='nofound__content'>
          <Row className='nofound__panel'>
            <Col span={24} style={{ marginBottom: '20px' }}>
              Page Not Found: "{window.location.pathname}"
            </Col>

            <Col span={24}>
              <Button type='primary'>
                <Link to='/dashboard'>Home Page</Link>
              </Button>
            </Col>
          </Row>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
