import { useMutation } from "@apollo/react-hooks";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Layout,
  Radio,
  Space,
  Typography,
} from "antd";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { APP_LOGO_URL } from "../../../assets";
import Footer from "../../../components/common/sharedLayout/Footer";
import { AuthContext } from "../../../context";
import { CheckError } from "../../../utils/ErrorHandling";
import { EDIT_CARDID_AND_ROLE_MUTATION } from "../../../graphql/mutation";
import { useForm } from "../../../utils/hooks";

const { Content } = Layout;

const { Title } = Typography;

export default (props) => {
  const { user, login, logout } = useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(editCardIDAndRole, {
    userLevel: 0,
    cardID: "",
  });

  const [editCardIDAndRoleCallback, editCardIDAndRoleStatus] = useMutation(
    EDIT_CARDID_AND_ROLE_MUTATION,
    {
      update(_, { data: { editCardIDAndUserLevel: userData } }) {
        //reset login stuff
        login(userData);
        props.history.push("/dashboard");
      },
      variables: values,
      onError(err) {
        CheckError(err);
      },
    }
  );
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  function editCardIDAndRole() {
    editCardIDAndRoleCallback();
  }

  return (
    <Layout className="layout">
      <Content
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Card
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            className="avatar"
            size="large"
            alt="Face In"
            src={APP_LOGO_URL.link}
            onError={(err) => {
              console.log(err);
            }}
          />
          &nbsp; &nbsp;
          <Space>
            <Title level={3}>Just a few seconds...</Title>
          </Space>
          <Divider />
          <Title level={4}>
            Dear {user.firstName} {user.lastName}, tell us more about you!
          </Title>
          <Form
            name="basic"
            initialValues={{ userLevel: values.role, cardID: values.cardID }}
            onFinish={onSubmit}
          >
            <Form.Item
              label="Staff ID/Matrix No"
              name="cardID"
              rules={[
                {
                  required: true,
                  message: "Please input your staff ID/Matrix No!",
                },
              ]}
            >
              <Input
                placeholder="Enter your staff ID/Matrix No"
                name="cardID"
                onChange={onChange}
              />
            </Form.Item>
            <Form.Item label="Role" name="userLevel" valuePropName="checked">
              <Radio.Group
                name="userLevel"
                value={values.userLevel}
                onChange={onChange}
              >
                <Radio value={0}>Student</Radio>
                <Radio value={1}>Lecturer</Radio>
              </Radio.Group>
            </Form.Item>
            <Divider />
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={editCardIDAndRoleStatus.loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="danger"
            htmlType="submit"
            disabled={editCardIDAndRoleStatus.loading}
            onClick={() => logout()}
          >
            Logout
          </Button>
        </Card>
      </Content>
      <Footer />
    </Layout>
  );
};
