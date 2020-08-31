import React from "react";
import { message } from "antd";

export const CheckError = (err) => {
  switch (err.message) {
    case "GraphQL error: Invalid/Expired token":
      if (err.message === "GraphQL error: Invalid/Expired token") {
        message.error("Please re-login!");
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
    default:
      message.error("Something went wrong!");
  }
};
