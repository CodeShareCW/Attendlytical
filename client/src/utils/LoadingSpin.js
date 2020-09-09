import { Spin } from "antd";
import React from "react";

export const LoadingSpin = ({ loading }) => {
  return loading && <Spin tip="Loading..." />;
};
