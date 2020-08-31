import React from "react";
import moment from "moment";
import { Card, Button, Space } from "antd";
import { ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import "./Course.css";

function Course({ course, handleAccess, handleDelete }) {
  return (
    <Card
      key={course._id}
      className="course"
      title={"ID: " + course._id}
      extra={
        <Space>
          <Button onClick={() => handleAccess(course)}>
            <ArrowRightOutlined />
          </Button>

          <Button
            className="course__deleteBtn"
            style={{ color: "red" }}
            onClick={() => handleDelete(course)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      }
      bordered={false}
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
        <strong>Course Host</strong>:{" "}
        {course.creator.firstName + " " + course.creator.lastName}
      </p>
      <p>
        <strong>Created At</strong>: {moment(course.createdAt).fromNow(true)}
      </p>
    </Card>
  );
}

export default Course;
