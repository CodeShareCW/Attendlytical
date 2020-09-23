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
import React from 'react';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { CheckError, ErrorComp } from '../../../ErrorHandling';
import { FETCH_ATTENDANCE_QUERY } from '../../../graphql/query';
import { EmojiProcessing } from '../../../utils/EmojiProcessing';

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
    },
    {
      key: 'name',
      title: <strong>Name</strong>,
      dataIndex: 'name',
      align: 'center',
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
    },
    {
      key: 'mood',
      title: <strong>Mood</strong>,
      dataIndex: 'mood',
      render: (text) => <EmojiProcessing exp={text} size='xxs' />,
      align: 'center',
    },
  ];

  const { data, loading, refetch, error } = useQuery(FETCH_ATTENDANCE_QUERY, {
    onError(err) {
      CheckError(err);
    },
    variables: {
      attendanceID: props.match.params.attendanceID,
    },
    notifyOnNetworkStatusChange: true,
  });

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
            icon={<UserOutlined />}
            src={participant.info.profilePictureURL}
          />
        ),
        cardID: participant.info.cardID,
        name: participant.info.firstName + ' ' + participant.info.lastName,

        status: absentees.find((abs) => abs.info._id === participant.info._id)
          ? 'Absent'
          : 'Attend',
        attendRate: participant.attendRate,
        mood: 'happy',
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
            {error && <ErrorComp err={error} />}
            {!error && (
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
                    <strong>Total Participants:</strong>{' '}
                    {data?.getAttendance.participants.length || 0}
                  </p>
                  <p>
                    <strong>Attend Total:</strong>{' '}
                    {data?.getAttendance.attendees.length || 0}
                  </p>
                  <p>
                    <strong>Absent Total:</strong>{' '}
                    {data?.getAttendance.absentees.length || 0}
                  </p>
                </Card>
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
                  pagination={{ pageSize: 20 }}
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
