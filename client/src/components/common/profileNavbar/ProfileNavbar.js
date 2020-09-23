import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/auth';
import './ProfileNavbar.css';

export default () => {
  const { user, avatarColor, logout } = useContext(AuthContext);

  const menu = () => (
    <Menu theme='dark'>
      <Menu.Item key={'profile'} icon={<UserOutlined />}>
        <Link to='/profile'>Profile</Link>
      </Menu.Item>
      <Menu.Item key={'logout'} icon={<LogoutOutlined />} onClick={logout}>
        Log Out
      </Menu.Item>
    </Menu>
  );
  return (
    <div className='profileNavbar'>
      <Dropdown overlay={menu} placement='bottomCenter'>
        <Avatar
          className='avatar'
          size='large'
          alt='Face In Profile'
          src={user.profilePictureURL}
          onError={(err) => {
            console.log(err);
          }}
          style={avatarColor}
        >
          {user.firstName[0]}
        </Avatar>
      </Dropdown>
    </div>
  );
};
