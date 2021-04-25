import {
  BellOutlined,
  LoadingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useQuery } from '@apollo/react-hooks';
import { Button, Layout, Typography, Badge, Avatar } from 'antd';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, NotificationContext } from '../../../context';
import { CheckError } from '../../../utils/ErrorHandling';
import { FETCH_UNCHECKED_NOTIFICATIONS_QUERY } from '../../../graphql/query';
import { LecturerDrawerMenu } from '../../lecturerComponent';
import { StudentDrawerMenu } from '../../studentComponent';
import ProfileNavbar from './ProfileNavbar';
import './Greeting.css';

const { Header } = Layout;
const { Title } = Typography;

export default () => {
  const { user } = useContext(AuthContext);
  const [isCollapseMenuOpen, setIsCollapseMenuOpen] = useState(false);
  const {
    uncheckedNotificationCount,
    setUncheckedNotificationCount,
    pressedNotification,
    setPressedNotification,
  } = useContext(NotificationContext);
  
  useQuery(FETCH_UNCHECKED_NOTIFICATIONS_QUERY, {
    onCompleted: (data) => {
      if (!pressedNotification) {
        setUncheckedNotificationCount(data.getUncheckedNotificationsCount);
        setPressedNotification(true);
      }
    },
    onError(err) {
      CheckError(err);
    },
  });

  const greetMode = () => {
    let h = new Date().getHours();
    if (h >= 0 && h < 12) return 'Morning';
    else if (h >= 12 && h <= 18) return 'Afternoon';
    else return 'Evening';
  };

  return (
    <Header className='greeting__header'>
      <Title className='greeting__title' level={4}>
        <div className='siderNavbar__collapse'>
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => {
              setIsCollapseMenuOpen(true);
            }}
          ></Button>
        </div>
        {user ? (
          user?.userLevel === 0 ? (
            <StudentDrawerMenu
              isCollapseMenuOpen={isCollapseMenuOpen}
              setIsCollapseMenuOpen={setIsCollapseMenuOpen}
            />
          ) : (
            <LecturerDrawerMenu
              isCollapseMenuOpen={isCollapseMenuOpen}
              setIsCollapseMenuOpen={setIsCollapseMenuOpen}
            />
          )
        ) : (
          'error'
        )}

        <span>
          Good {greetMode()}, {user.firstName}
        </span>
        <div className='greeting__profileNavbar'>
          <ProfileNavbar />
        </div>
        <Link
          to='/notification'
          title={`Notification (${uncheckedNotificationCount})`}
        >
          <div className='greeting__notification'>
            <Badge count={uncheckedNotificationCount}>
              <Avatar
                icon={<BellOutlined />}
                style={{ backgroundColor: 'orange' }}
              />
            </Badge>
          </div>
        </Link>
      </Title>
    </Header>
  );
};
