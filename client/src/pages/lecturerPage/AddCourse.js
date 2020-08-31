import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Layout, Form, Input, Button, Breadcrumb, Card, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { AuthContext } from "../../context/auth";
import { NavbarContext } from "../../context/navbar";
import { CourseContext } from "../../context/course";

import { useForm } from "../../utils/hooks";
import Navbar from "../../components/common/Navbar";
import Greeting from "../../components/common/Greeting";
import "./AddCourse.css";

const { Header, Sider, Content, Footer } = Layout;

export default (props) => {
  const { user } = useContext(AuthContext);
  const { addCourse } = useContext(CourseContext);
  const { collapsed, toggleCollapsed } = useContext(NavbarContext);
  const { onSubmit, onChange, values } = useForm(submitCallback);

  const [addCourseForGQL, { loading }] = useMutation(ADD_COURSE_MUTATION, {
    update(_, { data }) {
      console.log(data);
      addCourse(data.createCourse);
      props.history.push("/course/"+data.createCourse.shortID);
    },
    onError(err) {
      if (err.message === "GraphQL error: Invalid/Expired token")
        window.location.reload();
      message.error(err.message);
    },
    variables: {
      name: values.courseName,
      code: values.courseCode,
      session: values.courseSession,
    },
  });

  function submitCallback() {
    addCourseForGQL();
  }

  return (
    <div className="addCourse">
      <Layout className="addCourse layout">
        <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
          <Navbar />
        </Sider>
        <Layout>
          <Greeting firstName={user.firstName} />
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb__item">
              <Link to="/addcourse">Add Course</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Content className="addCourse__content">
            <Card className="addCourse__card">
              <Form
                className="addCourse__form"
                name="basic"
                onFinish={onSubmit}
              >
                <Form.Item
                  label="Course Code"
                  name="courseCode"
                  rules={[
                    { required: true, message: "Please input course code!" },
                  ]}
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
                  rules={[
                    { required: true, message: "Please input course name!" },
                  ]}
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
          <Footer style={{ textAlign: "center" }}>
            Face In @ {new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};
const ADD_COURSE_MUTATION = gql`
  mutation createCourse($code: String!, $name: String!, $session: String!) {
    createCourse(courseInput: { code: $code, name: $name, session: $session }) {
      _id
      shortID
      code
      name
      session
      createdAt
    }
  }
`;
