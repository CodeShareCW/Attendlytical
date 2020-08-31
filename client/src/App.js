import React from "react";
import { BrowserRouter as Router, Switch} from "react-router-dom";

import Home from "./pages/common/Home";
import SignIn from "./pages/common/SignIn";
import SignUp from "./pages/common/SignUp";
import NoFound from "./pages/common/NoFound";
import Profile from "./pages/common/Profile";
import Dashboard from "./pages/common/Dashboard";
import Notifications from "./pages/common/Notifications";
import AddCourse from "./pages/lecturerPage/AddCourse";
import Testing from "./Testing";

import { AuthProvider } from "./context/auth";
import { NavbarProvider } from "./context/navbar";
import { NotificationProvider } from "./context/notification";
import { CourseProvider } from "./context/course";

import AuthRoute from "./utils/AuthRoute";
import ProtectedRoute from "./utils/ProtectedRoute";
import TakeAttendance from "./pages/lecturerPage/TakeAttendance";
import CourseDetails from "./pages/lecturerPage/CourseDetails";

import "./App.css";

function App() {
  return (
    <NavbarProvider>
      <AuthProvider>
        <NotificationProvider>
          <CourseProvider>
            <Router>
              <Switch>
                <ProtectedRoute exact path="/" component={Home} />
                <ProtectedRoute exact path="/signin" component={SignIn} />
                <ProtectedRoute exact path="/signup" component={SignUp} />

                <AuthRoute exact path="/dashboard" component={Dashboard} />
                <AuthRoute exact path="/profile" component={Profile} />
                <AuthRoute exact path="/notification" component={Notifications} />
                <AuthRoute exact path="/course/:id" component={CourseDetails} />
                <AuthRoute exact path="/addcourse" component={AddCourse} />
                <AuthRoute exact path="/testing" component={Testing} />
                <AuthRoute
                  exact
                  path="/course/:id/takeattendance"
                  component={TakeAttendance}
                />

                <AuthRoute component={NoFound} />
              </Switch>
            </Router>
          </CourseProvider>
        </NotificationProvider>
      </AuthProvider>
    </NavbarProvider>
  );
}

export default App;
