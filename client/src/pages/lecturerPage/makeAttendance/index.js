import { useQuery } from "@apollo/react-hooks";
import { Layout } from "antd";
import React, { useState } from "react";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { CheckError } from "../../../ErrorHandling";
import { FETCH_ATTENDANCE_QUERY } from "../../../graphql/query";
import F2FAttendance from "./F2FAttendance";
import RemoteAttendance from "./remoteAttendance";
import {LoadingSpin} from "../../../utils/LoadingSpin";

export default (props) => {
  const [mode, setMode] = useState("Remote");
  const { data, loading, error } = useQuery(FETCH_ATTENDANCE_QUERY, {
    onCompleted: async (data) => {
      setMode(data.getAttendance.mode);
    },
    onError(err) {
      CheckError(err);
    },
    variables: {
      attendanceID: props.match.params.attendanceID,
    },
  });

  const titleList = [
    { name: "Home", link: "/dashboard" },
    {
      name: `Course: ${props.match.params.courseID}`,
      link: `/course/${props.match.params.courseID}`,
    },
    {
      name: `Attendance Room: ${props.match.params.attendanceID}`,
      link: `/course/${props.match.params.courseID}/attendanceRoom/${props.match.params.attendanceID}`,
    },
  ];
  const { Content } = Layout;

  console.log(mode);
  return (
    <Layout className="layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb titleList={titleList} />
        <Content>
          {data && mode == "F2F" && <F2FAttendance {...props} />}
          {data && mode == "Remote" && <RemoteAttendance {...props} />}
          <LoadingSpin loading={loading} />
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};
