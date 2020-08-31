/*
  Greeting Header
*/

//react
import React, { useContext } from "react";
import { Link } from "react-router-dom";

//apollo-graphql
import { useQuery } from "@apollo/react-hooks";
import { FETCH_UNCHECKED_NOTIFICATIONS_QUERY } from "../../graphql/query";

//antd
import { Layout, Typography } from "antd";
import { BellOutlined, LoadingOutlined } from "@ant-design/icons";

//context
import { AuthContext } from "../../context/auth";
import { NotificationContext } from "../../context/notification";

//comp
import ProfileNav from "./ProfileNavbar";

//style
import "./Greeting.css";

//error
import { CheckError } from "../../ErrorHandling";

const { Header } = Layout;
const { Title } = Typography;

export default () => {
  const { user } = useContext(AuthContext);
  const {
    uncheckedNotificationCount,
    setUncheckedNotificationCount,
    pressedNotification,
    setPressedNotification,
  } = useContext(NotificationContext);
  const { loading } = useQuery(FETCH_UNCHECKED_NOTIFICATIONS_QUERY, {
    onCompleted: (data) => {
      if (!pressedNotification)
        setUncheckedNotificationCount(data.getUncheckedNotificationsCount);
    },
    onError(err) {
      CheckError(err);
    },
  });

  const greetMode = () => {
    let h = new Date().getHours();
    if (h >= 0 && h < 12) return "Morning";
    else if (h >= 12 && h <= 18) return "Afternoon";
    else return "Evening";
  };

  const countNotifications = (c) => {
    if (c !== 0)
      return <small className="greeting__notificationCount">{c}</small>;
  };

  return (
    <Header className="greeting__header">
      <Title className="greeting__title" level={4}>
        Good {greetMode()}, {user.firstName}
        <div className="greeting__profileNavbar">
          <ProfileNav profilePictureURL={user.profilePictureURL} />
        </div>
        <Link
          to="/notification"
          title={`Notification (${uncheckedNotificationCount})`}
          onClick={() => setPressedNotification(true)}
        >
          <div className="greeting__notification">
            <BellOutlined className="greeting__notificationIcon" />
            {loading && <LoadingOutlined />}
            {countNotifications(uncheckedNotificationCount)}
          </div>
        </Link>
      </Title>
    </Header>
  );
};
