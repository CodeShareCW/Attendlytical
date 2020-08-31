import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Modal, Card, Space, Button, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { CourseContext } from "../../context/course";
import Course from "./Course";
import "./LecturerDashboard.css";

export default (props) => {
  const {
    courses,
    fetchedDone,
    setFetchedDone,
    loadCourses,
    deleteCourse,
  } = useContext(CourseContext);
  const [fetchedLimit] = useState(10);
  const [visible, SetVisible] = useState(false);
  const [selectedCourse, SetSelectedCourse] = useState({});

  const totalCourses = useQuery(FETCH_CREATEDCOURSES_COUNT_QUERY, {
    onError(err) {
      if (err.message==="GraphQL error: Invalid/Expired token")
        window.location.reload();
      message.error(err.message);
    },
  });

  const { loading, networkStatus, fetchMore, refetch, error, data } = useQuery(
    FETCH_CREATEDCOURSES_QUERY,
    {
      onCompleted: (data) => {
        totalCourses.refetch();
        if (!courses || courses.length === 0)
          loadCourses(data.getCreatedCourses);
      },
      onError(err) {
        if (err.message==="GraphQL error: Invalid/Expired token")
          window.location.reload();
        message.error(err.message)
      },
      variables: {
        first: fetchedLimit,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [deleteCourseForGQL, deleteCourseStatus] = useMutation(
    DELETE_COURSE_MUTATION,
    {
      update() {
        //TODO: handle remove item
        SetVisible(false);
        deleteCourse(selectedCourse._id);
        totalCourses.refetch();
      },
      onError(err) {
        if (err.message==="GraphQL error: Invalid/Expired token")
           window.location.reload();
        message.error(err.message);
      },
      variables: {
        id: selectedCourse._id,
      },
    }
  );

  const handleAccess = (course) => {
    props.history.push(`/course/${course.shortID}`);
  };

  const handleDelete = (course) => {
    SetSelectedCourse(course);
    SetVisible(true);
  };
  const handleOk = (e) => {
    deleteCourseForGQL();
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
      onError(err) {
        if (err.message==="GraphQL error: Invalid/Expired token")
          window.location.reload();
        message.error(err.message);
      },
      updateQuery: (pv, { fetchMoreResult }) => {
        if (fetchMoreResult.getCreatedCourses.length === 0) {
          setFetchedDone(true);
          return pv;
        }
        if (fetchMoreResult.getCreatedCourses.length < fetchedLimit) {
          setFetchedDone(true);
        }

        loadCourses(fetchMoreResult.getCreatedCourses);

        return {
          getCreatedCourses: [
            ...pv.getCreatedCourses,
            ...fetchMoreResult.getCreatedCourses,
          ],
        };
      },
    });
  };

  if (error) message.error(error.message);
  return (
    <div id="lecturerDashboard">
      <Card className="lecturerDashboard__card">
        <Space direction="vertical" className="lecturerDashboard__space">
          <h1>
            Total Created Course:{" "}
            {totalCourses.loading ? (
              <LoadingOutlined />
            ) : (
              totalCourses.data?.getCreatedCoursesCount
            )}
          </h1>
          <br />
          {courses &&
            courses.map((course) => (
              <Course
                key={course._id}
                course={course}
                handleAccess={handleAccess}
                handleDelete={handleDelete}
              />
            ))}

          {loading ? (
            <div className="lecturerDashboard__loading__container">
              <div className="lecturerDashboard__loading">
                <Spin size="large" tip="Loading..." />
              </div>
            </div>
          ) : null}
          {/*TODO: Still no very perfect when navigate to other page*/}
          {courses && !fetchedDone && courses[courses.length - 1]?.hasNextPage && (
            <Button onClick={HandleFetchMore} loading={networkStatus === 3}>
              Load More
            </Button>
          )}

          {courses?.length !== 0 && fetchedDone && (
            <div className="lecturerDashboard__allLoadedCard">
              <h3>All Courses Loaded</h3>
            </div>
          )}

          {courses && (
            <Modal
              className="lecturerDashboard__modal"
              title="Delete Course"
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
              okButtonProps={{disabled: deleteCourseStatus.loading } }
              cancelButtonProps={{ disabled: deleteCourseStatus.loading }}
              okText="Delete"
            >
              {!deleteCourseStatus.loading ? (
                <div className="lecturerDashboard__deleteConfirm">
                  <p>Are you sure to delete the following course?</p>
                  <p>
                    <strong>Course ID</strong>: {selectedCourse.shortID}
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
                </div>
              ) : (
                <Spin
                  className="lecturerDashboard__deleteLoading"
                  tip="Deleting..."
                >
                  <p>Are you sure to delete the following course?</p>
                  <p>
                    <strong>Course ID</strong>: {selectedCourse.shortID}
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
                </Spin>
              )}
            </Modal>
          )}
          {courses?.length === 0 && <h1>No course created...</h1>}
        </Space>
      </Card>
    </div>
  );
};
const FETCH_CREATEDCOURSES_QUERY = gql`
  query getCreatedCourses($cursor: String, $first: Int!) {
    getCreatedCourses(cursor: $cursor, first: $first) {
      _id
      shortID
      name
      code
      session
      createdAt
      hasNextPage
    }
  }
`;

const DELETE_COURSE_MUTATION = gql`
  mutation deleteCourse($id: ID!) {
    deleteCourse(courseID: $id) {
      _id
      name
      code
      session
    }
  }
`;

const FETCH_CREATEDCOURSES_COUNT_QUERY = gql`
  query getCreatedCoursesCount {
    getCreatedCoursesCount
  }
`;
