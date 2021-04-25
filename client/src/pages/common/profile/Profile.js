import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import { Avatar, Button, Card, Form, Input, Layout, message } from 'antd';
import React, { useContext, useState } from 'react';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { AuthContext } from '../../../context';
import { CheckError } from "../../../utils/ErrorHandling";
import { EDIT_PROFILE_MUTATION } from '../../../graphql/mutation';
import './Profile.css';

const { Content } = Layout;

export default () => {
  const { user, avatarColor, editProfile } = useContext(AuthContext);

  const [previewSource, setPreviewSource] = useState(null);
  const [editProfileMutation, { loading }] = useMutation(
    EDIT_PROFILE_MUTATION,
    {
      update(_, { data }) {
        editProfile(data.editProfile);
        message.success('Edit Success!');
      },
      onError(err) {
        CheckError(err);
      },
    }
  );

  function submitCallback(values) {
    editProfileMutation({
      variables: { ...values, profilePicture: previewSource },
    });
  }

  const previewFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  return (
    <div className='addCourse'>
      <Layout className=' layout'>
        <Navbar />
        <Layout>
          <Greeting />
          <PageTitleBreadcrumb
            titleList={[{ name: 'Profile', link: '/profile' }]}
          />
          <Content className='profile__content'>
            <Card className='profile__card'>
              <div className='profile__picture__container'>
                <Avatar
                  src={previewSource ? previewSource : user.profilePictureURL}
                  size={200}
                  className='profile__picture'
                  style={!user.profilePictureURL&&{...avatarColor, fontSize: "100px"}}
                >
                  {user.firstName[0]}
                </Avatar>
                <label className='profile__picture__label' htmlFor='files'>
                  Change Profile Picture
                </label>
                <input
                  className='profile__picture__input'
                  type='file'
                  id='files'
                  onChange={(e) => {
                    const file = e.target.files[0];
                    previewFile(file);
                  }}
                  accept='image/x-png,image/gif,image/jpeg'
                />
              </div>

              <Form
                className='profile__form'
                name='basic'
                onFinish={submitCallback}
                initialValues={{
                  firstName: user.firstName,
                  lastName: user.lastName,
                  cardID: user.cardID,
                }}
              >
                <Form.Item label='Email' name='email'>
                  <Input name='email' defaultValue={user.email} disabled />
                </Form.Item>

                <Form.Item label='Role' name='Role'>
                  <Input
                    name='role'
                    defaultValue={`${
                      user.userLevel === 0 ? 'Student' : 'Lecturer'
                    }`}
                    disabled
                  />
                </Form.Item>

                <Form.Item
                  label='First Name'
                  name='firstName'
                  rules={[
                    { required: true, message: 'Please input first name!' },
                  ]}
                >
                  <Input name='firstName' placeholder='Enter your first name' />
                </Form.Item>

                <Form.Item
                  label='Last Name'
                  name='lastName'
                  rules={[
                    { required: true, message: 'Please enter your last name!' },
                  ]}
                >
                  <Input name='lastName' placeholder='Enter your last name' />
                </Form.Item>

                <Form.Item
                  label={user.userLevel === 0 ? 'Matric Number' : 'Staff ID'}
                  name='cardID'
                  rules={[
                    {
                      required: true,
                      message: `Please your ${
                        user.userLevel === 0 ? 'Matric Number' : 'Staff ID'
                      }!`,
                    },
                  ]}
                >
                  <Input
                    name='cardID'
                    placeholder={`Enter your ${
                      user.userLevel === 0 ? 'Matric Number' : 'Staff ID'
                    }`}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type='primary' htmlType='submit' disabled={loading}>
                    Submit {loading ? <LoadingOutlined /> : null}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  );
};
