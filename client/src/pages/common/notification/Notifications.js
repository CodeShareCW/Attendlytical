import { useQuery } from '@apollo/react-hooks';
import { Button, Card, Layout, Spin } from 'antd';
import React, { useContext, useState, useEffect } from 'react';
import Notification from '../../../components/common/notification/Notification';
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from '../../../components/common/sharedLayout';
import { NotificationContext } from '../../../context';
import { CheckError, ErrorComp } from '../../../ErrorHandling';
import { FETCH_NOTIFICATION_LIMIT } from '../../../globalData';
import { FETCH_NOTIFICATIONS_QUERY } from '../../../graphql/query';
import './Notifications.css';

const { Content } = Layout;

export default () => {
  const {
    notifications,
    fetchedDone,
    setFetchedDone,
    loadNotifications,
    uncheckedNotificationCount,
    setUncheckedNotificationCount,
  } = useContext(NotificationContext);

  const { data, loading, error, fetchMore, networkStatus } = useQuery(
    FETCH_NOTIFICATIONS_QUERY,
    {
      onError(err) {
        CheckError(err);
      },
      variables: {
        limit: FETCH_NOTIFICATION_LIMIT,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (data) {
      loadNotifications(data.getNotifications.notifications);

      let count = 0;
      data.getNotifications.notifications.map((n) => {
        if (!n.checked) count++;
        setTimeout(() => (n.checked = true), 2000);
      });

      if (uncheckedNotificationCount >= count)
        setUncheckedNotificationCount(uncheckedNotificationCount - count);

      if (!data.getNotifications.hasNextPage) setFetchedDone(true);
      else setFetchedDone(false);
    }
  }, [data]);

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        limit: FETCH_NOTIFICATION_LIMIT,
        cursor: notifications[notifications.length - 1]._id,
      },
      onError(err) {
        CheckError(err);
      },
      updateQuery: (pv, { fetchMoreResult }) => {
        if (!fetchMoreResult.getNotifications.hasNextPage) {
          setFetchedDone(true);
        }
        let count = 0;

        fetchMoreResult.getNotifications.notifications.map((n) => {
          if (!n.checked) count++;
          return null;
        });
        if (uncheckedNotificationCount >= count)
          setUncheckedNotificationCount(uncheckedNotificationCount - count);
        return {
          getNotifications: {
            __typename: 'Notifications',
            notifications: [
              ...pv.getNotifications.notifications,
              ...fetchMoreResult.getNotifications.notifications,
            ],
            hasNextPage: fetchMoreResult.getNotifications.hasNextPage,
          },
        };
      },
    });
  };
  return (
    <div className='notifications'>
      <Layout className='notifications layout'>
        <Navbar />

        <Layout>
          <Greeting />
          <PageTitleBreadcrumb
            titleList={[{ name: 'Notification', link: '/notification' }]}
          />
          <Content className='notifications__content'>
            {error && <ErrorComp err={error} />}
            {data && (
              <Card className='notifications__card'>
                {notifications &&
                  notifications.map((notification) => (
                    <Notification
                      key={notification._id}
                      notification={notification}
                    />
                  ))}
                {loading && (
                  <div className='notifications__loading__container'>
                    <div className='notifications__loading'>
                      <Spin size='large' tip='Loading...' />
                    </div>
                  </div>
                )}
                {notifications && notifications.length !== 0 && !fetchedDone && (
                  <Button
                    onClick={handleFetchMore}
                    loading={networkStatus === 3}
                  >
                    Load More Notification...
                  </Button>
                )}
                {notifications.length !== 0 && fetchedDone && (
                  <div className='allLoadedCard'>
                    <h3>All Notifications Loaded</h3>
                  </div>
                )}
                {notifications && notifications.length === 0 && (
                  <p>No notifications...</p>
                )}
              </Card>
            )}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </div>
  );
};
