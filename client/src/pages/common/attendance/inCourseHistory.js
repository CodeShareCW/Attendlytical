import {
  ArrowRightOutlined,
  DeleteFilled,
  RedoOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Card,
  Divider,
  Layout,
  message,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import Modal from '../../../components/common/customModal';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { AuthContext } from '../../../context';
import { CheckError, ErrorComp } from '../../../ErrorHandling';
import { FETCH_ATTENDANCE_LIMIT, modalItems } from '../../../globalData';
import { DELETE_ATTENDANCE_MUTATION } from '../../../graphql/mutation';
import {
  FETCH_ATTENDANCES_IN_COURSE_QUERY,
  FETCH_ATTENDANCES_COUNT_IN_COURSE_QUERY,
} from '../../../graphql/query';
import { EmojiProcessing } from '../../../utils/EmojiProcessing';

const { Title } = Typography;
const { Content } = Layout;

const ds = [
  {
    key: '1',
    bil: '1',
    date: '2020/8/19',
    time: '10:19',
    course: 'sss',
    stats: '5/20',
  },
];

export default (props) => {
  const { user } = useContext(AuthContext);
  const [attendances, setAttendances] = useState([]);

  const columns = [
    {
      title: <strong>Bil</strong>,
      dataIndex: 'bil',
      key: 'bil',
      render: (text) => <Skeleton loading={loading}>{text}</Skeleton>,
      sorter: {
        compare: (a, b) => a.bil - b.bil,
        multiple: 2,
      },
    },
    {
      key: 'date',
      title: <strong>Date</strong>,
      dataIndex: 'date',
      align: 'center',
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.date.localeCompare(b.date)
    },
    {
      key: 'time',
      title: <strong>Time</strong>,
      dataIndex: 'time',
      align: 'center',
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.time.localeCompare(b.time)
    },
    {
      key: 'stats',
      title: <strong>Stats</strong>,
      dataIndex: 'stats',
      align: 'center',
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.stats.localeCompare(b.stats)

    },
    {
      title: <strong>{user.userLevel === 1 ? 'Action' : 'Your Status'}</strong>,
      dataIndex: user.userLevel === 1 ? 'action' : 'status',
      render: (_, record) =>
        user.userLevel === 1 ? (
          <Skeleton loading={loading} active>
            <Button
              onClick={() => handleAccess(record)}
              style={{ margin: '10px' }}
              icon={<ArrowRightOutlined />}
            ></Button>

            <Button
              onClick={() => handleDelete(record)}
              loading={
                selectedAttendance.key == record.key &&
                deleteAttendanceStatus.loading
              }
              disabled={
                selectedAttendance.key == record.key &&
                deleteAttendanceStatus.loading
              }
              style={{ margin: '10px' }}
              type='danger'
              icon={<DeleteFilled />}
            ></Button>
          </Skeleton>
        ) : (
          <Skeleton active loading={loading}>
            <Tag color={record.status === 'Absent' ? 'volcano' : 'green'}>
              {record.status}
            </Tag>
          </Skeleton>
        ),
      align: 'center',
      sorter: user.userLevel === 1 ? null : (a, b) => a.status.localeCompare(b.status)
    }
  ];

  if (user.userLevel === 0) {
    columns.push({
      key: 'mood',
      title: <strong>Mood</strong>,
      dataIndex: 'mood',
      render: (text) => <EmojiProcessing exp={text} size='xs' />,
      align: 'center',
    })
  }

  //modal visible boolean
  const [visible, SetVisible] = useState(false);

  const [tablePagination, setTablePagination] = useState({
    pageSize: FETCH_ATTENDANCE_LIMIT,
    current: 1,
    total: 0,
  });

  //get total attendances count query
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const totalAttendancesCountInCourse = useQuery(
    FETCH_ATTENDANCES_COUNT_IN_COURSE_QUERY,
    {
      onCompleted(data) {
        totalAttendancesCountInCourse.refetch();
        setTablePagination({
          ...tablePagination,
          total: data.getAttendancesCountInCourse,
        });
      },
      variables: {
        courseID: props.match.params.id,
      },
      onError(err) {
        CheckError(err);
      },
    }
  );
  const { data, loading, error, refetch } = useQuery(
    FETCH_ATTENDANCES_IN_COURSE_QUERY,
    {
      onCompleted(data) {
        setTablePagination({
          ...tablePagination,
          total:
            totalAttendancesCountInCourse.data?.getAttendancesCountInCourse,
        });
        if (
          totalAttendancesCountInCourse.data?.getAttendancesCountInCourse -
          (tablePagination.current - 1) * tablePagination.pageSize <=
          0 && tablePagination.current !== 1
        ) {
          setTablePagination((prevState) => {
            return {
              ...prevState,
              current: prevState.current - 1,
            };
          });
        }
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        courseID: props.match.params.id,
        currPage: tablePagination.current,
        pageSize: tablePagination.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [deleteAttendanceCallback, deleteAttendanceStatus] = useMutation(
    DELETE_ATTENDANCE_MUTATION,
    {
      onCompleted(data) {
        SetVisible(false);
        message.success('Delete Success');
        totalAttendancesCountInCourse.refetch();
        refetch();
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        attendanceID: selectedAttendance.key,
      },
    }
  );

  useEffect(() => {
    setAttendances(data?.getAttendancesInCourse.attendances || []);
  }, [data]);

  const handleAccess = (attendance) => {
    props.history.push(
      `/course/${props.match.params.id}/history/${attendance.key}`
    );
  };

  const handleDelete = (attendance) => {
    setSelectedAttendance(attendance);
    SetVisible(true);
  };
  const handleOk = (e) => {
    deleteAttendanceCallback();
  };

  const handleCancel = (e) => {
    SetVisible(false);
  };

  const parseAttendanceData = (attendances) => {
    let parsedData = [];
    attendances.map((att, index) => {
      const tmp = {
        key: att._id,
        bil:
          !loading &&
          tablePagination.pageSize * (tablePagination.current - 1) + index + 1,
        date: moment(att.date).format('DD/MM/YYYY'),
        time: moment(att.time).format('HH:mm'),
        stats:
          att.attendees.length +
          '/' +
          (+att.absentees.length + +att.attendees.length),
      };
      if (user.userLevel === 0) {
        const isAttend = att.attendees.filter(
          (stud) => stud.info._id === user._id
        );
        Object.assign(tmp, { status: isAttend[0] ? 'Attend' : 'Absent' });
        Object.assign(tmp, { mood: isAttend[0]?.expression ? isAttend[0].expression : "-" });
      }
      parsedData.push(tmp);
    });

    return parsedData;
  };

  const handleTableChange = (value) => {
    setTablePagination(value);
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
              name: `Course: ${props.match.params.id}`,
              link: `/course/${props.match.params.id}`,
            },
            {
              name: 'Attendance History',
              link: `/course/${props.match.params.id}/history`,
            },
          ]}
        />
        <Content>
          <Card>
            {error && <ErrorComp err={error} />}
            {!error && (
              <Space direction='vertical' className='width100'>
                {data && (
                  <Title level={4}>
                    Course:{' '}
                    {`${data.getAttendancesInCourse.course.code} ${data.getAttendancesInCourse.course.name} (${data.getAttendancesInCourse.course.session})`}
                  </Title>
                )}
                {console.log(totalAttendancesCountInCourse.data)}
                <Divider />
                <h1>
                  Total Attendance:{' '}
                  {totalAttendancesCountInCourse.data
                    ?.getAttendancesCountInCourse || 0}
                </h1>
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
                  pagination={tablePagination}
                  dataSource={parseAttendanceData(attendances)}
                  onChange={handleTableChange}
                  columns={columns}
                />

                {/*modal backdrop*/}
                <Modal
                  title='Delete Attendance'
                  action={modalItems.attendance.action.delete}
                  itemType={modalItems.attendance.name}
                  visible={visible}
                  loading={deleteAttendanceStatus.loading}
                  handleOk={handleOk}
                  handleCancel={handleCancel}
                  payload={selectedAttendance}
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
