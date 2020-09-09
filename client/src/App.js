import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import {
  AuthProvider,
  CourseProvider,
  EnrolmentProvider,
  NavbarProvider,
  NotificationProvider,
} from "./context";
import {
  CourseDetails,
  Dashboard,
  MainMenu,
  NoFound,
  Notifications,
  Profile,
  SignIn,
  SignUp,
} from "./pages/common";
import { AddCourse, EnrolRequest, TakeAttendance } from "./pages/lecturerPage";
import Testing from "./Testing";
import AuthRoute from "./utils/AuthRoute";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <NavbarProvider>
      <AuthProvider>
        <NotificationProvider>
          <CourseProvider>
            <EnrolmentProvider>
              <Router>
                <Switch>
                  <ProtectedRoute exact path="/" component={MainMenu} />
                  <ProtectedRoute exact path="/signin" component={SignIn} />
                  <ProtectedRoute exact path="/signup" component={SignUp} />

                  <AuthRoute exact path="/dashboard" component={Dashboard} />
                  <AuthRoute exact path="/profile" component={Profile} />
                  <AuthRoute
                    exact
                    path="/notification"
                    component={Notifications}
                  />
                  <AuthRoute
                    exact
                    path="/course/:id"
                    component={CourseDetails}
                  />
                  <AuthRoute exact path="/addcourse" component={AddCourse} />
                  <AuthRoute exact path="/testing" component={Testing} />
                  <AuthRoute
                    exact
                    path="/course/:id/takeattendance"
                    component={TakeAttendance}
                  />
                  <AuthRoute
                    exact
                    path="/enrolrequest"
                    component={EnrolRequest}
                  />

                  <AuthRoute component={NoFound} />
                </Switch>
              </Router>
            </EnrolmentProvider>
          </CourseProvider>
        </NotificationProvider>
      </AuthProvider>
    </NavbarProvider>
  );
}

export default App;
