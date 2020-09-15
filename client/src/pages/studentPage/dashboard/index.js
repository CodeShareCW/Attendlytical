import { LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Card, Modal, Space, Spin, message } from "antd";
import React, { useContext, useState, useEffect } from "react";
import Course from "../../../components/common/course/Course";
import { AuthContext, CourseContext } from "../../../context";
import { CheckError } from "../../../ErrorHandling";
import { FETCH_COURSE_LIMIT } from "../../../globalData";
import { WITHDRAW_COURSE_MUTATION } from "../../../graphql/mutation";
import {
  FETCH_ENROLLEDCOURSES_COUNT_QUERY,
  FETCH_ENROLLEDCOURSES_QUERY,
  FETCH_FACE_PHOTOS_COUNT_QUERY,
} from "../../../graphql/query";
import { LoadingSpin } from "../../../utils/LoadingSpin";
import "./StudentDashboard.css";
import { notification } from "antd";

import { EnrolCourse } from "../";

export default (props) => {
  const [isNotifiedAddPhoto, setIsNotifiedAddPhoto] = useState(false);
  const { user } = useContext(AuthContext);
  const { courses, fetchedDone, setFetchedDone, loadCourses } = useContext(
    CourseContext
  );

  const [selectedCourse, SetSelectedCourse] = useState({});
  const [visible, SetVisible] = useState(false);

  const totalCoursesQuery = useQuery(FETCH_ENROLLEDCOURSES_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });

  const { data, loading, fetchMore, networkStatus } = useQuery(
    FETCH_ENROLLEDCOURSES_QUERY,
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

  const [withdrawCourseCallback, withdrawCourseStatus] = useMutation(
    WITHDRAW_COURSE_MUTATION,
    {
      onCompleted(data) {
        message.success(data.withdrawCourse);
      },
      update() {
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

  const facePhotosCountQuery = useQuery(FETCH_FACE_PHOTOS_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });

  useEffect(() => {
    if (facePhotosCountQuery.data)
      if (
        !isNotifiedAddPhoto &&
        facePhotosCountQuery.data.getFacePhotosCount < 2
      ) {
        notification["info"]({
          message: <strong>Please add your face photograph for at least 2<br/><br/></strong>,
          description: `Number of face photograph uploaded: ${facePhotosCountQuery.data.getFacePhotosCount}`,
        });
        facePhotosCountQuery.refetch();
        setIsNotifiedAddPhoto(true);
      }
  }, [facePhotosCountQuery.data]);
  useEffect(() => {
    if (data) {
      loadCourses(data.getEnrolledCourses.courses);

      if (!data.getEnrolledCourses.hasNextPage) {
        setFetchedDone(true);
      }
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
    withdrawCourseCallback();
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
          getEnrolledCourses: {
            __typename: "Courses",
            courses: [
              ...pv.getEnrolledCourses.courses,
              ...fetchMoreResult.getEnrolledCourses.courses,
            ],
            hasNextPage: fetchMoreResult.getEnrolledCourses.hasNextPage,
          },
        };
      },
    });
  };

  return (
    <Card className="studentDashboard__card">
      <EnrolCourse />
      <Space direction="vertical" className="studentDashboard__space">
        <h1>
          Total Enrolled Course:{" "}
          {totalCoursesQuery.data?.getEnrolledCoursesCount || 0}
        </h1>
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

        <LoadingSpin loading={loading} />

        {!loading && courses.length > 0 && !fetchedDone && (
          <Button onClick={HandleFetchMore} disabled={networkStatus === 3}>
            Load More
            {networkStatus === 3 ? <LoadingOutlined /> : null}
          </Button>
        )}

        {!loading && courses?.length !== 0 && fetchedDone && (
          <div className="studentDashboard__allLoadedCard">
            <h3>All Courses Loaded</h3>
          </div>
        )}

        {courses && (
          <Modal
            className="studentDashboard__modal"
            title="Withdraw Course"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{ disabled: withdrawCourseStatus.loading }}
            cancelButtonProps={{ disabled: withdrawCourseStatus.loading }}
            okText="Withdraw"
          >
            {!withdrawCourseStatus.loading ? (
              <div className="studentDashboard__withdrawConfirm">
                <p>Are you sure to withdraw the following course?</p>
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
                className="studentDashboard__withdrawLoading"
                tip="Withdrawing..."
              >
                <p>Are you sure to withdraw the following course?</p>
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

        {!loading && courses?.length === 0 && <h1>No course enrolled...</h1>}
      </Space>
    </Card>
  );
};
