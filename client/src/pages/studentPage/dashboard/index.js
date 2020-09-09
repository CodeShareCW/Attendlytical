/*
  Student Dashboard
*/

//react
import React, { useState, useContext } from "react";

//apollo-graphql
import { useQuery } from "@apollo/react-hooks";
import { FETCH_ENROLLEDCOURSES_QUERY } from "../../../graphql/query";

//antd
import { Modal, Card, Button, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

//context
import { AuthContext } from "../../../context/auth";

//comp
import Course from "../../../components/common/course/Course";

//fetch limit
import { FETCH_COURSE_LIMIT } from "../../../globalData";

//style
import "./StudentDashboard.css";

export default () => {
  const { user } = useContext(AuthContext);
  const [selectedCourse, SetSelectedCourse] = useState({});
  const [fetchedLimit] = useState(FETCH_COURSE_LIMIT);
  const [visible, SetVisible] = useState(false);
  const [fetchedAllDone, SetFetchedAllDone] = useState(false);
  const { loading, fetchMore, networkStatus, data } = useQuery(
    FETCH_ENROLLEDCOURSES_QUERY,
    {
      variables: {
        limit: fetchedLimit,
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  const courses = data?.getEnrolledCourses.courses;
  const hasNextPage = data?.getEnrolledCourses.hasNextPage;

  const showModal = () => {
    SetVisible(true);
  };

  const handleAccess = (course) => {
    SetSelectedCourse(course);
    SetVisible(true);
  };

  const handleDelete = (course) => {
    SetSelectedCourse(course);
    SetVisible(true);
  };

  const handleOk = (e) => {
    SetVisible(false);
  };

  const handleCancel = (e) => {
    SetVisible(false);
  };

  const HandleFetchMore = () => {
    fetchMore({
      variables: {
        limit: fetchedLimit,
        cursor: courses[courses.length - 1]._id,
      },
      updateQuery: (pv, { fetchMoreResult }) => {
        if (!fetchMoreResult.getEnrolledCourses.hasNextPage) {
          SetFetchedAllDone(true);
          return pv;
        }

        return {
          getEnrolledCourses: {
            __typename: "Courses",
            courses: [
              ...pv.getEnrolledCourses.courses,
              ...fetchMoreResult.getEnrolledCourses.courses    
            ],
            hasNextPage: fetchMoreResult.getEnrolledCourses.hasNextPage,
          },
        };
      },
    });
  };

  return (
    <Card className="studentDashboard__card">
      <Space direction="vertical" className="studentDashboard__space">
        <h1>Total Enrolled Course: {courses?.length || 0}</h1>
        <br />
        {courses &&
          courses.map((course) => {
            return (
              <Course
                user={user}
                key={course._id}
                course={course}
                handleAccess={handleAccess}
                handleDelete={handleDelete}
              />
            );
          })}
        {courses && (
          <Modal
            title="Withdraw Course"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Delete"
          >
            <p>Are you sure to withdraw the following course?</p>
            <p>
              <strong>Course ID</strong>: {selectedCourse._id}
            </p>
            <p>
              <strong>Particular</strong>:{" "}
              {selectedCourse.code +
                "-" +
                selectedCourse.name +
                " (" +
                selectedCourse.session +
                ")"}
            </p>
          </Modal>
        )}

        {loading ? (
          <div className="studentDashboard__loading__container">
            <div className="studentDashboard__loading">
              <Spin size="large" />
              <span>Loading...</span>
            </div>
          </div>
        ) : null}

        {!loading && courses && !fetchedAllDone && hasNextPage && (
          <Button onClick={HandleFetchMore} disabled={networkStatus === 3}>
            Load More
            {networkStatus === 3 ? <LoadingOutlined /> : null}
          </Button>
        )}

        {!loading && courses?.length !== 0 && fetchedAllDone && (
          <div className="studentDashboard__allLoadedCard">
            <h3>All Courses Loaded</h3>
          </div>
        )}

        {!loading && courses?.length === 0 && <h1>No course enrolled...</h1>}
      </Space>
    </Card>
  );
};
