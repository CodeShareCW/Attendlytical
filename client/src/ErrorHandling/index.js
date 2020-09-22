import { Card, message } from 'antd';
import FacebookEmoji from 'react-facebook-emoji';
import React from 'react';

export const CheckError = (err) => {
  switch (err.message) {
    case 'GraphQL error: Invalid/Expired token':
      if (err.message === 'GraphQL error: Invalid/Expired token') {
        message.error('Please re-login!');
        localStorage.removeItem('jwtToken');
        window.location.reload();
      }
    default:
      let msg = err.message.replace('GraphQL error: ', '');
      message.error(msg);
  }
};

export const ErrorComp = ({ err }) => (
  <Card>
    <div
      style={{
        fontSize: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <FacebookEmoji type='sad' size='xxxl' />
      <br />
      <p className='alert'>{err.message.replace('GraphQL error: ', '')}</p>
    </div>
  </Card>
);
