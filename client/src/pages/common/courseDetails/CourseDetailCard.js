import { useQuery } from "@apollo/react-hooks";
import { Button, Card, Col, Row } from "antd";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context";
import { CheckError } from "../../../ErrorHandling";
import { GET_WARNING_COUNT_QUERY } from "../../../graphql/query";

export default ({ data, participants }) => {
  const { user } = useContext(AuthContext);
  const warningCountQuery=useQuery(GET_WARNING_COUNT_QUERY,{
    onError(err){
      CheckError(err);
    },
    variables:{
      courseID: data.getCourse._id
    }
  },{notifyOnNetworkStatusChange: true})
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
          {user.userLevel === 0 && (
            <Card
              style={{
                backgroundColor: "#ccc",
                textAlign: "left",
                color: "#000",
              }}
            >
              <p>
                <strong>Your attendance rate in this course is </strong>
                <span style={{ fontSize: "22px", color: "red" }}>100%</span>
                <strong>.</strong>
              </p>
              <p>
                <strong>You are warned by </strong>
                <span style={{ fontSize: "22px", color: "red" }}>
                  {warningCountQuery.data?.getWarningCount||0}
                </span>
                <strong> times.</strong>
              </p>
            </Card>
          )}
          <br />
          <Link to={`/course/${data.getCourse.shortID}/history`}>
            View Attendance History
          </Link>
        </Card>
      </Col>
    </Row>
  );
};
