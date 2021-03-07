import { Avatar, Layout, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_LOGO_URL } from '../../../assets';
import './HeaderNavbar.css';

const { Header } = Layout;

export default () => {
  const pathname =
    window.location.pathname; /* e.g: pathname="/signin" or "/" or "/signup" */
  const path = pathname.substr(1); //skip '/' character
  return (
    <div className='headerNavbar'>
      <Header>
        <Link to='/'>
          <div className='headerNavbar__logo'>
            <Avatar
              shape="square"
              className='avatar'
              size='large'
              alt='Attendlytics'
              src={APP_LOGO_URL.link}
              onError={(err) => {
                console.log(err);
              }}
            />
            <div className='headerNavbar__text'>
              <span className='headerNavbar__text__item'>Attendlytical</span>
            </div>
          </div>
        </Link>
        <div className='headerNavbar__menu'>
          <Menu theme='dark' mode='horizontal' defaultSelectedKeys={[path]}>
            <Menu.Item key='signin'>
              <Link to='/signin'>Sign in</Link>
            </Menu.Item>
            <Menu.Item key='signup'>
              <Link to='/signup'>Sign up</Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
    </div>
  );
};
