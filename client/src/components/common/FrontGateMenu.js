/*
  Front Gate Menu Item
*/ 

//react
import React from "react";
import { Link } from "react-router-dom";

//antd
import { Menu } from "antd";

export default ()=>{
    const pathname = window.location.pathname;        /* e.g: pathname="/signin" or "/" or "/signup" */
    const path = pathname.substr(1);       //skip '/' character
    return (
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[path]}>

        <Menu.Item key="signin">
          <Link to="/signin">Sign in</Link>
        </Menu.Item>
        <Menu.Item key="signup">
          <Link to="/signup">Sign up</Link>
        </Menu.Item>
      </Menu>
    )
}