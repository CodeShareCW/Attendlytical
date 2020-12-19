import {
  ArrowRightOutlined,
  DeleteFilled,
  RedoOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Button,
  Card,
  Layout,
  message,
  Skeleton,
  Space,
  Table,
  Tag,
} from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../../components/common/customModal';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { AttendanceContext, AuthContext } from '../../../context';
import { CheckError, ErrorComp } from '../../../ErrorHandling';
import { FETCH_ATTENDANCE_LIMIT, modalItems } from '../../../globalData';
import { DELETE_ATTENDANCE_MUTATION } from '../../../graphql/mutation';
import {
  FETCH_ATTENDANCES_COUNT_QUERY,
  FETCH_ATTENDANCES_QUERY,
} from '../../../graphql/query';

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
  const { attendances, loadAttendances, resetState } = useContext(
    AttendanceContext
  );

  const columns = [
    {
      title: <strong>Bil</strong>,
      dataIndex: 'bil',
      key: 'bil',
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
    },
    {
      key: 'date',
      title: <strong>Date</strong>,
      dataIndex: 'date',
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      align: 'center',
    },
    {
      key: 'time',
      title: <strong>Time</strong>,
      dataIndex: 'time',
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      align: 'center',
    },
    {
      key: 'course',
      title: <strong>Course</strong>,
      dataIndex: 'course',
      align: 'center',
      width: '30%',
      render: (text, record) => (
        <Skeleton active loading={loading}>
          <Link to={`/course/${record.courseID}/history`}>{text}</Link>
        </Skeleton>
      ),
    },
    {
      key: 'stats',
      title: <strong>Stats</strong>,
      dataIndex: 'stats',
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      align: 'center',
    },
    {
      title: <strong>{user.userLevel === 1 ? 'Action' : 'Status'}</strong>,
      dataIndex: user.userLevel === 1 ? 'action' : 'status',
      render: (_, record) =>
        user.userLevel === 1 ? (
          <Skeleton active loading={loading}>
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
    },
  ];

  //modal visible boolean
  const [visible, SetVisible] = useState(false);

  //get total attendances count query
  const [selectedAttendance, setSelectedAttendance] = useState({});

  const [tablePagination, setTablePagination] = useState({
    pageSize: FETCH_ATTENDANCE_LIMIT,
    current: 1,
    total: 0,
  });

  const totalAttendancesCount = useQuery(FETCH_ATTENDANCES_COUNT_QUERY, {
    onCompleted(data) {
      totalAttendancesCount.refetch();
      setTablePagination({
        ...tablePagination,
        total: data.getAttendancesCount,
      });
    },
    onError(err) {
      CheckError(err);
    },
    notifyOnNetworkStatusChange: true,
  });

  const { data, loading, error, refetch } = useQuery(FETCH_ATTENDANCES_QUERY, {
    onCompleted(data) {
      setTablePagination({
        ...tablePagination,
        total: totalAttendancesCount.data?.getAttendancesCount,
      });

      if (
        totalAttendancesCount.data?.getAttendancesCount -
          (tablePagination.current - 1) * tablePagination.pageSize <=
          0 &&
        tablePagination.current !== 1
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
      currPage: tablePagination.current,
      pageSize: tablePagination.pageSize,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [deleteAttendanceCallback, deleteAttendanceStatus] = useMutation(
    DELETE_ATTENDANCE_MUTATION,
    {
      onCompleted(data) {
        SetVisible(false);
        message.success('Delete Success');
        resetState();
        totalAttendancesCount.refetch();
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
    loadAttendances(data?.getAttendances || []);
  }, [data]);
  const handleAccess = (attendance) => {
    if (user.userLevel === 1)
      props.history.push(
        `/course/${attendance.courseID}/history/${attendance.key}`
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
        courseID: att.course.shortID,
        course:
          att.course.shortID +
          ' - ' +
          att.course.code +
          ' ' +
          att.course.name +
          ' (' +
          att.course.session +
          ')',
        stats: att.attendees.length + '/' + att.participants.length,
      };

      if (user.userLevel === 0) {
        const isAttend = att.attendees.find(
          (stud) => stud.info._id === user._id
        );
        Object.assign(tmp, { status: isAttend ? 'Attend' : 'Absent' });
      }
      parsedData.push(tmp);
    });

    return parsedData;
  };

  const handleTableChange = (value) => {
    if (tablePagination != value) {
      console.log('Fetch More');
    }
    setTablePagination(value);
  };

  return (
    <Layout className='layout'>
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[{ name: 'Attendance History', link: '/history' }]}
        />
        <Content>
          <Card>
            {error && <ErrorComp err={error} />}

            {!error && (
              <Space direction='vertical' className='width100'>
                <h1>
                  Total Attendance:{' '}
                  {totalAttendancesCount.data?.getAttendancesCount || 0}
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
                  onChange={handleTableChange}
                  dataSource={parseAttendanceData(attendances)}
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
