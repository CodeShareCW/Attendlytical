import {
  ClockCircleOutlined,
  HistoryOutlined,
  HomeOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/react-hooks";
import { Drawer } from "antd";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { EnrolmentContext } from "../../context";
import { CheckError } from "../../ErrorHandling";
import { FETCH_ENROLPENDING_COUNT_QUERY } from "../../graphql/query";

export default ({ isCollapseMenuOpen, setIsCollapseMenuOpen }) => {
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);

  const {
    enrolCount,
    getEnrolCount,
  } = useContext(EnrolmentContext);
  const { data } = useQuery(FETCH_ENROLPENDING_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });

  useEffect(() => {
    if (data) {
      getEnrolCount(data.getEnrolPendingCount);
    }
  }, [data]);

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
        <Link to={"/enrolpending"}>
          <ClockCircleOutlined />
          &nbsp; Enrol Pending (
          {enrolCount})
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
