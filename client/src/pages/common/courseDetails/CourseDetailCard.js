import { Button, Card, Col, Row, Tag } from 'antd';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context';

export default ({ course, participants, attendanceCount }) => {
  const { user } = useContext(AuthContext);

  const attendRate = participants.find((par) => par.info._id === user._id)
    ?.attendRate;
  const warningCount = participants.find((par) => par.info._id === user._id)
    ?.warningCount;

  return (
    <Row className='courseDetails__row'>
      <Col>
        <Card className='courseDetails__info'>
          <p className='courseDetails__shortID'>Unique ID: {course.shortID}</p>
          <p>
            <strong>Code:</strong> {course.code}
          </p>
          <p>
            <strong>Name:</strong> {course.name}
          </p>
          <p>
            <strong>Session:</strong> {course.session}
          </p>
          <p>
            <strong>Total Participants:</strong> {participants.length}
          </p>
          <p>
            <strong>Amount of Course Attendance Taken:</strong>{' '}
            {attendanceCount}
          </p>
          {user.userLevel === 1 && (
            <>
              <Button type='primary' className='courseDetails__takeAttendance'>
                <Link to={`/course/${course.shortID}/takeAttendance`}>
                  Take Attendance
                </Link>
              </Button>

              <br />
              <br />
            </>
          )}
          {user.userLevel === 0 && (
            <Card
              style={{
                backgroundColor: '#ccc',
                textAlign: 'left',
                color: '#000',
              }}
            >
              {console.log(attendRate)}
              <p>
                <strong>Your attendance rate in this course is </strong>
                <span>
                  {attendRate===null ? (
                    <Tag className='alert'>No attendance record yet</Tag>
                  ) : (
                    <Tag
                      color={
                        attendRate === 0
                          ? '#f00'
                          : attendRate <= 80
                          ? '#f90'
                          : '#0c8'
                      }
                    >
                      {attendRate} {attendRate<80? "< 80": null}%
                    </Tag>
                  )}
                </span>
              </p>
              <p>
                <strong>You are warned by </strong>
                <Tag color='geekblue'>{warningCount || 0}</Tag>
                <strong>times</strong>
              </p>
            </Card>
          )}
          <br />
          <Link to={`/course/${course.shortID}/history`}>
            View Attendance History
          </Link>
        </Card>
      </Col>
    </Row>
  );
};
