import { Layout } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const { Footer } = Layout;
export default () => (
  <Footer style={{ textAlign: 'center' }}>
    <span>&copy; Attendlytical {new Date().getFullYear()}</span>
    <span>&nbsp;&nbsp;&nbsp; <Link to="/privacypolicy">Privacy Policy</Link></span>
    <span>&nbsp;&nbsp;&nbsp; <Link to="/termandcondition">Term & Condition</Link></span>
    <span>&nbsp;&nbsp;&nbsp; <Link to="/userguidelines">User Guidelines</Link></span>
  </Footer>
);
