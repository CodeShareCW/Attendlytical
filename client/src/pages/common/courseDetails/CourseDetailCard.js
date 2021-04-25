import { Button, Card, Col, Row } from 'antd';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context';

export default ({ course }) => {
  const { user } = useContext(AuthContext);

  return (
    <Row className='courseDetails__row'>
      <Col>
        <Card className='courseDetails__info'>
          <p className='courseDetails__shortID'>ID: {course.shortID}</p>
          <p>
            <strong>Code:</strong> {course.code}
          </p>
          <p>
            <strong>Name:</strong> {course.name}
          </p>
          <p>
            <strong>Session:</strong> {course.session}
          </p>
          {user.userLevel === 1 && (
            <>
              <Button type='primary' className='courseDetails__takeAttendance'>
                <Link to={`/course/${course.shortID}/attendanceForm`}>
                  Create Attendance
                </Link>
              </Button>

              <br />
              <br />
            </>
          )}
          <br />
          <Link to={`/course/${course.shortID}/attendanceList`}>
            Attendance List
          </Link>
        </Card>
      </Col>
    </Row>
  );
};
