import React from "react";
import { Card, Button, Space } from "antd";
import { ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

import "./Course.css"

export default ({ course, handleAccess, handleDelete }) => {
  return (
    <Card
      className="course"
      key={course._id}
      title={"ID: " + course.shortID}
      extra={
        <Space>
          <Button onClick={() => handleAccess(course)}>
            <ArrowRightOutlined />
          </Button>

          <Button className="course__deleteBtn" onClick={() => handleDelete(course)}>
            <DeleteOutlined />
          </Button>
        </Space>
      }
    >
      <p>
        <strong>Course Code</strong>: {course.code}
      </p>
      <p>
        <strong>Course Name</strong>: {course.name}
      </p>
      <p>
        <strong>Course Session</strong>: {course.session}
      </p>
      <p>
        <strong>Created At</strong>: {moment(course.createdAt).fromNow(true)}
      </p>
    </Card>
  );
};
