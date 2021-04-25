import { useMutation } from "@apollo/react-hooks";
import { Button, Card, Form, Input, Layout, message } from "antd";
import React, { useContext } from "react";
import { Footer, Greeting, Navbar, PageTitleBreadcrumb } from "../sharedLayout";
import { AuthContext, CourseContext } from "../../../context";
import { CheckError } from "../../../utils/ErrorHandling";
import { ADD_COURSE_MUTATION } from "../../../graphql/mutation";
import { useForm } from "../../../utils/hooks";

const { Content } = Layout;

export default ({ refetchTableTotal, refetchTable }) => {
  const { user } = useContext(AuthContext);
  const { addCourse } = useContext(CourseContext);
  const { onSubmit, onChange, values } = useForm(submitCallback);

  const [addCourseCallback, { loading }] = useMutation(ADD_COURSE_MUTATION, {
    update() {
      message.success("Create course successfully.");
      refetchTableTotal();
      refetchTable();
    },
    onError(err) {
      CheckError(err);
    },
    variables: {
      name: values.courseName,
      code: values.courseCode,
      session: values.courseSession,
    },
  });

  function submitCallback() {
    addCourseCallback();
  }

  return (
    <Content>
      <Card title="Add Course Form" className="addCourse__card">
        <br />
        <Form className="addCourse__form" name="basic" onFinish={onSubmit}>
          <Form.Item
            label="Course Code"
            name="courseCode"
            rules={[{ required: true, message: "Please input course code!" }]}
          >
            <Input
              name="courseCode"
              placeholder="Enter course code"
              onChange={onChange}
            />
          </Form.Item>

          <Form.Item
            label="Course Name"
            name="courseName"
            rules={[{ required: true, message: "Please input course name!" }]}
          >
            <Input
              name="courseName"
              placeholder="Enter course name"
              onChange={onChange}
            />
          </Form.Item>

          <Form.Item
            label="Course Session"
            name="courseSession"
            rules={[
              { required: true, message: "Please input course session!" },
            ]}
          >
            <Input
              name="courseSession"
              placeholder="Enter course session"
              onChange={onChange}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Content>
  );
};
