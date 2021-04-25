import {
  HomeOutlined,
} from '@ant-design/icons';
import { useQuery } from '@apollo/react-hooks';
import { Drawer } from 'antd';
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EnrolmentContext } from '../../context';
import { CheckError } from '../../utils/ErrorHandling';
import { FETCH_ENROLREQUEST_COUNT_QUERY } from '../../graphql/query';

export default ({ isCollapseMenuOpen, setIsCollapseMenuOpen }) => {
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);

  const { enrolCount, getEnrolCount } = useContext(EnrolmentContext);


  return (
    <Drawer
      title='Menu'
      className='drawerMenu'
      visible={isCollapseMenuOpen}
      placement='top'
      onClose={() => {
        setIsCollapseMenuOpen(false);
      }}
    >
      <p>
        <Link to={'/dashboard'}>
          <HomeOutlined />
          &nbsp; Courses
        </Link>
      </p>
    </Drawer>
  );
};
