/*
    menu item for lecturer (for future more functionality)
*/

//react
import React from "react";
import { Link } from "react-router-dom";

//antd
import { Menu } from "antd";
import {
  ClockCircleOutlined,
  HistoryOutlined,
  HomeOutlined,
  PictureOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";

export default () => {
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  return (
    <Menu theme="dark" mode="vertical" defaultSelectedKeys={[path]}>
    <Menu.Item key={"dashboard"} icon={<HomeOutlined />}>
      <Link to={"/dashboard"}>Home</Link>
    </Menu.Item>
    <Menu.Item key={"enrolcourse"} icon={<PlusCircleOutlined />}>
      <Link to={"/enrolcourse"}>Enrol Course</Link>
    </Menu.Item>
    <Menu.Item key={"enrolpending"} icon={<ClockCircleOutlined />}>
      <Link to={"/enrolpending"}>Enrol Pending (0)</Link>
    </Menu.Item>
    <Menu.Item key={"facegallery"} icon={<PictureOutlined />}>
      <Link to={"/facegallery"}>Face Gallery</Link>
    </Menu.Item>
    <Menu.Item key={"history"} icon={<HistoryOutlined />}>
      <Link to={"/history"}>Attendance History</Link>
    </Menu.Item>
  </Menu>
  );
};
