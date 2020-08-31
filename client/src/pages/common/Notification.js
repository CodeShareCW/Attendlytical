/*
  Single notification
*/

//react
import React from "react";

//antd
import { Card } from "antd";
import { CheckOutlined } from "@ant-design/icons";

//third-party util
import moment from "moment";

//style
import "./Notification.css";

function Notification({ notification }) {
  return (
    <Card
      className={
        notification.checked ? "notification" : "unchecked_notification"
      }
    >
      <h1 className="notification__title">{notification.title}</h1>
      <hr />
      <p className="notification__content">{notification.content}</p>
      <div className="notification__seen">
        {notification.checked ? (
          <>
            <CheckOutlined /> seen
          </>
        ) : (
          <>new</>
        )}
      </div>
      <div className="notification__createdAt">
        {moment(notification.updatedAt).fromNow(true)}
      </div>
    </Card>
  );
}

export default Notification;
