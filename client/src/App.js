import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import {
  AuthProvider,
  CourseProvider,
  EnrolmentProvider,
  FacePhotoProvider,
  NavbarProvider,
  NotificationProvider,
} from './context';
import {
  CourseDetails,
  Dashboard,
  MainMenu,
  NoFound,
  Notifications,
  Profile,
  SignIn,
  SignUp,
} from './pages/common';
import { AddCourse, EnrolRequest, TakeAttendance } from './pages/lecturerPage';
import { EnrolPending, FaceGallery } from './pages/studentPage';
import {
  AuthRoute,
  LecturerRoute,
  ProtectedRoute,
  StudentRoute,
} from './routes';
import Testing from './Testing';

function App() {
  return (
    <NavbarProvider>
      <AuthProvider>
        <NotificationProvider>
          <CourseProvider>
            <EnrolmentProvider>
              <FacePhotoProvider>
                <Router>
                  <Switch>
                    <ProtectedRoute exact path='/' component={MainMenu} />
                    <ProtectedRoute exact path='/signin' component={SignIn} />
                    <ProtectedRoute exact path='/signup' component={SignUp} />

                    <AuthRoute exact path='/dashboard' component={Dashboard} />
                    <AuthRoute exact path='/profile' component={Profile} />
                    <AuthRoute
                      exact
                      path='/notification'
                      component={Notifications}
                    />
                    <AuthRoute
                      exact
                      path='/course/:id'
                      component={CourseDetails}
                    />
                    <LecturerRoute
                      exact
                      path='/addcourse'
                      component={AddCourse}
                    />
                    <AuthRoute exact path='/testing' component={Testing} />
                    <LecturerRoute
                      exact
                      path='/course/:id/takeattendance'
                      component={TakeAttendance}
                    />
                    <LecturerRoute
                      exact
                      path='/enrolrequest'
                      component={EnrolRequest}
                    />
                    <StudentRoute
                      exact
                      path='/enrolpending'
                      component={EnrolPending}
                    />
                    <StudentRoute
                      exact
                      path='/facegallery'
                      component={FaceGallery}
                    />

                    <AuthRoute component={NoFound} />
                  </Switch>
                </Router>
              </FacePhotoProvider>
            </EnrolmentProvider>
          </CourseProvider>
        </NotificationProvider>
      </AuthProvider>
    </NavbarProvider>
  );
}

export default App;
