/*
  no found page
*/

//react
import React, { useContext } from "react";
import { Link } from "react-router-dom";

//antd
import { Layout, Button, Row, Col } from "antd";

//comp
import { NavbarContext } from "../../context/navbar";
import Navbar from "../../components/common/Navbar";
import Greeting from "../../components/common/Greeting";
import Footer from "../../components/common/Footer";

//style
import "./NoFound.css";

const { Sider, Content} = Layout;

export default () => {
  const { collapsed, toggleCollapsed } = useContext(NavbarContext);

  return (
    <Layout className="nofound layout">
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <Navbar />
      </Sider>
      <Layout>
        <Greeting />
        <Content className="nofound__content">
          <Row className="nofound__panel">
            <Col span={24} style={{ marginBottom: "20px" }}>
              Page Not Found: "{window.location.pathname}"
            </Col>

            <Col span={24}>
              <Button type="primary">
                <Link to="/dashboard">Home Page</Link>
              </Button>
            </Col>
          </Row>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
