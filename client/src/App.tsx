import React from 'react';
import { Router, Switch, Route } from 'wouter';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import NotFound from './pages/not-found';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/doctor" component={DoctorDashboard} />
        <Route path="/patient" component={PatientDashboard} />
        <Route path="/accountant" component={AccountantDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
