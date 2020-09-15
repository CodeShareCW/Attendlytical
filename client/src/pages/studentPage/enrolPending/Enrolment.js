import { Card, Col, Row } from "antd";
import React from "react";

export default ({ enrolment }) => {
  return (
    <Card className="enrolment__card">
      <Row>
        <Col style={{ width: "100%" }}>
          <strong>
            <span>
              [Course ID: {enrolment.course.shortID}] &nbsp;{" "}
              {enrolment.course.code}-{enrolment.course.name} (
              {enrolment.course.session})
            </span>
          </strong>
        </Col>
        <br />
        <br />
        <Col style={{ width: "100%" }}>
          <span
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontStyle: "italic",
            }}
          >
            Owned by&nbsp;<span style={{ color: "#18f", fontWeight: "bold" }}>
              {enrolment.courseOwner.firstName} {enrolment.courseOwner.lastName}
            </span>
          </span>
        </Col>
      </Row>
    </Card>
  );
};
