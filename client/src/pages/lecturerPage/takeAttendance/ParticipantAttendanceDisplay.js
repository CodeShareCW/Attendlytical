import { Card, Col, Row, Spin } from 'antd';
import ListView from './ListView';
import React from 'react';

export default ({ participants, absentees, setAbsentees, loading }) => (
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
          ) : (
            <ListView
              participants={participants}
              absentees={absentees}
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
            Attendee: {participants.length - absentees.length}
          </p>

          <ListView
            participants={participants}
            absentees={participants.filter(
              (participant) => !absentees.includes(participant)
            )}
            setAbsentees={setAbsentees}
          />
        </>
      </Card>
    </Col>
  </Row>
);
