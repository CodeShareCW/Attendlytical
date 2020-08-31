/*
  show avatar of profile
*/

//react
import React, { useContext } from "react";
import { Link } from "react-router-dom";

//antd
import { Avatar, Menu, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

//context
import { AuthContext } from "../../context/auth";

//style
import "./ProfileNavbar.css";

export default ({profilePictureURL}) => {
  const { logout } = useContext(AuthContext);

  const menu = () => (
    <Menu theme="dark">
      <Menu.Item key={"profile"} icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key={"logout"} icon={<LogoutOutlined />} onClick={logout}>
        Log Out
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="profileNavbar">
      <Dropdown overlay={menu} placement="bottomCenter">
          <Avatar
          className="avatar"
            size="large"
            alt="Face In"
            src={profilePictureURL}
            icon={<UserOutlined />}
            onError={(err) => {
              console.log(err);
            }}
          />
      </Dropdown>
    </div>
  );
};
