import { useMutation, useQuery } from '@apollo/react-hooks';
import { Card, message, notification, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { EnrolCourse } from '../';
import Course from '../../../components/common/course/Course';
import Modal from '../../../components/common/customModal';
import { CourseContext } from '../../../context';
import { CheckError } from '../../../ErrorHandling';
import { FETCH_COURSE_LIMIT, modalItems } from '../../../globalData';
import { WITHDRAW_COURSE_MUTATION } from '../../../graphql/mutation';
import {
  FETCH_ENROLLEDCOURSES_COUNT_QUERY,
  FETCH_ENROLLEDCOURSES_QUERY,
  FETCH_FACE_PHOTOS_COUNT_QUERY,
} from '../../../graphql/query';
import { FetchChecker } from '../../../utils/FetchChecker';
import { LoadingSpin } from '../../../utils/LoadingSpin';

export default (props) => {
  const { courses, fetchedDone, setFetchedDone, loadCourses } = useContext(
    CourseContext
  );
  const [selectedCourse, SetSelectedCourse] = useState({});

  //modal visible boolean
  const [visible, SetVisible] = useState(false);

  //get total courses count query
  const totalCoursesQuery = useQuery(FETCH_ENROLLEDCOURSES_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });

  //get uploaded photos query
  const facePhotosCountQuery = useQuery(FETCH_FACE_PHOTOS_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });

  //get list of couse query
  const { data, loading, refetch, fetchMore } = useQuery(
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

  //check amount of uploaded photo to notify student
  useEffect(() => {
    if (facePhotosCountQuery.data)
      if (facePhotosCountQuery.data.getFacePhotosCount < 2) {
        notification['info']({
          message: (
            <strong>
              Please add your face photograph for at least 2<br />
              <br />
            </strong>
          ),
          description: `Number of face photograph uploaded: ${facePhotosCountQuery.data.getFacePhotosCount}`,
        });
      }
    facePhotosCountQuery.refetch();
  }, [facePhotosCountQuery]);

  //load courses as long as data is fetched
  useEffect(() => {
    if (data) {
      loadCourses(data.getEnrolledCourses.courses);

      if (!data.getEnrolledCourses.hasNextPage) {
        setFetchedDone(true);
      }
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
    withdrawCourseCallback();
  };

  //modal close
  const handleCancel = (e) => {
    SetVisible(false);
  };

  //fetch more button being pressed
  const handleFetchMore = () => {
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
            __typename: 'Courses',
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
    <Card>
      <EnrolCourse />
      <Space direction='vertical' className='width100'>
        <h1>
          Total Enrolled Course:
          {totalCoursesQuery.data?.getEnrolledCoursesCount || 0}
        </h1>

        {/*give list of course*/}
        {courses.map((course) => {
          return (
            <Course
              key={course._id}
              course={course}
              handleAccess={handleAccess}
              handleDelete={handleDelete}
            />
          );
        })}

        <LoadingSpin loading={loading} />

        {/*give text of fetch result*/}
        <FetchChecker
          loading={loading}
          payload={courses}
          fetchedDone={fetchedDone}
          allLoadedMessage='All Courses Loaded'
          noItemMessage='No Course Enrolled...'
          handleFetchMore={handleFetchMore}
        />

        {/*modal backdrop*/}
        <Modal
          title='Withdraw Course'
          action={modalItems.course.action.withdraw}
          itemType={modalItems.course.name}
          visible={visible}
          loading={withdrawCourseStatus.loading}
          handleOk={handleOk}
          handleCancel={handleCancel}
          payload={selectedCourse}
        />
      </Space>
    </Card>
  );
};
