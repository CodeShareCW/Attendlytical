import { LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Card, Modal, Space, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import Course from "../../../components/common/course/Course";
import { AuthContext, CourseContext } from "../../../context";
import { CheckError } from "../../../ErrorHandling";
import { FETCH_COURSE_LIMIT } from "../../../globalData";
import { DELETE_COURSE_MUTATION } from "../../../graphql/mutation";
import {
  FETCH_CREATEDCOURSES_COUNT_QUERY,
  FETCH_CREATEDCOURSES_QUERY,
} from "../../../graphql/query";
import { LoadingSpin } from "../../../utils/LoadingSpin";
import "./LecturerDashboard.css";

export default (props) => {
  const { user } = useContext(AuthContext);
  const {
    courses,
    fetchedDone,
    setFetchedDone,
    loadCourses,
  } = useContext(CourseContext);

  const [visible, SetVisible] = useState(false);
  const [selectedCourse, SetSelectedCourse] = useState({});

  const totalCoursesQuery = useQuery(FETCH_CREATEDCOURSES_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });

  const { data, loading, networkStatus, fetchMore } = useQuery(
    FETCH_CREATEDCOURSES_QUERY,
    {
      onError(err) {
        CheckError(err);
      },
      variables: {
        limit: FETCH_COURSE_LIMIT,
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
        window.location.reload();
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        id: selectedCourse._id,
      },
    }
  );

  useEffect(() => {
    loadCourses(data?.getCreatedCourses.courses || []);

    if (data && !data.getCreatedCourses.hasNextPage) {
      setFetchedDone(true);
    }
  }, [data]);

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
        limit: FETCH_COURSE_LIMIT,
        cursor: courses[courses.length - 1]._id,
      },
      onError(err) {
        CheckError(err);
      },
      updateQuery: (pv, { fetchMoreResult }) => {
        return {
          getCreatedCourses: {
            __typename: "Courses",
            courses: [
              ...pv.getCreatedCourses.courses,
              ...fetchMoreResult.getCreatedCourses.courses,
            ],
            hasNextPage: fetchMoreResult.getCreatedCourses.hasNextPage,
          },
        };
      },
    });
  };

  return (
    <div id="lecturerDashboard">
      <Card className="lecturerDashboard__card">
        <Space direction="vertical" className="lecturerDashboard__space">
          <h1>
            Total Created Course:{" "}
            {totalCoursesQuery.loading ? (
              <LoadingOutlined />
            ) : (
              totalCoursesQuery.data?.getCreatedCoursesCount
            )}
          </h1>
          <br />
          {courses &&
            courses.map((course) => (
              <Course
                key={course._id}
                user={user}
                course={course}
                handleAccess={handleAccess}
                handleDelete={handleDelete}
              />
            ))}

          <LoadingSpin loading={loading} />

          {!loading && courses && !fetchedDone && (
            <Button onClick={HandleFetchMore} loading={networkStatus === 3}>
              Load More
            </Button>
          )}

          {!loading && courses?.length !== 0 && fetchedDone && (
            <div className="allLoadedCard">
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
              okButtonProps={{ disabled: deleteCourseStatus.loading }}
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
          {!loading && courses?.length === 0 && <h1>No course created...</h1>}
        </Space>
      </Card>
    </div>
  );
};
