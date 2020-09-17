import {
  ClockCircleOutlined,
  HistoryOutlined,
  HomeOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { useQuery } from '@apollo/react-hooks';
import { Menu } from 'antd';
import React, { useContext, useEffect } from 'react';
import { FpsView } from 'react-fps';
import { Link } from 'react-router-dom';
import { EnrolmentContext, NavbarContext } from '../../context';
import { CheckError } from '../../ErrorHandling';
import { FETCH_ENROLPENDING_COUNT_QUERY } from '../../graphql/query';

export default () => {
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);

  const { enrolCount, getEnrolCount } = useContext(EnrolmentContext);

  const { collapsed } = useContext(NavbarContext);
  const { data } = useQuery(FETCH_ENROLPENDING_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });

  useEffect(() => {
    if (data) {
      getEnrolCount(data.getEnrolPendingCount);
    }
  }, [data]);
  return (
    <Menu theme='dark' mode='vertical' defaultSelectedKeys={[path]}>
      <Menu.Item key={'dashboard'} icon={<HomeOutlined />}>
        <Link to={'/dashboard'}>Home</Link>
      </Menu.Item>
      <Menu.Item key={'enrolpending'} icon={<ClockCircleOutlined />}>
        <Link to={'/enrolpending'}>Enrol Pending ({enrolCount})</Link>
      </Menu.Item>
      <Menu.Item key={'facegallery'} icon={<PictureOutlined />}>
        <Link to={'/facegallery'}>Face Gallery</Link>
      </Menu.Item>
      <Menu.Item key={'history'} icon={<HistoryOutlined />}>
        <Link to={'/history'}>Attendance History</Link>
      </Menu.Item>
      {!collapsed && <FpsView width={190} height={100} top={525} />}
    </Menu>
  );
};
