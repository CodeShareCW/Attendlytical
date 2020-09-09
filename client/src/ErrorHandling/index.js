import { message } from "antd";

export const CheckError = (err) => {
  switch (err.message) {
    case "GraphQL error: Invalid/Expired token":
      if (err.message === "GraphQL error: Invalid/Expired token") {
        message.error("Please re-login!");
        localStorage.removeItem("jwtToken");
        window.location.reload();
      }
    default:
      let msg = err.message.replace("GraphQL error: ", "");
      message.error(msg);
  }
};
