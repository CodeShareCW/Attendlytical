import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Layout, Breadcrumb } from "antd";

import { AuthContext } from "../../context/auth";
import { NavbarContext } from "../../context/navbar";

import Navbar from "../../components/common/Navbar";
import Greeting from "../../components/common/Greeting";
import StudentDashboard from "../studentPage/StudentDashboard";
import LecturerDashboard from "../lecturerPage/LecturerDashboard";

//comp
import Footer from "../../components/common/Footer";

//style
import "./Dashboard.css";

const { Sider, Content } = Layout;

export default (props) => {
  const { user } = useContext(AuthContext);
  const { collapsed, toggleCollapsed } = useContext(NavbarContext);

  return (
    <Layout className="dashboard layout">
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <Navbar />
      </Sider>

      <Layout>
        <Greeting />

        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item className="breadcrumb__item">
            <Link to="/dashboard">Home</Link>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Content style={{ margin: "24px 16px 0" }}>
          <div
            className="site-layout-background"
            style={{ background: "#fff", padding: 24, minHeight: "81vh" }}
          >
            {!user ? (
              <div>Something wrong...</div>
            ) : user.userLevel == 0 ? (
              <StudentDashboard user={user} {...props} />
            ) : user.userLevel == 1 ? (
              <LecturerDashboard user={user} {...props} />
            ) : (
              <div>Something wrong...</div>
            )}
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
