import { Breadcrumb } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export default ({ titleList }) => (
  <Breadcrumb className='breadcrumb'>
    {titleList.map((title) => (
      <Breadcrumb.Item key={title.name} className='breadcrumb__item'>
        <Link to={title.link}>{title.name}</Link>
      </Breadcrumb.Item>
    ))}
  </Breadcrumb>
);
