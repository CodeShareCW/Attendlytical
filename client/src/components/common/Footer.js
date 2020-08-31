/*
    footer use
*/

//react
import React from "react";

//antd
import { Layout } from "antd";

const { Footer } = Layout;
export default () => (
  <Footer style={{ textAlign: "center" }}>
    <span>Faces In @ {new Date().getFullYear()}</span>
  </Footer>
);
