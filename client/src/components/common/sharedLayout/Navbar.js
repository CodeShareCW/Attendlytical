import { Layout } from 'antd';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, NavbarContext } from '../../../context';
import { LecturerSiderNavbar } from '../../lecturerComponent';
import { StudentSiderNavbar } from '../../studentComponent';
import './Navbar.css';

const { Sider } = Layout;

export default () => {
  const { user } = useContext(AuthContext);
  const { collapsed, toggleCollapsed } = useContext(NavbarContext);

  return (
    <>
      <Sider
        className='siderNavbar'
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
      >
        {user.userLevel == 0 ? <StudentSiderNavbar /> : <LecturerSiderNavbar />}
      </Sider>
    </>
  );
};
