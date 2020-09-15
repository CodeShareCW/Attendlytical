import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Layout,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import React, { useContext, useState } from "react";
import CourseDetailCard from "./CourseDetailCard";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { AuthContext } from "../../../context";
import { CheckError } from "../../../ErrorHandling";
import {
  KICK_PARTICIPANT_MUTATION,
  OBTAIN_STUDENT_WARNING_MUTATION,
  WARN_PARTICIPANT_MUTATION,
} from "../../../graphql/mutation";
import { FETCH_CREATEDCOURSE_QUERY } from "../../../graphql/query";
import { LoadingSpin } from "../../../utils/LoadingSpin";
import "./CourseDetails.css";

const { Content } = Layout;

export default (props) => {
  const stud_columns = [
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
  ];

  const lect_columns = [
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
              setSelectedParticipant(index);
            }}
            loading={
              index.key === selectedParticipant.key && warnParticipantStatus.loading
            }
          >
            Warn
          </Button>
          <Button
            danger
            className="courseDetails__kickBtn"
            onClick={() => {
              setIsVisible(true);
              setSelectedParticipant(index);
            }}
            loading={
              index.key === selectedParticipant.key && kickParticipantStatus.loading
            }
          >
            Kick
          </Button>
        </Space>
      ),
    },
  ];

  const { user } = useContext(AuthContext);

  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState({});

  const [fetchingParticipants, isFetchingParticipants] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const { loading, data, refetch } = useQuery(FETCH_CREATEDCOURSE_QUERY, {
    onCompleted: (data) => {
      data.getCourse.enrolledStudents.map((item) => {
        isFetchingParticipants(true);
        obtainStudentWarningCallback({
          update(_, { data }) {
            const warning = data.obtainStudentWarning;
            isFetchingParticipants(false);

            setParticipants((prevState) => {

              if (item._id === user._id) {
                item.firstName = "You";
                item.lastName = "You";
              }
              const newParticipant = {
                key: item._id,
                firstName: item.firstName,
                lastName: item.lastName,
                profilePictureURL: item.profilePictureURL,
                matricNumber: item.cardID,
                warningCount: warning,
              };

              if (item._id === user._id) return [newParticipant, ...prevState];
              return [...prevState, newParticipant];
            });
          },
          onError(err) {
            CheckError(err);
          },
          variables: {
            participantID: item._id,
            courseID: data.getCourse._id,
          },
        });
      });
    },
    onError(err) {
      CheckError(err);
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
      CheckError(err);
    },
  });

  const [kickParticipantCallback, kickParticipantStatus] = useMutation(
    KICK_PARTICIPANT_MUTATION,
    {
      onCompleted: (data) => {
        message.success(data.kickParticipant);
      },
      onError(err) {
        CheckError(err);
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
        CheckError(err);
      },
    }
  );

  const handleKickParticipant = (participantID, courseID) => {
    kickParticipantCallback({
      update() {
        const updatedParticipant = participants.filter(
          (participant) => participant.key !== participantID
        );
        setParticipants(updatedParticipant);
        //refetch the participant after kicked
        refetch();
        setIsVisible(false);
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
        //refetch the participant after warned
        refetch();
      },
      variables: { participantID, courseID },
    });
  };

  const titleList = [
    { name: "Home", link: "/dashboard" },
    {
      name: `Course: ${props.match.params.id}`,
      link: `/course/${props.match.params.id}`,
    },
  ];

  const TableDisplay = ({ isFetch }) =>
    !isFetch && (
      <Table
        columns={user.userLevel === 0 ? stud_columns : lect_columns}
        style={{ textAlign: "center" }}
        dataSource={participants}
      />
    );

  return (
    <Layout className="courseDetails layout">
      <Navbar />

      <Layout>
        <Greeting
          firstName={user.firstName}
          profilePicture={user.profilePicture}
        />
        <PageTitleBreadcrumb titleList={titleList} />
        <Content>
          <Card className="courseDetails__card">
            <LoadingSpin loading={loading} />
            {data && (
              <div className="courseDetails__container">
                <CourseDetailCard data={data} participants={participants} />
                <Divider
                  orientation="left"
                  style={{ color: "#333", fontWeight: "normal" }}
                >
                  Participants
                </Divider>
                <Row className="courseDetails__row">
                  <Col>
                    <LoadingSpin loading={fetchingParticipants} />
                  </Col>
                </Row>

                <TableDisplay isFetch={fetchingParticipants} />
              </div>
            )}
          </Card>
          <Modal
            visible={isVisible}
            onOk={() =>
              handleKickParticipant(
                selectedParticipant.key,
                props.match.params.id
              )
            }
            onCancel={() => {
              setIsVisible(false);
            }}
            okButtonProps={{ disabled: kickParticipantStatus.loading }}
            cancelButtonProps={{ disabled: kickParticipantStatus.loading }}
            okText="Kick"
          >
            {!kickParticipantStatus.loading ? (
              <div>
                <p>Are you sure to kick the following student?</p>
                <p>
                  <strong>Particular</strong>:{" "}
                  {selectedParticipant.firstName +
                    "-" +
                    selectedParticipant.lastName +
                    " (" +
                    selectedParticipant.matricNumber +
                    ")"}
                </p>
              </div>
            ) : (
              <Spin>
                <div>
                  <p>Are you sure to kick the following student?</p>
                  <p>
                    <strong>Particular</strong>:{" "}
                    {selectedParticipant.firstName +
                      "-" +
                      selectedParticipant.lastName +
                      " (" +
                      selectedParticipant.matricNumber +
                      ")"}
                  </p>
                </div>
              </Spin>
            )}
          </Modal>
          ;
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
