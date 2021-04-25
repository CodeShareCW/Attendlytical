import {
  ArrowRightOutlined,
  EditFilled,
  DeleteFilled,
  RedoOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Card, Button, Layout, message, Skeleton, Space, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import AddCourseForm from "../../../components/common/course/AddCourseForm";
import EnrolCourseInput from "../../../components/common/course/EnrolCourseInput";
import Modal from "../../../components/common/customModal";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { AuthContext, CourseContext } from "../../../context";
import { CheckError } from "../../../utils/ErrorHandling";
import { FETCH_COURSE_LIMIT, modalItems } from "../../../globalData";
import {
  WITHDRAW_COURSE_MUTATION,
  DELETE_COURSE_MUTATION,
} from "../../../graphql/mutation";
import {
  FETCH_COURSES_COUNT_QUERY,
  FETCH_COURSES_QUERY,
} from "../../../graphql/query";
import "./Dashboard.css";

const { Content } = Layout;

export default (props) => {
  const { user } = useContext(AuthContext);
  const titleList = [{ name: "Home", link: "/dashboard" }];

  const columns = [
    {
      title: <strong>Bil</strong>,
      dataIndex: "bil",
      key: "bil",
      align: "center",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: {
        compare: (a, b) => a.bil - b.bil,
        multiple: 2,
      },
    },
    {
      title: <strong>ID</strong>,
      dataIndex: "shortID",
      key: "shortID",
      align: "center",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.code.localeCompare(b.date),
    },
    {
      title: <strong>Code</strong>,
      dataIndex: "code",
      key: "code",
      align: "center",

      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.code.localeCompare(b.date),
    },
    {
      title: <strong>Name</strong>,
      key: "name",
      dataIndex: "name",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.date),
    },
    {
      title: <strong>Session</strong>,
      key: "session",
      dataIndex: "session",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.date),
    },
    {
      title: <strong>Owner</strong>,
      key: "owner",
      dataIndex: "owner",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.date),
    },
    {
      title: <strong>Action</strong>,
      dataIndex: "action",
      render: (_, record) => (
        <Skeleton active loading={loading}>
          <Button
            onClick={() => handleAccess(record)}
            style={{ margin: "10px" }}
            icon={<ArrowRightOutlined />}
          ></Button>
          <Button
            onClick={() => handleDelete(record)}
            loading={
              selectedCourse.key == record.key && withdrawCourseStatus.loading
            }
            disabled={
              selectedCourse.key == record.key && withdrawCourseStatus.loading
            }
            style={{ margin: "10px" }}
            type="danger"
            icon={<DeleteFilled />}
          ></Button>
        </Skeleton>
      ),
      align: "center",
    },
  ];

  const parseCourseData = (courses) => {
    let parsedData = [];
    courses.map((c, index) => {
      const tmp = {
        _id: c._id,
        key: c._id,
        bil:
          !loading &&
          tablePagination.pageSize * (tablePagination.current - 1) + index + 1,
        shortID: c.shortID,
        code: c.code,
        name: c.name,
        session: c.session,
        owner: c.creator.firstName+" "+c.creator.lastName+" ("+c.creator.cardID+")"
      };
      parsedData.push(tmp);
    });

    return parsedData;
  };

  const { courses, loadCourses } = useContext(CourseContext);

  const [tablePagination, setTablePagination] = useState({
    pageSize: FETCH_COURSE_LIMIT,
    current: 1,
    total: 0,
  });

  const [selectedCourse, SetSelectedCourse] = useState({});

  //modal visible boolean
  const [visible, SetVisible] = useState(false);

  //get total courses count query
  const totalCoursesQuery = useQuery(FETCH_COURSES_COUNT_QUERY, {
    onCompleted(data) {
      // totalAttendancesCount.refetch();
      setTablePagination({
        ...tablePagination,
        total: data.getCoursesCount,
      });
    },
    onError(err) {
      CheckError(err);
    },
    notifyOnNetworkStatusChange: true,
  });

  //get list of couse query
  const { data, loading, refetch, fetchMore } = useQuery(FETCH_COURSES_QUERY, {
    onCompleted(data) {
      setTablePagination({
        ...tablePagination,
        total: totalCoursesQuery.data?.getCoursesCount,
      });

      if (
        totalCoursesQuery.data?.getEnrolledCoursesCount -
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

  //withdrawCourse mutation
  const [withdrawCourseCallback, withdrawCourseStatus] = useMutation(
    WITHDRAW_COURSE_MUTATION,
    {
      onCompleted(data) {
        message.success(data.withdrawCourse);
      },
      update() {
        SetVisible(false);
        refetch();
        totalCoursesQuery.refetch();
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        id: selectedCourse._id,
      },
    }
  );

  const [deleteCourseCallback, deleteCourseStatus] = useMutation(
    DELETE_COURSE_MUTATION,
    {
      update() {
        SetVisible(false);
        refetch();
        totalCoursesQuery.refetch();
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        id: selectedCourse._id,
      },
    }
  );

  //load courses as long as data is fetched
  useEffect(() => {
    if (data) {
      console.log(data);
      loadCourses(data.getCourses.courses);
    }
  }, [data]);

  //-> icon is pressed, navigate to course detail page
  const handleAccess = (course) => {
    props.history.push(`/course/${course.shortID}`);
  };

  //delete icon pressed, show modal
  const handleDelete = (course) => {
    SetSelectedCourse(course);
    SetVisible(true);
  };

  //modal open
  const handleOk = (e) => {
    if (user.userLevel == 0) withdrawCourseCallback();
    else deleteCourseCallback();
  };

  //modal close
  const handleCancel = (e) => {
    SetVisible(false);
  };

  const handleTableChange = (value) => {
    setTablePagination(value);
  };

  return (
    <Layout className="dashboard layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb titleList={titleList} />
        <Card>
          {user.userLevel == 0 && <EnrolCourseInput />}
          {user.userLevel == 1 && (
            <AddCourseForm
              refetchTableTotal={totalCoursesQuery.refetch}
              refetchTable={refetch}
            />
          )}

          <Space direction="vertical" className="width100">
            <h1>
              Total {user.userLevel == 0 ? "Enrolled" : "Created"} Course:
              {totalCoursesQuery.data?.getCoursesCount || 0}
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
              onChange={handleTableChange}
              dataSource={parseCourseData(courses)}
              columns={columns}
            />
            {console.log(courses)}

            {/*modal backdrop*/}
            <Modal
              title={user.userLevel == 0 ? "Withdraw Course" : "Delete Course"}
              action={
                user.userLevel == 0
                  ? modalItems.course.action.withdraw
                  : modalItems.course.action.delete
              }
              itemType={modalItems.course.name}
              visible={visible}
              loading={
                user.userLevel == 0
                  ? withdrawCourseStatus.loading
                  : deleteCourseStatus.loading
              }
              handleOk={handleOk}
              handleCancel={handleCancel}
              payload={selectedCourse}
            />
          </Space>
        </Card>
        <Footer />
      </Layout>
    </Layout>
  );
};
