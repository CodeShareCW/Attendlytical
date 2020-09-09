import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/react-hooks";
import { Button, Checkbox, Form, Input, Layout } from "antd";
import React, { useContext } from "react";
import HeaderNavbar from "../../../components/common/mainMenu/HeaderNavbar";
import Footer from "../../../components/common/sharedLayout/Footer";
import { AuthContext } from "../../../context";
import { CheckError } from "../../../ErrorHandling";
import { LOGIN_USER } from "../../../graphql/mutation";
import { useForm } from "../../../utils/hooks";


const { Content } = Layout;

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
        CheckError(err);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <Layout className="signin layout">
      <HeaderNavbar />

      <Content>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
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
      <Footer />
    </Layout>
  );
};

