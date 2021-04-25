import { LockOutlined, MailOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import { Button, Card, Form, Input, Layout, message, Radio, Checkbox, Divider, Space } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeaderNavbar } from '../../../components/common/mainMenu';
import { Footer } from '../../../components/common/sharedLayout';
import { AuthContext } from '../../../context';
import { CheckError } from "../../../utils/ErrorHandling";
import { REGISTER_USER } from '../../../graphql/mutation';
import { useForm } from '../../../utils/hooks';

import { LOGIN_GOOGLE_USER } from '../../../graphql/mutation';
import GoogleLogin from 'react-google-login';
import { GOOGLE_CLIENT_ID } from "../../../config";

const { Content } = Layout;

export default (props) => {
  const context = useContext(AuthContext);

  const { onChange, onSubmit, values } = useForm(registerUser, {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userLevel: 0,
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push('/dashboard');
      message.info('Welcome To Face In!');
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

  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [pressedGoogleLogin, setPressedGoogleLogin] = useState(false);

  function registerUser() {
    addUser();
  }

  return (
    <Layout className='signin layout'>
      <HeaderNavbar />

      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Form
            name='basic'
            initialValues={{ remember: true }}
            onFinish={onSubmit}
          >
            <br />
            <Form.Item
              label='Email'
              name='email'
              rules={[
                { required: true, message: 'Please input your email!' },
                {
                  pattern: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/,
                  message: 'Please enter valid email!',
                },
              ]}
            >
              <Input
                name='email'
                placeholder='Enter your email'
                prefix={<MailOutlined />}
                onChange={onChange}
              />
            </Form.Item>

            <Form.Item
              label='First Name'
              name='firstName'
              rules={[
                { required: true, message: 'Please input your first name!' },
                { min: 1, message: 'Please enter more than 3 character' },
                {
                  whitespace: true,
                  message: 'Please do not insert whitespace only!',
                },
              ]}
            >
              <Input
                name='firstName'
                placeholder='Enter your first name'
                prefix={<UserOutlined />}
                onChange={onChange}
              />
            </Form.Item>

            <Form.Item
              label='Last Name'
              name='lastName'
              rules={[
                { required: true, message: 'Please input your last name!' },

                { min: 1, message: 'Please enter more than 3 character' },
                {
                  whitespace: true,
                  message: 'Please do not insert whitespace only!',
                },
              ]}
            >
              <Input
                name='lastName'
                placeholder='Enter your last name'
                prefix={<UserOutlined />}
                onChange={onChange}
              />
            </Form.Item>

            <Form.Item
              label='Staff ID/Matrix No'
              name='cardID'
              rules={[
                {
                  required: true,
                  message: 'Please input your staff ID/Matrix No!',
                },
              ]}
            >
              <Input
                name='cardID'
                placeholder='Enter your staff ID/Matrix No'
                onChange={onChange}
              />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Please enter more than 6 character' },
                {
                  whitespace: true,
                  message: 'Please do not insert whitespace only!',
                },
              ]}
            >
              <Input.Password
                name='password'
                placeholder='Enter your password'
                prefix={<LockOutlined />}
                onChange={onChange}
              />
            </Form.Item>

            <Form.Item
              label='Confirm Password'
              name='confirmPassword'
              rules={[
                {
                  required: true,
                  message: 'Please input your confirm password!',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      'The two passwords that you entered do not match!'
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                name='confirmPassword'
                placeholder='Enter your confirm password'
                prefix={<LockOutlined />}
                onChange={onChange}
              />
            </Form.Item>
            <Form.Item label='Role' name='userLevel' valuePropName='checked'>
              <Radio.Group
                name='userLevel'
                value={values.userLevel}
                onChange={onChange}
              >
                <Radio value={0}>Student</Radio>
                <Radio value={1}>Lecturer</Radio>
              </Radio.Group>
            </Form.Item>
            <Divider />

            <Form.Item>
              <Button type='primary' htmlType='submit' loading={loading} disabled={pressedGoogleLogin || loginGoogleUserStatus.loading}>
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
