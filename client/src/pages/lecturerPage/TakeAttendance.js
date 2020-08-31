import React, { useState, useContext } from "react";
import Webcam from "react-webcam";

import { AuthContext } from "../../context/auth";
import { NavbarContext } from "../../context/navbar";

import {
  Layout,
  Form,
  Input,
  Button,
  Breadcrumb,
  Card,
  message,
  Typography,
} from "antd";

import { LoadingOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

import Greeting from "../../components/common/Greeting";
import gql from "graphql-tag";

import "./TakeAttendance.css";

const { Title } = Typography;
const { Header, Sider, Content, Footer } = Layout;

export default (props) => {
  const { user } = useContext(AuthContext);
  const { collapsed, toggleCollapsed } = useContext(NavbarContext);
  const [formValue, SetFormValue] = useState({});
  return (
    <div className="takeAttendance">
      <Layout className="takeAttendance layout">
        <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
          <Navbar />
        </Sider>
        <Layout>
          <Greeting />
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb__item">
              <Link to="/takeattendance">Take Attendace</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Content className="takeAttendance__content">
            <Card className="takeAttendance__card">
            <Title className="takeAttendance__title" level={4}>Course: </Title>
              <Card className="takeAttendance__card__webcam">
                {" "}
                <Webcam
                  audio={false}
                  width={1000}
                  height={500}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    deviceId:
                      "e62efaf172cea9bf6ea82c2b7fd4d48e5e44469b7dcb3808289829cd79bfefc8",
                  }}
                />
              </Card>
              <div className="takeAttendance__card__participant">
                <Card className="takeAttendance__card__item">Attendee</Card>
                <Card className="takeAttendance__card__item">Absentee</Card>
              </div>
            </Card>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Face In @ {new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};
