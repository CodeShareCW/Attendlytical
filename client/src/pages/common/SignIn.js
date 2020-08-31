import React, { useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Layout, Form, Input, Button, Checkbox, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

import { useForm } from "../../utils/hooks";
import { AuthContext } from "../../context/auth";
import HeaderNavbar from "../../components/common/HeaderNavbar";

const { Content, Footer } = Layout;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 6 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 4 },
};
export default (props) => {
  const context = useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/dashboard");
    },
    onError(err) {
      message.error(err.message);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  const onFinish = (values) => {
    onSubmit();
  };

  const onFinishFailed = (errorInfo) => {};
  console.log(props);
  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <HeaderNavbar />

      <Content style={{ backgroundColor: "#fff" }}>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <br />
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              name="email"
              placeholder="Enter your email"
              prefix={<MailOutlined />}
              onChange={onChange}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              name="password"
              placeholder="Enter your password"
              prefix={<LockOutlined />}
              onChange={onChange}
            />
          </Form.Item>

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <Footer
        style={{ backgroundColor: "white", textAlign: "center", width: "100%" }}
      >
        <span>Face In @ {new Date().getFullYear()}</span>
      </Footer>
    </Layout>
  );
};
const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      email
      firstName
      lastName
      cardID
      profilePictureURL
      userLevel
      token
    }
  }
`;
