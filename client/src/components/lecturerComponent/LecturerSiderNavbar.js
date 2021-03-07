import { Avatar } from 'antd';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { NavbarContext } from '../../context';
import { LecturerMenu } from './';
import './LecturerSiderNavbar.css';
import { APP_LOGO_URL } from '../../assets';

export default () => {
  const { collapsed } = useContext(NavbarContext);

  return (
    <div className='lecturerSiderNavbar'>
      <Link to='/dashboard'>
        <div className='lecturerSiderNavbar__logo'>
          <Avatar
            shape="square"
            className='avatar'
            size='large'
            alt='Face In'
            src={APP_LOGO_URL.link}
            onError={(err) => {
              console.log(err);
            }}
          />
          <div
            className={
              !collapsed
                ? 'lecturerSiderNavbar__text'
                : 'lecturerSiderNavbar__text__hidden'
            }
          >
            <span className='lecturerSiderNavbar__text__item'>Lecturer</span>
            <span className='lecturerSiderNavbar__text__item'>Version</span>
          </div>
        </div>
      </Link>

      <div className='lecturerSiderNavbar__menu'>
        <LecturerMenu />
      </div>
    </div>
  );
};
