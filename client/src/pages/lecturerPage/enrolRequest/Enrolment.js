import { Button, Card, Row } from "antd";
import React from "react";
import "./Enrolment.css";

export default ({ enrolment, handleApproveRejectButton }) => {
  return (
    <Card className="enrolment__card">
      <Card className="enrolment__card__item">
        <Row>
          <strong>Student Detail</strong>
        </Row>
        <br />
        <Row>
          First Name: &nbsp;<span>{enrolment.student.firstName}</span>
        </Row>
        <Row>
          Last Name: &nbsp;<span>{enrolment.student.lastName}</span>
        </Row>
        <Row>
          Matric No: &nbsp;<span>{enrolment.student.cardID}</span>
        </Row>
        <Row>
          Email:&nbsp;
          <span>
            <a href={`mailto:${enrolment.student.email}`}>
              {enrolment.student.email}
            </a>
          </span>
        </Row>
      </Card>

      <br />
      <Card className="enrolment__card__item">
        <Row>
          <strong>Course Detail</strong>
        </Row>
        <br />
        <Row>
          Course ID: &nbsp; <span>{enrolment.course.shortID}</span>
        </Row>

        <Row>
          Course Code: &nbsp;<span>{enrolment.course.code}</span>
        </Row>
        <Row>
          Course Name: &nbsp; <span>{enrolment.course.name}</span>
        </Row>
        <Row>
          Course Session: &nbsp; <span>{enrolment.course.session}</span>
        </Row>
      </Card>
      <br />
      <p style={{ textAlign: "center", color: "black" }}>
        The student requested to enrol this course...
      </p>

      <Row>
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
      </Row>
    </Card>
  );
};
