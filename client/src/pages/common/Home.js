/*
  Welcome page
*/

//react
import React from "react";
import { Link } from "react-router-dom";

//antd
import { Layout, Row, Col, Button } from "antd";

//comp
import HeaderNavbar from "../../components/common/HeaderNavbar";
import Footer from "../../components/common/Footer";

const { Content } = Layout;

export default function Home() {
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
}
