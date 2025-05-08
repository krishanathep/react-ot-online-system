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
import AppEdit from './pages/approver/edit'
import OfficeCar from "./pages/officecar";
import Employees from './pages/admin/employees'
import EmployeeCreate from "./pages/admin/employees/create";
import EmployeeUpdate from './pages/admin/employees/edit'
import TimeScan from "./pages/admin/timescan";
import OvertimeAdmin from './pages/admin/overtime'
import OverTimeViewAdmin from './pages/admin/overtime/view'
import BusPriceAdmin from './pages/admin/overtime/busprice'
import ApproverMaster from "./pages/admin/approver";
import ApproverMasterCreate from './pages/admin/approver/create'
import ApproverMasterUpdate from './pages/admin/approver/update'
import Report from './pages/report'
import OTReport from './pages/report/overtime'
import OTReportView from './pages/report/view'

import ReportUser from './pages/reportUser'
import OTReportUser from './pages/reportUser/overtime'
import OTReportUserView from './pages/reportUser/view'

const RoutesPage = () => {
  return (
    <Router basename="/otrequest">
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
          <Route path="/approver/edit/:id" element={<AppEdit />} />
          <Route path="/officecar/" element={<OfficeCar/>} />
          <Route path="/report" element={<Report/>}/>
          <Route path="/ot/overtime" element={<OTReport/>}/>
          <Route path="/ot/overtime/view/:id" element={<OTReportView/>}/>
          <Route path="/user-report" element={<ReportUser/>}/>
          <Route path="/ot-user/overtime" element={<OTReportUser/>}/>
          <Route path="/ot-user/overtime/view/:id" element={<OTReportUserView/>}/>

          {/* Route ADIMIN */}
          <Route path="/admin/overtime" element={<OvertimeAdmin />} />
          <Route path="/admin/overtime/view/:id" element={<OverTimeViewAdmin />} />
          <Route path="/admin/employees" element={<Employees/>} />
          <Route path="/admin/employees/create" element={<EmployeeCreate/>} />
          <Route path="/admin/employees/update/:id" element={<EmployeeUpdate/>} />
          <Route path="/admin/timescan" element={<TimeScan/>} />
          <Route path="/admin/approver" element={<ApproverMaster/>} />
          <Route path="/admin/approver/create" element={<ApproverMasterCreate/>} />
          <Route path="/admin/approver/update/:id" element={<ApproverMasterUpdate/>} />
          <Route path="/admin/overtime/busprice" element={<BusPriceAdmin/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default RoutesPage;
