import {
  ClockCircleOutlined,
  HistoryOutlined,
  HomeOutlined,
  PictureOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import { useQuery } from "@apollo/react-hooks";
import { Drawer } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { EnrolmentContext } from "../../context";
import { CheckError } from "../../ErrorHandling";
import { FETCH_ENROLREQUEST_COUNT_QUERY } from "../../graphql/query";


export default ({ isCollapseMenuOpen, setIsCollapseMenuOpen }) => {
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);

  const {
    initialCountDone,
    enrolCount,
    setEnrolCount,
    setInitialCountDone,
  } = useContext(EnrolmentContext);

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
    <Drawer
      title="Menu"
      className="drawerMenu"
      visible={isCollapseMenuOpen}
      placement="top"
      onClose={() => {
        setIsCollapseMenuOpen(false);
      }}
    >
      <p>
        <Link to={"/dashboard"}>
          <HomeOutlined />
          &nbsp; Home
        </Link>
      </p>
      <p>
        <Link to={"/enrolcourse"}>
          <PlusCircleOutlined />
          &nbsp; Enrol Course
        </Link>
      </p>
      <p>
        <Link to={"/enrolpending"}>
          <ClockCircleOutlined />
          &nbsp; Enrol Pending (0)
        </Link>
      </p>
      <p>
        <Link to={"/facegallery"}>
          <PictureOutlined />
          &nbsp; Face Gallery
        </Link>
      </p>
      <p>
        <Link to={"/history"}>
          <HistoryOutlined />
          &nbsp; Attendance History
        </Link>
      </p>
    </Drawer>
  );
};
