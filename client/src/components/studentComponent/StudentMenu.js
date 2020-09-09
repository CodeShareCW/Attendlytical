import {
  ClockCircleOutlined,
  HistoryOutlined,
  HomeOutlined,
  PictureOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import React, { useContext } from "react";
import { FpsView } from "react-fps";
import { Link } from "react-router-dom";
import { NavbarContext } from "../../context";


export default () => {
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);

  const { collapsed } = useContext(NavbarContext);

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
      {!collapsed && <FpsView width={190} height={100} top={525} />}
    </Menu>
  );
};
