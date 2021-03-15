import { Button, Col, Divider, Layout, Row, Typography } from 'antd';
import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderNavbar } from '../../../components/common/mainMenu';
import { Footer } from '../../../components/common/sharedLayout';

const { Content } = Layout;
const { Title } = Typography;

export default () => {
  return (
    <Layout className='home layout'>
      <HeaderNavbar />
      <Content>
        <Row align="middle">
          <Col style={{ top: '50px' }} span={24} align="middle">
            <Title level={3}>
              <Texty
                type="left"
                mode="random"
              >
                Welcome to Attendlytical
              </Texty>
            </Title>
            <Texty
              type="left"
              mode="smooth"
              interval="20"
            >
              An attendance tracking app with facial recognition
            </Texty>

            <br />
            <Button type='primary' htmlType='submit'>
              <Link to='/signup'>Get Started</Link>
            </Button>
            <Divider />
            <div>
              First time user? Please visit <Link to='/userguidelines'> User Guidelines</Link>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
};
