import { useQuery } from "@apollo/react-hooks";
import { Button, Card, Layout, Spin } from "antd";
import React, { useContext, useState } from "react";
import { Notification } from "../../../components/common/notification";
import { Footer, Greeting, Navbar, PageTitleBreadcrumb } from "../../../components/common/sharedLayout";
import { NotificationContext } from "../../../context";
import { CheckError } from "../../../ErrorHandling";
import { FETCH_NOTIFICATION_LIMIT } from "../../../globalData";
import { FETCH_NOTIFICATION_QUERY } from "../../../graphql/query";
import "./Notifications.css";

const { Content } = Layout;

export default () => {
  const {
    notifications,
    fetchedDone,
    setFetchedDone,
    loadNotifications,
    uncheckedNotificationCount,
    setUncheckedNotificationCount,
    isInitialAccess,
    setIsInitialAccess,
  } = useContext(NotificationContext);

  const [fetchedLimit] = useState(FETCH_NOTIFICATION_LIMIT);

  const { loading, fetchMore, networkStatus } = useQuery(
    FETCH_NOTIFICATION_QUERY,
    {
      onCompleted: (data) => {
        if (!isInitialAccess) {
          loadNotifications(data.getNotifications);

          let count = 0;
          data.getNotifications.map((n) => {
            if (!n.checked) count++;
            return null;
          });
          if (uncheckedNotificationCount >= count)
            setUncheckedNotificationCount(uncheckedNotificationCount - count);

          setIsInitialAccess(true);
        }
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
          if (!n.checked) count++;
          return null;
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

  return (
    <div className="notifications">
      <Layout className="notifications layout">
        <Navbar />

        <Layout>
          <Greeting />
          <PageTitleBreadcrumb
            titleList={[{ name: "Notification", link: "/notification" }]}
          />
          <Content className="notifications__content">
            <Card className="notifications__card">
              {notifications &&
                notifications.map((notification) => (
                  <Notification
                    key={notification._id}
                    notification={notification}
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
                <div className="allLoadedCard">
                  <h3>All Notifications Loaded</h3>
                </div>
              )}
              {notifications && notifications.length === 0 && (
                <p>No notifications...</p>
              )}
            </Card>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  );
};
