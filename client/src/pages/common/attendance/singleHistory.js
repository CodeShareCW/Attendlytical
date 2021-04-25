import { UserOutlined, RedoOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/react-hooks";
import {
  Avatar,
  Card,
  Divider,
  Layout,
  Space,
  Table,
  Tag,
  Button,
  Typography,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { CheckError } from "../../../utils/ErrorHandling";
import {
  FETCH_ATTENDANCE_QUERY,
  FETCH_PARTICIPANTS_QUERY,
  FETCH_TRX_LIST_IN_ATTENDANCE,
} from "../../../graphql/query";
import HistoryViz from "./HistoryViz";
import { LoadingSpin } from "../../../utils/LoadingSpin";
import moment from "moment";

const { Title } = Typography;
const { Content } = Layout;

export default (props) => {
  const columns = [
    {
      title: <strong>Avatar</strong>,
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      width: "5%",
    },
    {
      key: "cardID",
      title: <strong>Matric Number</strong>,
      dataIndex: "cardID",
      align: "center",
      sorter: (a, b) => a.cardID.localeCompare(b.cardID),
    },
    {
      key: "name",
      title: <strong>Name</strong>,
      dataIndex: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: <strong>Status</strong>,
      dataIndex: "status",
      render: (_, record) => (
        <Tag color={record.status === "Absent" ? "volcano" : "green"}>
          {record.status}
        </Tag>
      ),
      align: "center",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: <strong>Check In Date</strong>,
      dataIndex: "checkin_date",
      render: (_, record) => record.checkin_date,
      align: "center",
      sorter: (a, b) => a.checkin_date.localeCompare(b.checkin_date),
    },
    {
      title: <strong>Check In Time</strong>,
      dataIndex: "checkin_time",
      render: (_, record) => record.checkin_time,
      align: "center",
      sorter: (a, b) => a.checkin_time.localeCompare(b.checkin_time),
    },
  ];

  const [participants, setParticipants] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [trx, setTrx] = useState([]);

  const [stats, setStats] = useState("");

  const attendanceGQLQuery = useQuery(FETCH_ATTENDANCE_QUERY, {
    onError(err) {
      props.history.push(
        `/course/${props.match.params.courseID}/attendanceList`
      );

      CheckError(err);
    },
    variables: {
      attendanceID: props.match.params.attendanceID,
    },
    notifyOnNetworkStatusChange: true,
  });

  const courseAndParticipantsGQLQuery = useQuery(
    FETCH_PARTICIPANTS_QUERY,
    {
      onError(err) {
        props.history.push(`/dashboard`);

        CheckError(err);
      },
      variables: {
        id: props.match.params.courseID,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const trxListInAttendanceGQLQuery = useQuery(FETCH_TRX_LIST_IN_ATTENDANCE, {
    onError(err) {
      CheckError(err);
    },
    variables: {
      attendanceID: props.match.params.attendanceID,
    },
    notifyOnNetworkStatusChange: true,
  });
  
  useEffect(() => {
    if (courseAndParticipantsGQLQuery.data) {
      setParticipants(
        courseAndParticipantsGQLQuery.data.getParticipants
      );
    }
  }, [courseAndParticipantsGQLQuery.data]);

  useEffect(() => {
    if (trxListInAttendanceGQLQuery.data) {
      const currAbsentees = participants.filter((participant) => {
        delete participant.attend_at;

        const result = trxListInAttendanceGQLQuery.data.getTrxListInAttendance.filter(
          (attendee) => participant._id == attendee.studentID
        );

        return result.length == 0; //count as absentee if no found
      });


      const currAttendees = participants.filter((participant) => {
        const result = trxListInAttendanceGQLQuery.data.getTrxListInAttendance.filter(
          (attendee) => participant._id == attendee.studentID
        );
          console.log("result", result);
        if (result.length >= 1) {
          Object.assign(participant, { attend_at: result[0].createdAt });
        }
        return result.length >= 1; //count as attendee if found
      });

      setAbsentees(currAbsentees);
      setAttendees(currAttendees);
    }
    return ()=>{
      
      setAbsentees([]);
      setAttendees([]);
    }
  }, [participants, trxListInAttendanceGQLQuery.data]);

  useEffect(() => {
    setStats(`${attendees.length}/${participants.length}`);
    return ()=>{
      setStats("");
    }
  }, [attendees, absentees, participants]);

  const parseParticipantData = (participants, absentees) => {
    let parsedData = [];
    console.log(absentees)
    participants.map((participant, index) => {
      const tmp = {
        key: participant._id,
        avatar: (
          <Avatar
            src={participant.profilePictureURL}
            style={{
              backgroundColor: `rgb(${Math.random() * 150 + 30}, ${
                Math.random() * 150 + 30
              }, ${Math.random() * 150 + 30})`,
            }}
          >
            {/* Set the avatar to participant's first name */}
            {participant.firstName[0]}
          </Avatar>
        ),
        cardID: participant.cardID,
        name: participant.firstName + " " + participant.lastName,

        status: absentees.find((abs) => abs._id == participant._id)
          ? "Absent"
          : "Attend",
        checkin_date: participant.attend_at
          ? moment(participant.attend_at).format("DD/MM/YYYY")
          : "-",
        checkin_time: participant.attend_at
          ? moment(participant.attend_at).format("h:mm:ss a")
          : "-",
      };
      parsedData.push(tmp);
    });

    return parsedData;
  };

  return (
    <Layout className="layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[
            { name: "Home", link: "/dashboard" },
            {
              name: `Course: ${props.match.params.courseID}`,
              link: `/course/${props.match.params.courseID}`,
            },
            {
              name: `Attendance List`,
              link: `/course/${props.match.params.courseID}/attendanceList`,
            },
            {
              name: `Attendance Record: ${props.match.params.attendanceID}`,
              link: `/course/${props.match.params.courseID}/attendanceList/${props.match.params.attendanceID}`,
            },
          ]}
        />
        <Content>
          <Card>
            <Space direction="vertical" className="width100">
              {attendanceGQLQuery.data && (
                <Card>
                  <Title
                    level={4}
                  >{`Course: ${attendanceGQLQuery.data.getAttendance.course.shortID} - ${attendanceGQLQuery.data.getAttendance.course.code} - ${attendanceGQLQuery.data.getAttendance.course.name} - ${attendanceGQLQuery.data.getAttendance.course.session}`}</Title>

                  <p>
                    Date:{" "}
                    <strong>
                      {moment(
                        attendanceGQLQuery.data.getAttendance.date
                      ).format("DD/MM/YYYY")}
                    </strong>
                  </p>
                  <p>
                    Time:{" "}
                    <strong>
                      {moment(
                        attendanceGQLQuery.data.getAttendance.time
                      ).format("h:mm a")}
                    </strong>
                  </p>
                </Card>
              )}
              <Divider />

              <Card style={{ display: "flex", justifyContent: "center" }}>
                {" "}
                <p>
                  <strong>Attendance Transaction:</strong> {stats || "-"}
                </p>
                <br />
              </Card>
              {courseAndParticipantsGQLQuery.data ? (
                <HistoryViz
                  attendeesLength={attendees.length}
                  absenteesLength={absentees.length}
                />
              ) : (
                <LoadingSpin loading={courseAndParticipantsGQLQuery.loading} />
              )}
              <Button
                style={{ float: "right" }}
                icon={<RedoOutlined />}
                disabled={attendanceGQLQuery.loading}
                loading={attendanceGQLQuery.loading}
                onClick={() => attendanceGQLQuery.refetch()}
              >
                Refresh Table
              </Button>
              <Table
                scroll={{ x: "max-content" }}
                loading={courseAndParticipantsGQLQuery.loading}
                pagination={{ pageSize: 5 }}
                dataSource={
                  courseAndParticipantsGQLQuery.data
                    ? parseParticipantData(participants, absentees)
                    : []
                }
                columns={columns}
              />
            </Space>
          </Card>
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};
