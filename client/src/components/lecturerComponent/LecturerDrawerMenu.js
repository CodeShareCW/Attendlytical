import {
  AliwangwangOutlined,
  AuditOutlined,
  HistoryOutlined,
  HomeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@apollo/react-hooks';
import { Drawer } from 'antd';
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EnrolmentContext } from '../../context';
import { CheckError } from '../../ErrorHandling';
import { FETCH_ENROLREQUEST_COUNT_QUERY } from '../../graphql/query';

export default ({ isCollapseMenuOpen, setIsCollapseMenuOpen }) => {
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);

  const { enrolCount, getEnrolCount } = useContext(EnrolmentContext);

  const { data } = useQuery(FETCH_ENROLREQUEST_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });

  useEffect(() => {
    if (data) {
      getEnrolCount(data.getEnrolRequestCount);
    }
  }, [data]);

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
          &nbsp; Home
        </Link>
      </p>
      <p>
        <Link to={'/enrolrequest'}>
          <AliwangwangOutlined />
          &nbsp; Enrol Request ({enrolCount})
        </Link>
      </p>
      <p>
        <Link to={'/history'}>
          <HistoryOutlined />
          &nbsp; Attendance History
        </Link>
      </p>
    </Drawer>
  );
};
