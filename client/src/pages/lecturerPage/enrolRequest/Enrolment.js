import { Button, Card, Row, Col } from "antd";
import React from "react";
import "./Enrolment.css";

export default ({ enrolment, handleApproveRejectButton }) => {
  return (
    <Card className="enrolment__card">
      <Row>
        <Col style={{width: "100%"}}>
          <strong>
            <span>
              {enrolment.student.firstName} {enrolment.student.lastName} (
              {enrolment.student.cardID})
            </span>
          </strong>
          &nbsp; requested to enrol &nbsp;
          <strong>
            <span>
              [Course ID: {enrolment.course.shortID}]{enrolment.course.code}-
              {enrolment.course.name} ({enrolment.course.session})
            </span>
          </strong>
        </Col>
        <Col style={{ width: "100%"}}>
          <div className="enrolmentDetails__buttons">
            <Button
              className="enrolmentDetails__status_acceptBtn"
              onClick={() => handleApproveRejectButton(enrolment, "approved")}
            >
              Approve
            </Button>
            <Button
              className="enrolmentDetails__status_rejectBtn"
              onClick={() => handleApproveRejectButton(enrolment, "rejected")}
            >
              Reject
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};
