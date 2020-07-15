import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';


import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

import './App.css';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />
      <Route component={()=><div>No found</div>} />
    </Router>
  );
}

export default App;
