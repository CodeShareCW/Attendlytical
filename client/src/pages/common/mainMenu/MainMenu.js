import { Button, Col, Layout, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { HeaderNavbar } from "../../../components/common/mainMenu";
import { Footer } from "../../../components/common/sharedLayout";

const { Content } = Layout;

export default () => {
  return (
    <Layout className="home layout">
      <HeaderNavbar />
      <Content>
        <Row>
          <Col style={{ top: "50px" }} offset={8} span={8}>
            <h1>Welcome to Face In</h1>
            <h3>
              An deep learning based facial recognition for attendance system
            </h3>
            <br />
            <Button type="primary" htmlType="submit">
              <Link to="/signup">Get Started</Link>
            </Button>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
};
