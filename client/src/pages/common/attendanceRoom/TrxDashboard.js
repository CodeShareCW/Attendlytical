import { useQuery } from "@apollo/react-hooks";
import { Card, Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { CheckError } from "../../../utils/ErrorHandling";
import { FETCH_TRX_LIST_IN_ATTENDANCE } from "../../../graphql/query";
import ListView from "./ListView";

export default (props) => {
  const { participants } = props;
  const trxGQLQuery = useQuery(FETCH_TRX_LIST_IN_ATTENDANCE, {
    onError(err) {
      CheckError(err);
    },
    pollInterval: 2000,

    variables: {
      attendanceID: props.match.params.attendanceID,
    },
  });

  const [attendees, setAttendees] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  
  useEffect(() => {
    console.log(participants);
    if (trxGQLQuery.data) {
      const currAbsentees = participants.filter((participant) => {
        const result = trxGQLQuery.data.getTrxListInAttendance.filter(
          (attendee) => participant.student._id == attendee.studentID
        );

        return result.length == 0; //count as absentee if no found
      });

      console.log(currAbsentees);

      const currAttendees = participants.filter((participant) => {
        const result = trxGQLQuery.data.getTrxListInAttendance.filter(
          (attendee) => participant.student._id == attendee.studentID
        );

        if (result.length >= 1) {
          Object.assign(participant, { attend_at: result[0].createdAt });
        }
        return result.length >= 1; //count as attendee if found
      });

      currAttendees.sort(
        (a, b) => new Date(b.attend_at) - new Date(a.attend_at)
      );

      setAbsentees(currAbsentees);
      setAttendees(currAttendees);
    }
  }, [participants, trxGQLQuery.data]);
  return (
    <Card>
      
      <p
          style={{
            textAlign: "center",
            fontWeight: 900,
            fontSize: "20px",
          }}
        >
          Attendance Transaction: {attendees.length}/{participants.length}
        </p>
    <Row>
     
      <Col span={12}>
        <Card>
          <>
            <p
              style={{
                fontWeight: 900,
                fontSize: "15px",
              }}
            >
              Absentee: {absentees.length}
            </p>
            {trxGQLQuery.loading ? (
              <Spin tip="Fetching Absentees..." />
            ) : (
              <ListView studentList={absentees} />
            )}
          </>
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <>
            <p
              style={{
                fontWeight: 900,
                fontSize: "15px",
              }}
            >
              Attendee: {attendees.length}
            </p>
            {trxGQLQuery.loading ? (
              <Spin tip="Fetching Attendees..." />
            ) :
            <ListView studentList={attendees} />
            }</>
        </Card>
      </Col>
    </Row>
    </Card>
  );
};
