import { useMutation, useQuery } from '@apollo/react-hooks';
import { Card, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Course from '../../../components/common/course/Course';
import Modal from '../../../components/common/customModal';
import { CourseContext } from '../../../context';
import { CheckError, ErrorComp } from '../../../ErrorHandling';
import { FETCH_COURSE_LIMIT, modalItems } from '../../../globalData';
import { DELETE_COURSE_MUTATION } from '../../../graphql/mutation';
import {
  FETCH_CREATEDCOURSES_COUNT_QUERY,
  FETCH_CREATEDCOURSES_QUERY,
} from '../../../graphql/query';
import { FetchChecker } from '../../../utils/FetchChecker';
import { LoadingSpin } from '../../../utils/LoadingSpin';

export default (props) => {
  const { courses, fetchedDone, setFetchedDone, loadCourses } = useContext(
    CourseContext
  );

  //modal visible boolean
  const [visible, SetVisible] = useState(false);

  //get total courses count query
  const [selectedCourse, SetSelectedCourse] = useState({});

  const totalCoursesQuery = useQuery(FETCH_CREATEDCOURSES_COUNT_QUERY, {
    onCompleted(data) {
      totalCoursesQuery.refetch();
    },
    onError(err) {
      CheckError(err);
    },
  });

  const { data, loading, refetch, fetchMore } = useQuery(
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

  useEffect(() => {
    loadCourses(data?.getCreatedCourses.courses || []);

    if (data) {
      if (!data.getCreatedCourses.hasNextPage) setFetchedDone(true);
      else setFetchedDone(false);
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
    deleteCourseCallback();
  };

  const handleCancel = (e) => {
    SetVisible(false);
  };

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
          getCreatedCourses: {
            __typename: 'Courses',
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
    <Card>
      <Space direction='vertical' className='width100'>
        <h1>
          Total Created Course:{' '}
          {totalCoursesQuery.data?.getCreatedCoursesCount || 0}
        </h1>

        {courses.map((course) => (
          <Course
            key={course._id}
            course={course}
            handleAccess={handleAccess}
            handleDelete={handleDelete}
          />
        ))}

        <LoadingSpin loading={loading} />

        {/*give text of fetch result*/}
        <FetchChecker
          loading={loading}
          payload={courses}
          fetchedDone={fetchedDone}
          allLoadedMessage='All Courses Loaded'
          noItemMessage='No Course Created...'
          handleFetchMore={handleFetchMore}
        />

        {/*modal backdrop*/}
        <Modal
          title='Delete Course'
          action={modalItems.course.action.delete}
          itemType={modalItems.course.name}
          visible={visible}
          loading={deleteCourseStatus.loading}
          handleOk={handleOk}
          handleCancel={handleCancel}
          payload={selectedCourse}
        />
      </Space>
    </Card>
  );
};
