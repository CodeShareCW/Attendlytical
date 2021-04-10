import {
  ArrowRightOutlined,
  DeleteFilled,
  RedoOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
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
} from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/common/customModal";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { AuthContext } from "../../../context";
import { CheckError, ErrorComp } from "../../../ErrorHandling";
import { FETCH_ATTENDANCE_LIMIT, modalItems } from "../../../globalData";
import { DELETE_ATTENDANCE_MUTATION } from "../../../graphql/mutation";
import {
  FETCH_ATTENDANCE_LIST_COUNT_IN_COURSE_QUERY,
  FETCH_ATTENDANCE_LIST_IN_COURSE_QUERY,
} from "../../../graphql/query";

const { Title } = Typography;
const { Content } = Layout;

export default (props) => {
  const { user } = useContext(AuthContext);
  const [attendanceList, setAttendanceList] = useState([]);

  const columns = [
    {
      title: <strong>Bil</strong>,
      dataIndex: "bil",
      key: "bil",
      render: (text) => <Skeleton loading={loading}>{text}</Skeleton>,
      sorter: {
        compare: (a, b) => a.bil - b.bil,
        multiple: 2,
      },
    },
    {
      key: "date",
      title: <strong>Date</strong>,
      dataIndex: "date",
      align: "center",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      key: "time",
      title: <strong>Time</strong>,
      dataIndex: "time",
      align: "center",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      key: "mode",
      title: <strong>Mode</strong>,
      dataIndex: "mode",
      align: "center",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.mode.localeCompare(b.mode),
    },
    {
      key: "stats",
      title: <strong>Stats</strong>,
      dataIndex: "stats",
      align: "center",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.stats.localeCompare(b.stats),
    },
    {
      title: <strong>{"Action"}</strong>,
      dataIndex: user.userLevel === 1 ? "action" : "status",
      render: (_, record) => (
        <Skeleton loading={loading} active>
          <Button
            onClick={() => handleAccess(record)}
            style={{ margin: "10px" }}
            icon={<ArrowRightOutlined />}
          ></Button>

          {user.userLevel == 1 && (
            <Button
              onClick={() => handleDelete(record)}
              loading={
                selectedAttendance.key == record.key &&
                deleteAttendanceListtatus.loading
              }
              disabled={
                selectedAttendance.key == record.key &&
                deleteAttendanceListtatus.loading
              }
              style={{ margin: "10px" }}
              type="danger"
              icon={<DeleteFilled />}
            ></Button>
          )}
        </Skeleton>
      ),
      align: "center",
    },
  ];

  //modal visible boolean
  const [visible, SetVisible] = useState(false);

  const [tablePagination, setTablePagination] = useState({
    pageSize: FETCH_ATTENDANCE_LIMIT,
    current: 1,
    total: 0,
  });

  //get total attendanceList count query
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const totalAttendanceListCountInCourse = useQuery(
    FETCH_ATTENDANCE_LIST_COUNT_IN_COURSE_QUERY,
    {
      onCompleted(data) {
        totalAttendanceListCountInCourse.refetch();
        setTablePagination({
          ...tablePagination,
          total: data.getAttendanceListCountInCourse,
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
    FETCH_ATTENDANCE_LIST_IN_COURSE_QUERY,
    {
      onCompleted(data) {
        setTablePagination({
          ...tablePagination,
          total:
            totalAttendanceListCountInCourse.data?.getAttendanceListCountInCourse,
        });
        if (
          totalAttendanceListCountInCourse.data?.getAttendanceListCountInCourse -
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
        courseID: props.match.params.id,
        currPage: tablePagination.current,
        pageSize: tablePagination.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [deleteAttendanceCallback, deleteAttendanceListtatus] = useMutation(
    DELETE_ATTENDANCE_MUTATION,
    {
      onCompleted(data) {
        SetVisible(false);
        message.success("Delete Success");
        totalAttendanceListCountInCourse.refetch();
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
    setAttendanceList(data?.getAttendanceListInCourse.attendanceList || []);
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

  const parseAttendanceData = (attendanceList) => {
    let parsedData = [];
    attendanceList.map((att, index) => {
      const tmp = {
        key: att._id,
        bil:
          !loading &&
          tablePagination.pageSize * (tablePagination.current - 1) + index + 1,
        date: moment(att.date).format("DD/MM/YYYY"),
        time: moment(att.time).format("HH:mm"),
        mode: att.mode
      };
      parsedData.push(tmp);
    });

    return parsedData;
  };

  const handleTableChange = (value) => {
    setTablePagination(value);
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
              name: `Course: ${props.match.params.id}`,
              link: `/course/${props.match.params.id}`,
            },
            {
              name: "Attendance History",
              link: `/course/${props.match.params.id}/history`,
            },
          ]}
        />
        <Content>
          <Card>
            {error && <ErrorComp err={error} />}
            {!error && (
              <Space direction="vertical" className="width100">
                {data && (
                  <Title level={4}>
                    Course:{" "}
                    {`${data.getAttendanceListInCourse.course.code} ${data.getAttendanceListInCourse.course.name} (${data.getAttendanceListInCourse.course.session})`}
                  </Title>
                )}
                <Divider />
                <h1>
                  Total Attendance:{" "}
                  {totalAttendanceListCountInCourse.data
                    ?.getAttendanceListCountInCourse || 0}
                </h1>
                <Button
                  style={{ float: "right" }}
                  icon={<RedoOutlined />}
                  disabled={loading}
                  loading={loading}
                  onClick={() => refetch()}
                >
                  Refresh Table
                </Button>
                <Table
                  scroll={{ x: "max-content" }}
                  loading={loading}
                  pagination={tablePagination}
                  dataSource={parseAttendanceData(attendanceList)}
                  onChange={handleTableChange}
                  columns={columns}
                />

                {/*modal backdrop*/}
                <Modal
                  title="Delete Attendance"
                  action={modalItems.attendance.action.delete}
                  itemType={modalItems.attendance.name}
                  visible={visible}
                  loading={deleteAttendanceListtatus.loading}
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
