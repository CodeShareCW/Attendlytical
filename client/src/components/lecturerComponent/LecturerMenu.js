import {
  AliwangwangOutlined,
  HistoryOutlined,
  HomeOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import { useQuery } from "@apollo/react-hooks";
import { Menu } from "antd";
import React, { useContext } from "react";
import { FpsView } from "react-fps";
import { Link } from "react-router-dom";
import { EnrolmentContext, NavbarContext } from "../../context";
import { CheckError } from "../../ErrorHandling";
import { FETCH_ENROLREQUEST_COUNT_QUERY } from "../../graphql/query";


export default () => {
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);

  const {
    initialCountDone,
    enrolCount,
    setEnrolCount,
    setInitialCountDone,
  } = useContext(EnrolmentContext);
  const { collapsed } = useContext(NavbarContext);

  const enrolRequestCount = useQuery(FETCH_ENROLREQUEST_COUNT_QUERY, {
    onCompleted(data) {
      if (!initialCountDone) setEnrolCount(data.getEnrolRequestCount);

      setInitialCountDone(true);
    },
    onError(err) {
      CheckError(err);
    },
  });

  return (
    <Menu theme="dark" mode="vertical" defaultSelectedKeys={[path]}>
      <Menu.Item key={"dashboard"} icon={<HomeOutlined />}>
        <Link to={"/dashboard"}>Home</Link>
      </Menu.Item>
      <Menu.Item key={"addcourse"} icon={<PlusCircleOutlined />}>
        <Link to={"/addcourse"}>Add Course</Link>
      </Menu.Item>
      <Menu.Item key={"enrolrequest"} icon={<AliwangwangOutlined />}>
        <Link to={"/enrolrequest"}>Enrol Request ({enrolCount})</Link>
      </Menu.Item>
      <Menu.Item key={"history"} icon={<HistoryOutlined />}>
        <Link to={"/history"}>Attendance History</Link>
      </Menu.Item>
      {!collapsed && <FpsView width={190} height={100} top={525} />}
    </Menu>
  );
};
