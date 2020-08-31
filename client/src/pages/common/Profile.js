//react
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

//apollo-graphql
import { useMutation } from "@apollo/react-hooks";
import {EDIT_PROFILE_MUTATION} from "../../graphql/mutation";

//antd
import {
  Avatar,
  Layout,
  Form,
  Input,
  Button,
  Breadcrumb,
  Card,
  message,
} from "antd";
import { UserOutlined, LoadingOutlined } from "@ant-design/icons";

//context
import { AuthContext } from "../../context/auth";
import { NavbarContext } from "../../context/navbar";

//comp
import Navbar from "../../components/common/Navbar";
import Greeting from "../../components/common/Greeting";
import Footer from "../../components/common/Footer";

//error
import { CheckError } from "../../ErrorHandling";

//style
import "./Profile.css";

const { Sider, Content } = Layout;

export default () => {
  const { user, editProfile } = useContext(AuthContext);
  const { collapsed, toggleCollapsed } = useContext(NavbarContext);

  const [previewSource, setPreviewSource] = useState(null);
  const [editProfileMutation, { loading }] = useMutation(
    EDIT_PROFILE_MUTATION,
    {
      update(_, { data }) {
        editProfile(data.editProfile);
        message.success("Edit Success!");
      },
      onError(err) {
        CheckError(err);
      },
    }
  );

  function submitCallback(values) {
    editProfileMutation({
      variables: {...values, profilePicture: previewSource}
    });
  }

  const previewFile = (file) => {
    console.log(file)
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };
  return (
    <div className="addCourse">
      <Layout className=" layout">
        <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
          <Navbar />
        </Sider>
        <Layout>
          <Greeting />
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb__item">
              <Link to="/profile">Profile</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Content className="profile__content">
            <Card className="profile__card">
              <div className="profile__picture__container">
                <Avatar
                  src={previewSource ? previewSource : user.profilePictureURL}
                  size={200}
                  className="profile__picture"
                  icon={<UserOutlined />}
                />
                <label className="profile__picture__label" htmlFor="files">
                  Change Profile Picture
                </label>
                <input
                  className="profile__picture__input"
                  type="file"
                  id="files"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    previewFile(file);
                  }}
                  accept="image/x-png,image/gif,image/jpeg"
                />
              </div>

              <Form
                className="profile__form"
                name="basic"
                onFinish={submitCallback}
                initialValues={{
                  firstName: user.firstName,
                  lastName: user.lastName,
                  cardID: user.cardID,
                }}
              >
                <Form.Item label="Email" name="email">
                  <Input name="email" defaultValue={user.email} disabled />
                </Form.Item>

                <Form.Item label="Role" name="Role">
                  <Input
                    name="role"
                    defaultValue={`${
                      user.userLevel === 0 ? "Student" : "Lecturer"
                    }`}
                    disabled
                  />
                </Form.Item>

                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    { required: true, message: "Please input first name!" },
                  ]}
                >
                  <Input name="firstName" placeholder="Enter your first name" />
                </Form.Item>

                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please enter your last name!" },
                  ]}
                >
                  <Input name="lastName" placeholder="Enter your last name" />
                </Form.Item>

                <Form.Item
                  label={user.userLevel === 0 ? "Matric Number" : "Staff ID"}
                  name="cardID"
                  rules={[
                    {
                      required: true,
                      message: `Please your ${
                        user.userLevel === 0 ? "Matric Number" : "Staff ID"
                      }!`,
                    },
                  ]}
                >
                  <Input
                    name="cardID"
                    placeholder={`Enter your ${
                      user.userLevel === 0 ? "Matric Number" : "Staff ID"
                    }`}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" disabled={loading}>
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

