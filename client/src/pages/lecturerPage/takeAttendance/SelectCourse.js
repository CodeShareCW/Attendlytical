import { useQuery } from '@apollo/react-hooks';
import { Card, Layout, Select, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { CheckError } from '../../../ErrorHandling';
import { FETCH_ALL_CREATEDCOURSES_QUERY } from '../../../graphql/query';
import { LoadingSpin } from '../../../utils/LoadingSpin';
import './SelectedCourse.css';
const { Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

export default (props) => {
  const { data, loading, refetch } = useQuery(FETCH_ALL_CREATEDCOURSES_QUERY, {
    onCompleted(data) {
      refetch();
    },
    onError(err) {
      CheckError(err);
    },
  });

  const handleChange = (value) => {
    props.history.push(`/course/${value}/takeAttendance`);
  };

  return (
    <Layout className='layout'>
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[{ name: 'Take Attendance', link: '/takeAttendance' }]}
        />
        <Content className='width100'>
          <Card
            className='height100'
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <h1>Select the course below for attendance marking</h1>
            <Text keyboard>
              Alternatively, you can also access to the course and press "Take
              Attendance" button.
            </Text>
            <br />
            <br />
            <LoadingSpin loading={loading} />

            {!loading && (
              <Select
                className='selectCourse__select'
                defaultValue='Select Course'
                onChange={handleChange}
                loading={loading}
              >
                {data?.getAllCreatedCourses.map((course) => (
                  <Option key={course._id} value={course.shortID}>
                    <Link to={`/course/${course.shortID}/takeAttendance`}>
                      [Course ID:{course.shortID}] {course.code}-{course.name} (
                      {course.session})
                    </Link>
                  </Option>
                ))}
              </Select>
            )}
          </Card>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
