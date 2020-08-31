/*
    menu item for lecturer (for future more functionality)
*/

//react
import React from "react";
import { Link } from "react-router-dom";

//antd
import { Menu } from "antd";
import {
  AliwangwangOutlined,
  HistoryOutlined,
  HomeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

export default () => {
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  return (
    <Menu theme="dark" mode="vertical" defaultSelectedKeys={[path]}>
      <Menu.Item key={"dashboard"} icon={<HomeOutlined />}>
        <Link to={"/dashboard"}>Home</Link>
      </Menu.Item>
      <Menu.Item key={"addcourse"} icon={<PlusCircleOutlined />}>
        <Link to={"/addcourse"}>Add Course</Link>
      </Menu.Item>
      <Menu.Item key={"enrolrequest"} icon={<AliwangwangOutlined />}>
        <Link to={"/enrolrequest"}>Enrol Request (0)</Link>
      </Menu.Item>
      <Menu.Item key={"history"} icon={<HistoryOutlined />}>
        <Link to={"/history"}>Attendance History</Link>
      </Menu.Item>
    </Menu>
  );
};
