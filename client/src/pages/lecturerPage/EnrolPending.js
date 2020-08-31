/*
  All notification
 */

//react
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

//apollo-graphql
import { useQuery, useMutation } from "@apollo/react-hooks";
import {APPROVE_ENROLMENT_MUTATION, REJECT_ENROLMENT_MUTATION} from "../../graphql/mutation"
import {FETCH_NOTIFICATION_QUERY} from "../../graphql/query"

//antd
import { Layout, Button, Modal, Breadcrumb, Card, Spin, message } from "antd";

//context
import { NavbarContext } from "../../context/navbar";
import { NotificationContext } from "../../context/notification";

//comp
import Navbar from "../../components/common/Navbar";
import Greeting from "../../components/common/Greeting";
import Notification from "./Notification";
import Footer from "../../components/common/Footer";

//error
import { CheckError } from "../../ErrorHandling";

//style
import "./Notifications.css";

const { Sider, Content } = Layout;

export default () => {
  const {
    notifications,
    fetchedDone,
    setFetchedDone,
    loadNotifications,
    uncheckedNotificationCount,
    setUncheckedNotificationCount,
    approveEnrolment,
    rejectEnrolment,
  } = useContext(NotificationContext);
  const [visible, SetVisible] = useState(false);
  const [selectedNotification, SetSelectedNotification] = useState({});
  const [approve, isApprove] = useState(false);
  const [fetchedLimit] = useState(10);
  const { collapsed, toggleCollapsed } = useContext(NavbarContext);

  const { loading, fetchMore, networkStatus} = useQuery(
    FETCH_NOTIFICATION_QUERY,
    {
      onCompleted: (data) => {
        if (notifications.length === 0)
          loadNotifications(data.getNotifications);

        let count = 0;
        data.getNotifications.map((n) => {
          if (!n.checked) count++;
        });
        if (uncheckedNotificationCount >= count)
          setUncheckedNotificationCount(uncheckedNotificationCount - count);
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        limit: fetchedLimit,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [approveEnrolmentCallback, approveEnrolmentStatus] = useMutation(
    APPROVE_ENROLMENT_MUTATION,
    {
      onCompleted: (data) => {
        message.success(data.approveEnrolment);
      },
      onError(err) {
        SetVisible(false);
        CheckError(err);
      },
    }
  );

  const [rejectEnrolmentCallback, rejectEnrolmentStatus] = useMutation(
    REJECT_ENROLMENT_MUTATION,
    {
      onCompleted: (data) => {
        message.success(data.rejectEnrolment);
      },
      onError(err) {
        SetVisible(false);
        CheckError(err);
      },
    }
  );

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        limit: fetchedLimit,
        cursor: notifications[notifications.length - 1]._id,
      },
      onError(err) {
        CheckError(err);
      },
      updateQuery: (pv, { fetchMoreResult }) => {
        if (fetchMoreResult.getNotifications.length === 0) {
          setFetchedDone(true);
          return pv;
        }
        if (fetchMoreResult.getNotifications.length < fetchedLimit) {
          setFetchedDone(true);
        }

        loadNotifications(fetchMoreResult.getNotifications);
        let count = 0;

        fetchMoreResult.getNotifications.map((n) => {
          console.log(n);
          if (!n.checked) count++;
        });
        if (uncheckedNotificationCount >= count)
          setUncheckedNotificationCount(uncheckedNotificationCount - count);
        return {
          getNotifications: [
            ...pv.getNotifications,
            ...fetchMoreResult.getNotifications,
          ],
        };
      },
    });
  };

  const handleApproveRejectButton = (notification, pressed) => {
    SetVisible(true);
    SetSelectedNotification(notification);
    if (pressed === "accepted") {
      isApprove(true);
    } else if (pressed === "rejected") {
      isApprove(false);
    }
  };

  const handleCancel = () => {
    SetVisible(false);
    SetSelectedNotification({});
  };

  const handleConfirm = () => {
    if (approve) {
      approveEnrolmentCallback({
        update() {
          approveEnrolment(selectedNotification);
          SetVisible(false);
          SetSelectedNotification({});
        },
        variables: { id: selectedNotification._id },
      });
    } else {
      rejectEnrolmentCallback({
        update() {
          rejectEnrolment(selectedNotification);
          SetVisible(false);
          SetSelectedNotification({});
        },
        variables: { id: selectedNotification._id },
      });
    }
  };

  return (
    <div className="notifications">
      <Layout className="notifications layout">
        <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
          <Navbar />
        </Sider>
        <Layout>
          <Greeting />
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb__item">
              <Link to="/notification">Notification</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Content className="notifications__content">
            <Card className="notifications__card">
              {notifications &&
                notifications.map((notification) => (
                  <Notification
                    key={notification._id}
                    notification={notification}
                    handleApproveRejectButton={handleApproveRejectButton}
                  />
                ))}
              {loading && (
                <div className="notifications__loading__container">
                  <div className="notifications__loading">
                    <Spin size="large" tip="Loading..." />
                  </div>
                </div>
              )}
              {notifications && notifications.length !== 0 && !fetchedDone && (
                <Button onClick={handleFetchMore} loading={networkStatus === 3}>
                  Load More Notification...
                </Button>
              )}
              {notifications.length !== 0 && fetchedDone && (
                <div className="notifications__allLoadedCard">
                  <h3>All Notifications Loaded</h3>
                </div>
              )}
              {notifications && notifications.length === 0 && (
                <p>No notifications...</p>
              )}
            </Card>
            <Modal
              className="notification__modal"
              title={approve ? "Approve Enrolment" : "Reject Enrolment"}
              visible={visible}
              onOk={handleConfirm}
              onCancel={handleCancel}
              okButtonProps={{
                disabled:
                  approveEnrolmentStatus.loading ||
                  rejectEnrolmentStatus.loading,
              }}
              cancelButtonProps={{
                disabled:
                  approveEnrolmentStatus.loading ||
                  rejectEnrolmentStatus.loading,
              }}
            >
              {!rejectEnrolmentStatus.loading &&
              !approveEnrolmentStatus.loading ? (
                <div
                  className={
                    approve
                      ? "notification__approveConfirm"
                      : "notification__rejectConfirm"
                  }
                >
                  <p>
                    Are you sure to {approve ? "ACCEPT" : "REJECT"} the
                    following enrolment?
                  </p>
                  <p>
                    <strong>Title: </strong>
                    {selectedNotification.title}
                  </p>
                  <p>
                    <strong>Body: </strong>
                    {selectedNotification.content}
                  </p>
                </div>
              ) : (
                <Spin tip={approve ? "accepting" : "rejecting"}>
                  <div
                    className={
                      approve
                        ? "notification__approveConfirm"
                        : "notification__rejectConfirm"
                    }
                  >
                    <p>
                      Are you sure to {approve ? "ACCEPT" : "REJECT"} the
                      following enrolment?
                    </p>
                    <p>
                      <strong>Title: </strong>
                      {selectedNotification.title}
                    </p>
                    <p>
                      <strong>Body: </strong>
                      {selectedNotification.content}
                    </p>
                  </div>
                </Spin>
              )}
            </Modal>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  );
};


