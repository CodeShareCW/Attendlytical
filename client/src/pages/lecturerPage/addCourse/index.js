import { useMutation } from '@apollo/react-hooks';
import { Button, Card, Form, Input, Layout } from 'antd';
import React, { useContext } from 'react';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { AuthContext, CourseContext } from '../../../context';
import { CheckError } from '../../../ErrorHandling';
import { ADD_COURSE_MUTATION } from '../../../graphql/mutation';
import { useForm } from '../../../utils/hooks';
import './AddCourse.css';

const { Content } = Layout;

export default (props) => {
  const { user } = useContext(AuthContext);
  const { addCourse } = useContext(CourseContext);
  const { onSubmit, onChange, values } = useForm(submitCallback);

  const [addCourseCallback, { loading }] = useMutation(ADD_COURSE_MUTATION, {
    update(_, { data }) {
      console.log(data);
      addCourse(data.createCourse);
      props.history.push('/course/' + data.createCourse.shortID);
    },
    onError(err) {
      CheckError(err);
    },
    variables: {
      name: values.courseName,
      code: values.courseCode,
      session: values.courseSession,
    },
  });

  function submitCallback() {
    addCourseCallback();
  }

  return (
    <Layout className='layout'>
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[{ name: 'Add Course', link: '/addcourse' }]}
        />
        <Content>
          <Card className='addCourse__card'>
            <p className='alert'>
              Note: Course info is not editable after created.
            </p>
            <br />
            <Form className='addCourse__form' name='basic' onFinish={onSubmit}>
              <Form.Item
                label='Course Code'
                name='courseCode'
                rules={[
                  { required: true, message: 'Please input course code!' },
                ]}
              >
                <Input
                  name='courseCode'
                  placeholder='Enter course code'
                  onChange={onChange}
                />
              </Form.Item>

              <Form.Item
                label='Course Name'
                name='courseName'
                rules={[
                  { required: true, message: 'Please input course name!' },
                ]}
              >
                <Input
                  name='courseName'
                  placeholder='Enter course name'
                  onChange={onChange}
                />
              </Form.Item>

              <Form.Item
                label='Course Session'
                name='courseSession'
                rules={[
                  { required: true, message: 'Please input course session!' },
                ]}
              >
                <Input
                  name='courseSession'
                  placeholder='Enter course session'
                  onChange={onChange}
                />
              </Form.Item>

              <Form.Item>
                <Button type='primary' htmlType='submit' loading={loading}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
