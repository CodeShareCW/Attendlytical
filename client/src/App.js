import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import 'video-react/dist/video-react.css'; // import css
import './App.css';
import {
  AttendanceProvider,
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
  InCourseAttendanceHistory,
  MainAttendanceHistory,
} from './pages/common';
import {
  AddCourse,
  EnrolRequest,
  SelectCourseForAttendance,
  SingleAttendanceHistory,
  TakeAttendance,
} from './pages/lecturerPage';
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
          <AttendanceProvider>
            <CourseProvider>
              <EnrolmentProvider>
                <FacePhotoProvider>
                  <Router>
                    <Switch>
                      <ProtectedRoute exact path='/' component={MainMenu} />
                      <ProtectedRoute exact path='/signin' component={SignIn} />
                      <ProtectedRoute exact path='/signup' component={SignUp} />

                      <AuthRoute
                        exact
                        path='/dashboard'
                        component={Dashboard}
                      />
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
                        path='/takeAttendance'
                        component={SelectCourseForAttendance}
                      />
                      <LecturerRoute
                        exact
                        path='/course/:id/takeAttendance'
                        component={TakeAttendance}
                      />
                      <LecturerRoute
                        exact
                        path='/enrolrequest'
                        component={EnrolRequest}
                      />
                      <AuthRoute
                        exact
                        path='/history'
                        component={MainAttendanceHistory}
                      />

                      <AuthRoute
                        exact
                        path='/course/:id/history'
                        component={InCourseAttendanceHistory}
                      />

                      <LecturerRoute
                        exact
                        path='/course/:courseID/history/:attendanceID'
                        component={SingleAttendanceHistory}
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
          </AttendanceProvider>
        </NotificationProvider>
      </AuthProvider>
    </NavbarProvider>
  );
}

export default App;
