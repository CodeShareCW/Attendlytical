import { ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Space } from "antd";
import moment from "moment";
import React from "react";
import "./Course.css";

export default ({ user, course, handleAccess, handleDelete }) => {
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

          <Button
            className="course__deleteBtn"
            onClick={() => handleDelete(course)}
          >
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
      {user.userLevel === 0 && (
        <p>
          <strong>Course Owner</strong>:{" "}
          {course.creator.firstName + " " + course.creator.lastName}
        </p>
      )}
      <p>
        <strong>Created At</strong>:{" "}
        {moment(course.createdAt).format("LLL") +
          " (" +
          moment(course.createdAt).fromNow(true) +
          " ago)"}
      </p>
    </Card>
  );
};
