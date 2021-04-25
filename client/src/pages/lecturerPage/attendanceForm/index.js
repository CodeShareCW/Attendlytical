import { LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Layout,
  message,
  Select,
  TimePicker,
} from "antd";
import moment from "moment";
import React, { useContext, useState } from "react";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { AttendanceContext } from "../../../context";
import { CheckError } from "../../../utils/ErrorHandling";
import { CREATE_ATTENDANCE_MUTATION } from "../../../graphql/mutation";
import { FETCH_COURSE_QUERY } from "../../../graphql/query";
const { Content } = Layout;
const { Option } = Select;
export default (props) => {
  const titleList = [
    { name: "Home", link: "/dashboard" },
    {
      name: `Course: ${props.match.params.id}`,
      link: `/course/${props.match.params.id}`,
    },
    { name: "Take Attendance", link: "takeAttendance" },
  ];

  const [selectedDate, setSelectedDate] = useState(moment().toISOString());
  const [selectedTime, setSelectedTime] = useState(moment().toISOString());

  const courseGQLQuery = useQuery(FETCH_COURSE_QUERY, {
    onError(err) {
      props.history.push("/dashboard");
      CheckError(err);
    },
    variables: {
      id: props.match.params.id,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [submitAttendanceCallback, submitAttendanceStatus] = useMutation(
    CREATE_ATTENDANCE_MUTATION,
    {
      update(_, {data}) {
        message.success("Success Submit.");
        props.history.push(`/course/${props.match.params.id}/attendanceRoom/${data.createAttendance._id}`);
      },
      onError(err) {
        CheckError(err);
      },
    }
  );

  //form
  const handleDateChange = (value) => {
    setSelectedDate(value?._d.toISOString());
  };

  const handleTimeChange = (value) => {
    setSelectedTime(value?._d.toISOString());
  };

  const handleSubmit = () => {
    if (courseGQLQuery.data)
      submitAttendanceCallback({
        variables: {
          date: selectedDate,
          time: selectedTime,
          courseID: props.match.params.id,
        },
      });
  };
  return (
    <Layout className="layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb titleList={titleList} />
        <Content>
          <Card title="Attendance Form" className="addCourse__card">
            <Form onFinish={handleSubmit}>
              <Form.Item label="Course">
                {courseGQLQuery.data && (
                  <span>
                    {courseGQLQuery.data.getCourse.code} -
                    {courseGQLQuery.data.getCourse.name} (
                    {courseGQLQuery.data.getCourse.session})
                  </span>
                )}
                {courseGQLQuery.loading && (
                  <>
                    Fetching Course Detail... <LoadingOutlined />
                  </>
                )}
              </Form.Item>
              <Form.Item label="Date">
                <DatePicker
                  defaultValue={moment()}
                  format="YYYY/MM/DD"
                  onChange={handleDateChange}
                />
              </Form.Item>
              <Form.Item label="Time">
                {" "}
                <TimePicker
                  defaultValue={moment()}
                  format="HH:mm"
                  onChange={handleTimeChange}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  disabled={courseGQLQuery.loading}
                  type="primary"
                  htmlType="submit"
                  loading={submitAttendanceStatus.loading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
