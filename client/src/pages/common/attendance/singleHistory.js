import { UserOutlined, RedoOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/react-hooks';
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
} from 'antd';
import React, { useState } from 'react';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { CheckError, ErrorComp } from '../../../ErrorHandling';
import { FETCH_ATTENDANCE_QUERY } from '../../../graphql/query';
import { EmojiProcessing } from '../../../utils/EmojiProcessing';
import HistoryViz from './HistoryViz';
import { LoadingSpin } from '../../../utils/LoadingSpin';

const { Title } = Typography;
const { Content } = Layout;

export default (props) => {
  const columns = [
    {
      title: <strong>Avatar</strong>,
      dataIndex: 'avatar',
      key: 'avatar',
      align: 'center',
      width: '5%',
    },
    {
      key: 'cardID',
      title: <strong>Matric Number</strong>,
      dataIndex: 'cardID',
      align: 'center',
      sorter: (a, b) => a.cardID.localeCompare(b.cardID)
    },
    {
      key: 'name',
      title: <strong>Name</strong>,
      dataIndex: 'name',
      align: 'center',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: <strong>Status</strong>,
      dataIndex: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'Absent' ? 'volcano' : 'green'}>
          {record.status}
        </Tag>
      ),
      align: 'center',
      sorter: (a, b) => a.status.localeCompare(b.status)
    },
    {
      key: 'attendRate',
      title: <strong>Attend Rate</strong>,
      dataIndex: 'attendRate',
      render: (text) =>
        text !== null ? (
          <Tag color={text === 0 ? '#f00' : text <= 80 ? '#f90' : '#0c8'}>
            {text}%
          </Tag>
        ) : (
          <Tag className='alert'>No attendance record yet</Tag>
        ),
      align: 'center',
      sorter: {
        compare: (a, b) => a.attendRate - b.attendRate,
        multiple: 2,
      },
    }
  ];

  const { data, loading, refetch, error } = useQuery(FETCH_ATTENDANCE_QUERY, {
    onCompleted(data) {
      if (data.getAttendance.course.shortID !== props.match.params.courseID) {
        setCourseIDError(new Error('Course ID do not match'));
      } else {
        setCourseIDError();
        {
          /*set stats*/
        }
        console.log(data);

        setStats(
          `${data.getAttendance.attendees.length}/${data.getAttendance.participants.length}`
        );
      }
    },
    onError(err) {
      CheckError(err);
    },
    variables: {
      attendanceID: props.match.params.attendanceID,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [courseIDError, setCourseIDError] = useState();
  const [stats, setStats] = useState('');

  const parseParticipantData = (participants, absentees) => {
    let parsedData = [];
    {
      console.log(participants);
    }

    participants.map((participant, index) => {
      const tmp = {
        key: participant.info._id,
        avatar: (
          <Avatar
            src={participant.info.profilePictureURL}
            style={{
              backgroundColor: `rgb(${Math.random() * 150 + 30}, ${
                Math.random() * 150 + 30
              }, ${Math.random() * 150 + 30})`,
            }}
          >
            {/* Set the avatar to participant's first name */}
            {participant.info.firstName[0]}
          </Avatar>
        ),
        cardID: participant.info.cardID,
        name: participant.info.firstName + ' ' + participant.info.lastName,

        status: absentees.find((abs) => abs.info._id === participant.info._id)
          ? 'Absent'
          : 'Attend',
        attendRate: participant.attendRate,
      };
      parsedData.push(tmp);
    });

    return parsedData;
  };

  return (
    <Layout className='layout'>
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[
            { name: 'Home', link: '/dashboard' },
            {
              name: `Course: ${props.match.params.courseID}`,
              link: `/course/${props.match.params.courseID}`,
            },
            {
              name: `Attendance History`,
              link: `/course/${props.match.params.courseID}/history`,
            },
            {
              name: `History ID: ${props.match.params.attendanceID}`,
              link: `/course/${props.match.params.courseID}/history/${props.match.params.attendanceID}`,
            },
          ]}
        />
        <Content>
          <Card>
            {(error && <ErrorComp err={error} />) ||
              (courseIDError && <ErrorComp err={courseIDError} />)}
            {!error && !courseIDError && (
              <Space direction='vertical' className='width100'>
                {data && (
                  <Title
                    level={4}
                  >{`Course: ${data.getAttendance.course.code} ${data.getAttendance.course.name} (${data.getAttendance.course.session})`}</Title>
                )}
                <Divider />

                <Card style={{ display: 'flex', justifyContent: 'center' }}>
                  {' '}
                  <p>
                    <strong>Statistics:</strong> {stats || '-'}
                  </p>
                  <br />
                </Card>
                {data ? <HistoryViz attendeesLength={data.getAttendance.attendees.length} absenteesLength={data.getAttendance.absentees.length} /> : <LoadingSpin loading={loading} />}
                <Button
                  style={{ float: 'right' }}
                  icon={<RedoOutlined />}
                  disabled={loading}
                  loading={loading}
                  onClick={() => refetch()}
                >
                  Refresh Table
                </Button>
                <Table
                  loading={loading}
                  pagination={{ pageSize: 5 }}
                  dataSource={
                    data
                      ? parseParticipantData(
                          data?.getAttendance.participants,
                          data?.getAttendance.absentees
                        )
                      : []
                  }
                  columns={columns}
                />
              </Space>
            )}
          </Card>
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};
