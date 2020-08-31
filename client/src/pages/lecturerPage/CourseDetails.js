import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Layout,
  Breadcrumb,
  Avatar,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Form,
  Input,
  Table,
  Tag,
  Space,
  Spin,
  message,
} from "antd";

import { UserOutlined, LoadingOutlined } from "@ant-design/icons";

import gql from "graphql-tag";

import { AuthContext } from "../../context/auth";
import { NavbarContext } from "../../context/navbar";

import Navbar from "../../components/common/Navbar";
import Greeting from "../../components/common/Greeting";

import "./CourseDetails.css";

const { Header, Sider, Content, Footer } = Layout;

export default (props) => {
  const columns = [
    {
      title: <strong>Avatar</strong>,
      dataIndex: "profilePictureURL",
      key: "profilePictureURL",
      render: (imgURL) => (
        <Avatar src={imgURL} size={50} icon={<UserOutlined />} />
      ),
    },
    {
      title: <strong>First Name</strong>,
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => (
        <a style={{ justifyContent: "center", textAlign: "center" }}>{text}</a>
      ),
    },
    {
      title: <strong>Last Name</strong>,
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: <strong>Matric Number</strong>,
      dataIndex: "matricNumber",
      key: "matricNumber",
    },
    {
      title: <strong>Attendance Rate</strong>,
      dataIndex: "attendanceRate",
      key: "attendanceRate",
    },
    {
      title: <strong>Warning Count</strong>,
      dataIndex: "warningCount",
      key: "warningCount",
      render: (text) => (
        <div>
          {obtainStudentWarningStatus.loading && <LoadingOutlined />}
          <p>{text}</p>
        </div>
      ),
    },
    {
      title: <strong>Action</strong>,
      key: "action",
      render: (index) => (
        <Space size="middle">
          <Button
            danger
            className="courseDetails__warnBtn"
            onClick={() => {
              handleWarnParticipant(index.key, props.match.params.id);
              setSelectedParticipants(index.key);
            }}
            loading={
              index.key === selectedParticipants &&
              warnParticipantStatus.loading
            }
          >
            Warn
          </Button>
          <Button
            danger
            className="courseDetails__kickBtn"
            onClick={() => {
              handleKickParticipant(index.key, props.match.params.id);
              setSelectedParticipants(index.key);
            }}
            loading={
              index.key === selectedParticipants &&
              kickParticipantStatus.loading
            }
          >
            Kick
          </Button>
        </Space>
      ),
    },
  ];

  const { user } = useContext(AuthContext);
  const { collapsed, toggleCollapsed } = useContext(NavbarContext);

  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const [fetchingParticipants, isFetchingParticipants] = useState(false);
  const [error, SetError] = useState("");

  const { loading, data } = useQuery(FETCH_CREATEDCOURSE_QUERY, {
    onCompleted: (data) => {
      data.getCourse.enrolledStudents.map((item) => {
        isFetchingParticipants(true);
        obtainStudentWarningCallback({
          update(_, { data }) {
            const warning = data.obtainStudentWarning;
            isFetchingParticipants(false);

            setParticipants((prevState) => {
              const newParticipant = {
                key: item._id,
                firstName: item.firstName,
                lastName: item.lastName,
                profilePictureURL: item.profilePictureURL,
                matricNumber: item.cardID,
                warningCount: warning,
              };

              return [...prevState, newParticipant];
            });
          },
          variables: {
            participantID: item._id,
            courseID: props.match.params.id,
          },
        });
      });
    },
    onError(err) {
      if (err.message === "GraphQL error: Invalid/Expired token")
        window.location.reload();
      else if (err.networkError) SetError(err.networkError.message);
      else SetError(err.graphQLErrors[0].message);

      message.error(err.message);
    },
    variables: {
      id: props.match.params.id,
    },
  });

  const [
    obtainStudentWarningCallback,
    obtainStudentWarningStatus,
  ] = useMutation(OBTAIN_STUDENT_WARNING_MUTATION, {
    onError(err) {
      if (err.message === "GraphQL error: Invalid/Expired token")
        window.location.reload();
      else if (err.networkError) SetError(err.networkError.message);
      else SetError(err.graphQLErrors[0].message);

      message.error(err.message);
    },
  });
  const [addParticipantCallback, addParticipantStatus] = useMutation(
    ADD_PARTICIPANT_MUTATION,
    {
      onCompleted: (data) => {
        message.success("Add Success!");
      },
      onError(err) {
        if (err.message === "GraphQL error: Invalid/Expired token")
          window.location.reload();
        else if (err.networkError) SetError(err.networkError.message);
        else SetError(err.graphQLErrors[0].message);

        message.error(err.message);
      },
    }
  );
  const [kickParticipantCallback, kickParticipantStatus] = useMutation(
    KICK_PARTICIPANT_MUTATION,
    {
      onCompleted: (data) => {
        message.success(data.kickParticipant);
      },
      onError(err) {
        if (err.message === "GraphQL error: Invalid/Expired token")
          window.location.reload();
        else if (err.networkError) SetError(err.networkError.message);
        else SetError(err.graphQLErrors[0].message);

        message.error(err.message);
      },
    }
  );

  const [warnParticipantCallback, warnParticipantStatus] = useMutation(
    WARN_PARTICIPANT_MUTATION,
    {
      onCompleted: (data) => {
        message.success(data.warnParticipant);
      },
      onError(err) {
        if (err.message === "GraphQL error: Invalid/Expired token")
          window.location.reload();
        else if (err.networkError) SetError(err.networkError.message);
        else SetError(err.graphQLErrors[0].message);

        message.error(err.message);
      },
    }
  );

  const handleKickParticipant = (participantID, courseID) => {
    kickParticipantCallback({
      update() {
        const updatedParticipant = participants.filter(
          (participant) => participant.key !== participantID
        );
        console.log(updatedParticipant);
        setParticipants(updatedParticipant);
      },
      variables: { participantID, courseID },
    });
  };

  const handleWarnParticipant = (participantID, courseID) => {
    warnParticipantCallback({
      update() {
        const updatedParticipant = participants.filter(
          (participant) => participant.key === participantID
        );
        updatedParticipant.map((item) => (item.warningCount += 1));
      },
      variables: { participantID, courseID },
    });
  };

  const handleAddParticipant = (email, courseID) => {
    addParticipantCallback({
      update(_, { data }) {
        console.log(data.addParticipant._id);
        const newParticipant = {
          key: data.addParticipant._id,
          firstName: data.addParticipant.firstName,
          lastName: data.addParticipant.lastName,
          profilePictureURL: data.addParticipant.profilePictureURL,
          matricNumber: data.addParticipant.cardID,
          warningCount: 0,
        };

        const index = participants.findIndex(
          (participant) => participant.firstName > newParticipant.firstName
        );
        console.log(index);
        let sortedParticipants;
        if (index === -1) {
          sortedParticipants = [...participants, newParticipant];
        } else if (index === 0) {
          sortedParticipants = [newParticipant, ...participants];
        } else {
          sortedParticipants = [
            ...participants.slice(0, index),
            newParticipant,
            ...participants.slice(index),
          ];
        }

        setParticipants(sortedParticipants);
      },
      variables: { email, courseID },
    });
  };

  return (
    <Layout className="courseDetails layout">
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <Navbar />
      </Sider>

      <Layout>
        <Greeting
          firstName={user.firstName}
          profilePicture={user.profilePicture}
        />
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item className="breadcrumb__item">
            <Link to="/dashboard">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb__item">
            <Link
              to={`/course/${props.match.params.id}`}
            >{`Course: ${props.match.params.id}`}</Link>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Content style={{ margin: "24px 16px 0" }}>
          <Card className="courseDetails__card">
            {loading && <Spin tip="Loading..." />}
            {data && (
              <div className="courseDetails__container">
                <Row className="courseDetails__row">
                  <Col>
                    <Card className="courseDetails__info">
                      <p className="courseDetails__shortID">
                        Unique ID: {data.getCourse.shortID}
                      </p>
                      <p>
                        <strong>Code:</strong> {data.getCourse.code}
                      </p>
                      <p>
                        <strong>Name:</strong> {data.getCourse.name}
                      </p>
                      <p>
                        <strong>Session:</strong> {data.getCourse.session}
                      </p>
                      <p>
                        <strong>Total Participants:</strong>{" "}
                        {participants.length}
                      </p>
                      <Button
                        type="primary"
                        className="courseDetails__takeAttendance"
                      >
                        <Link
                          to={`/course/${data.getCourse.shortID}/takeAttendance`}
                        >
                          Take Attendance
                        </Link>
                      </Button>
                      <br />
                      <br />

                      <Link to={`/course/${data.getCourse.shortID}/history`}>
                        View Attendance History
                      </Link>
                    </Card>
                  </Col>
                </Row>
                <Divider
                  orientation="left"
                  style={{ color: "#333", fontWeight: "normal" }}
                >
                  Participants
                </Divider>
                <Row className="courseDetails__row">
                  <Col>
                    <Form
                      onFinish={(value) =>
                        handleAddParticipant(value.email, props.match.params.id)
                      }
                      className="courseDetails__addStudentForm"
                    >
                      <Form.Item
                        className="courseDetails__addStudentForm__formItem"
                        label="Student's Email"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please enter student's email!",
                          },
                        ]}
                        tip="d"
                      >
                        <Input
                          className="courseDetails__addStudentForm__input"
                          name="email"
                          placeholder="Enter student's email"
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          className="courseDetails__addStudentForm__submit"
                          type="primary"
                          loading={addParticipantStatus.loading}
                          htmlType="submit"
                        >
                          Add
                        </Button>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>

                <Row className="courseDetails__row">
                  <Col>{fetchingParticipants && <Spin tip="Loading" />}</Col>
                </Row>

                {!fetchingParticipants && (
                  <Table
                    columns={columns}
                    style={{ textAlign: "center" }}
                    dataSource={participants}
                  />
                )}
              </div>
            )}
            {!data && !loading && (
              <div>
                <p>Something wrong...</p>
                {error.length > 0 && (
                  <div className="error">
                    <p>Error Info: {error}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <span>Face In @ {new Date().getFullYear()}</span>
        </Footer>
      </Layout>
    </Layout>
  );
};

const FETCH_CREATEDCOURSE_QUERY = gql`
  query getCourse($id: ID!) {
    getCourse(courseID: $id) {
      _id
      shortID
      name
      code
      session
      createdAt
      enrolledStudents {
        _id
        firstName
        lastName
        profilePictureURL
        cardID
      }
    }
  }
`;

const KICK_PARTICIPANT_MUTATION = gql`
  mutation kickParticipant($participantID: ID!, $courseID: String!) {
    kickParticipant(participantID: $participantID, courseID: $courseID)
  }
`;

const WARN_PARTICIPANT_MUTATION = gql`
  mutation warnParticipant($participantID: ID!, $courseID: String!) {
    warnParticipant(participantID: $participantID, courseID: $courseID)
  }
`;

const OBTAIN_STUDENT_WARNING_MUTATION = gql`
  mutation obtainStudentWarning($participantID: ID!, $courseID: String!) {
    obtainStudentWarning(participantID: $participantID, courseID: $courseID)
  }
`;

const ADD_PARTICIPANT_MUTATION = gql`
  mutation addParticipant($email: String!, $courseID: String!) {
    addParticipant(email: $email, courseID: $courseID) {
      _id
      firstName
      lastName
      cardID
      profilePictureURL
    }
  }
`;
