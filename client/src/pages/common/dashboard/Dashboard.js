import { Layout } from "antd";
import React, { useContext } from "react";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { AuthContext } from "../../../context";
import { LecturerDashboard } from "../../lecturerPage";
import { StudentDashboard } from "../../studentPage";
import "./Dashboard.css";

const { Content } = Layout;

const WhichDashboard = ({ user, ...props }) => {
  if (!user) return <div>Something wrong...</div>;
  else if (user.userLevel == 0)
    return <StudentDashboard user={user} {...props} />;
  else if (user.userLevel == 1)
    return <LecturerDashboard user={user} {...props} />;
  else return <div>Something wrong with user level...</div>;
};

export default (props) => {
  const { user } = useContext(AuthContext);
  const titleList = [{ name: "Home", link: "/dashboard" }];
  return (
    <Layout className="dashboard layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb titleList={titleList} />
        <Content>
          <WhichDashboard user={user} {...props} />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
