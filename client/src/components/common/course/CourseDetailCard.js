import { Button, Card, Col, Row } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context";

export default ({ data, participants }) => {
  const { user } = useContext(AuthContext);

  return (
    <Row className="courseDetails__row">
      <Col>
        <Card className="courseDetails__info">
          <p className="courseDetails__shortID">
            Unique ID: {data.getCourse.shortID}
          </p>
          <p>
            <strong>Code:</strong> {data.getCourse.code}
          </p>
          <p>
            <strong>Name:</strong> {data.getCourse.name}
          </p>
          <p>
            <strong>Session:</strong> {data.getCourse.session}
          </p>
          <p>
            <strong>Total Participants:</strong> {participants.length}
          </p>
          {user.userLevel === 1 && (
            <>
              <Button type="primary" className="courseDetails__takeAttendance">
                <Link to={`/course/${data.getCourse.shortID}/takeAttendance`}>
                  Take Attendance
                </Link>
              </Button>

              <br />
              <br />
            </>
          )}

          <Link to={`/course/${data.getCourse.shortID}/history`}>
            View Attendance History
          </Link>
        </Card>
      </Col>
    </Row>
  );
};
