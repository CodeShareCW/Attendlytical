import { Layout, Form, Card, Button, Input, message } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { ENROL_COURSE_MUTATION } from '../../../graphql/mutation';
import React, { useState } from 'react';

import { CheckError } from "../../../utils/ErrorHandling";

export default () => {
  const [courseID, setCourseID] = useState('');
  const [enrolCourseCallback, enrolCourseStatus] = useMutation(
    ENROL_COURSE_MUTATION,
    {
      onCompleted(data) {
        message.success(
          'Enrol success'
        );
      },
      onError(err) {
        CheckError(err);
      },
      variables: { id: courseID },
    }
  );
  return (
    <div>
      <p className='alert'>🢃 Enter Course ID for new enrolment</p>

      <Form style={{ display: 'flex' }} onFinish={() => enrolCourseCallback()}>
        <Form.Item
          label='Course ID'
          name='courseID'
          rules={[{ required: true, message: 'Please input course ID!' }]}
        >
          <Input
            name='courseCode'
            placeholder='Enter course ID to enrol'
            onChange={(e) => setCourseID(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            loading={enrolCourseStatus.loading}
            style={{ marginLeft: '10px' }}
            htmlType='submit'
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
