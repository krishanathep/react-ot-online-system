import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";

import WithNavbar from "./layouts/WithNavbar";
import WithOutnavbar from "./layouts/WithOutnavbar";

import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";

import Home from './pages/home'

import Overtime from './pages/overtime'
import OvertimeCreate from './pages/overtime/create'
import OvertimeView from './pages/overtime/view'
import OvertimeEdit from './pages/overtime/edit'
import Approver from "./pages/approver";
import AppView from './pages/approver/view'
import OfficeCar from "./pages/officecar";
import OfficeCarEdit from './pages/officecar/edit'
import Employees from './pages/admin/employees'
import EmployeeCreate from './pages/admin/employees/create'
import EmployeeView from "./pages/admin/employees/view";
import EmployeeEdit from "./pages/admin/employees/edit";
import TimeScan from "./pages/admin/timescan";


const RoutesPage = () => {
  return (
    <Router>
      <Routes>
        <Route element={<WithOutnavbar />}>
          <Route exact  path="/auth/signin" element={<Signin />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>
        <Route
          element={
            <RequireAuth loginPath={"/auth/signin"}>
              <WithNavbar />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/overtime" element={<Overtime />} />
          <Route path="/overtime/create" element={<OvertimeCreate />} />
          <Route path="/overtime/view/:id" element={<OvertimeView />} />
          <Route path="/overtime/edit/:id" element={<OvertimeEdit />} />
          <Route path="/approver" element={<Approver />} />
          <Route path="/approver/view/:id" element={<AppView />} />
          <Route path="/officecar" element={<OfficeCar/>} />
          <Route path="/officecar/edit/:id" element={<OfficeCarEdit/>} />
          {/* Route Employees */}
          <Route path="/employees" element={<Employees/>} />
          <Route path="/employees/create" element={<EmployeeCreate/>} />
          <Route path="/employees/view/:id" element={<EmployeeView/>} />
          <Route path="/employees/edit/:id" element={<EmployeeEdit/>} />
          {/* Rout Time Scan */}
          <Route path="/timescan" element={<TimeScan/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default RoutesPage;
