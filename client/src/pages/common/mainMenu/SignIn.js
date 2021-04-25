import { LoadingOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Layout,
  Space
} from 'antd';
import React, { useContext, useState } from 'react';
import GoogleLogin from 'react-google-login';
import HeaderNavbar from '../../../components/common/mainMenu/HeaderNavbar';
import Footer from '../../../components/common/sharedLayout/Footer';
import { GOOGLE_CLIENT_ID } from "../../../config";
import { AuthContext } from '../../../context';
import { CheckError } from "../../../utils/ErrorHandling";
import { LOGIN_GOOGLE_USER, LOGIN_USER } from '../../../graphql/mutation';
import { useForm } from '../../../utils/hooks';
const { Content } = Layout;

export default (props) => {
  const context = useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    email: '',
    password: '',
  });

  const [pressedGoogleLogin, setPressedGoogleLogin] = useState(false);

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push('/dashboard');
    },
    onError(err) {
      CheckError(err);
    },
    variables: values,
  });

  const [loginGoogleUser, loginGoogleUserStatus] = useMutation(
    LOGIN_GOOGLE_USER,
    {
      update(_, { data: { googleSignIn: userData } }) {
        context.login(userData);
        props.history.push('/dashboard');
      },
      onError(err) {
        CheckError(err);
      },
    }
  );

  function loginUserCallback() {
    loginUser();
  }

  const handleGoogleResponse = (res) => {
    setPressedGoogleLogin(false);
    loginGoogleUser({
      variables: {
        googleID: res.profileObj.googleId,
        googleEmail: res.profileObj.email,
        googleFirstName: res.profileObj.givenName,
        googleLastName: res.profileObj.familyName,
        googleProfilePicture: res.profileObj.imageUrl,
      },
    });
  };

  return (
    <Layout className='signin layout'>
      <HeaderNavbar />

      <Content
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Card
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Form
            name='basic'
            initialValues={{ remember: true }}
            onFinish={onSubmit}
          >
            <br />
            <Form.Item
              label='Email'
              name='email'
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input
                name='email'
                placeholder='Enter your email'
                prefix={<MailOutlined />}
                onChange={onChange}
              />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                name='password'
                placeholder='Enter your password'
                prefix={<LockOutlined />}
                onChange={onChange}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                disabled={pressedGoogleLogin || loginGoogleUserStatus.loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Divider />
        <Space>
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText='Continue With Google'
            onSuccess={handleGoogleResponse}
            onFailure={(error) => {
              setPressedGoogleLogin(false);
              console.error(error);
            }}
            cookiePolicy={'single_host_origin'}
            onRequest={() => setPressedGoogleLogin(true)}
            disabled={pressedGoogleLogin}
          />
        </Space>
        {loginGoogleUserStatus.loading && (
          <Space>
            <Divider />
              Redirecting, please wait...
            <LoadingOutlined />
          </Space>
        )}
      </Content>
      <Footer />
    </Layout>
  );
};
