import { Card, Col, Row, Spin } from 'antd';
import ListView from './ListView'
import React from 'react';


export default ({absentees, attendees,setAttendees, setAbsentees, loading}) => (
  <Row>
    <Col span={12}>
      <Card>
        <>
          <p
            style={{
              fontWeight: 900,
              fontSize: '15px',
            }}
          >
            Absentee: {absentees.length}
          </p>
          {loading ? (
            <Spin tip='Fetching Absentees...' />
          ) : absentees.length === 0 ? (
            <p>No absentees</p>
          ) : (
            <ListView
              data={absentees}
              absentees={absentees}
              setAttendees={setAttendees}
              setAbsentees={setAbsentees}
            />
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
              fontSize: '15px',
            }}
          >
            Attendee: {attendees.length}
          </p>
          {loading ? (
            <Spin tip='Fetching Attendees...' />
          ) : attendees.length === 0 ? (
            <p>No attendees</p>
          ) : (
            <ListView
              data={attendees}
              absentees={absentees}
              setAttendees={setAttendees}
              setAbsentees={setAbsentees}
            />
          )}
        </>
      </Card>
    </Col>
  </Row>
);
