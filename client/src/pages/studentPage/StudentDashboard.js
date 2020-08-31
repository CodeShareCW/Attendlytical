import React, { useState, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { AuthContext } from "../../context/auth";

import { Modal, Card, Button, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import Course from "./Course";
import "./StudentDashboard.css";

export default () => {
  const { user } = useContext(AuthContext);
  const [selectedCourse, SetSelectedCourse] = useState({});
  const [fetchedLimit] = useState(10);
  const [visible, SetVisible] = useState(false);
  const [fetchedAllDone, SetFetchedAllDone] = useState(false);
  const { loading, fetchMore, networkStatus, error, data } = useQuery(
    FETCH_ENROLLEDCOURSES_QUERY,
    {
      variables: {
        first: fetchedLimit,
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  const courses = data?.getEnrolledCourses;
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
        first: fetchedLimit,
        cursor: courses[courses.length - 1]._id,
      },
      updateQuery: (pv, { fetchMoreResult }) => {
        if (fetchMoreResult.getEnrolledCourses.length === 0) {
          SetFetchedAllDone(true);
          return pv;
        }
        if (fetchMoreResult.getEnrolledCourses.length < fetchedLimit) {
          SetFetchedAllDone(true);
        }
        return {
          getCreatedCourses: [
            ...courses,
            ...fetchMoreResult.getEnrolledCourses,
          ],
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

        {courses &&
          !fetchedAllDone &&
          courses[courses.length - 1]?.hasNextPage && (
            <Button onClick={HandleFetchMore} disabled={networkStatus === 3}>
              Load More
              {networkStatus === 3 ? <LoadingOutlined /> : null}
            </Button>
          )}

        {courses?.length !== 0 && fetchedAllDone && (
          <div className="studentDashboard__allLoadedCard">
            <h3>All Courses Loaded</h3>
          </div>
        )}

        {courses?.length === 0 && <h1>No course enrolled...</h1>}
      </Space>
    </Card>
  );
};
const FETCH_ENROLLEDCOURSES_QUERY = gql`
  query getEnrolledCourses($cursor: String, $first: Int!) {
    getEnrolledCourses(cursor: $cursor, first: $first) {
      _id
      creator {
        firstName
        lastName
      }
      name
      code
      session
      createdAt
      hasNextPage
    }
  }
`;
