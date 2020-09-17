/*
  Single notification
*/
import { CheckOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import moment from 'moment';
import React from 'react';
import './Notification.css';

export default ({ notification }) => {
  return (
    <Card
      className={
        notification.checked ? 'notification' : 'unchecked_notification'
      }
    >
      <h1 className='notification__title'>{notification.title}</h1>
      <hr />
      <p className='notification__content'>{notification.content}</p>
      <div className='notification__seen'>
        {notification.checked ? (
          <>
            <CheckOutlined /> seen
          </>
        ) : (
          <>new</>
        )}
      </div>
      <div className='notification__createdAt'>
        {moment(notification.updatedAt).fromNow(true)}
      </div>
    </Card>
  );
};
