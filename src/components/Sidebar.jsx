import React, { useState, useEffect } from "react";
import { NavLink as Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import logo from "/assets/dist/img/AdminLTELogo.png";

export default function Sidebar() {
  const userdetail = useAuthUser();
  const navigate = useNavigate();

  const [ruleUser, setRuleUser] = useState(false);
  const [ruleApprover, setRuleApprover] = useState(false);
  const [ruleAdmin, setRuleAdmin] = useState(false);
  const [ruleCarManage, setRuleCarManage] = useState(false);

  const getRule = async () => {
    if (userdetail().role === "user") {
      setRuleUser(true);
      return;
    }
    if (
      userdetail().role === "approver_1" ||
      userdetail().role === "approver_2" ||
      userdetail().role === "approver_3"
    ) {
      setRuleApprover(true);
      return;
    }
    if (userdetail().role === "admin") {
      setRuleAdmin(true);
      return;
    }
    if (userdetail().role === "car_manage") {
      setRuleCarManage(true);
      return;
    }
  };

  useEffect(() => {
    getRule();
  }, []);

  return (
    <>
      <aside className="main-sidebar nav-pills sidebar-dark-primary sidebar-no-expand elevation-1">
        <Link to="/" className="brand-link">
          <img
            src={logo}
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-1"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">OT-SYSTEM</span>
        </Link>
        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {ruleUser ? (
                <>
                <li className="nav-header">MAIN MENU</li>
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      <i className="nav-icon fas fa-home"></i>
                      <p>หน้าหลัก</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/overtime" className="nav-link">
                      <i className="nav-icon fas fa-calendar-plus"></i>
                      <p>ขออนุมัติ OT</p>
                    </Link>
                  </li>
                  <li className="nav-header">REPORT MENU</li>
                    <li className="nav-item">
                    <Link to="/user-report" className="nav-link">
                      <i className="nav-icon fas fa-users"></i>
                      <p>พนักงานที่ทำโอที</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/ot-user/overtime" className="nav-link">
                      <i className="nav-icon fas fa-chart-pie"></i>
                      <p>เอกสารการทำโอที</p>
                    </Link>
                  </li>
                </>
              ) : null}

              {ruleApprover ? (
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      <i className="nav-icon fas fa-home"></i>
                      <p>หน้าหลัก</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/approver" className="nav-link">
                      <i className="nav-icon fas fa-user-check"></i>
                      <p>การอนุมัติ OT</p>
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link to="/report" className="nav-link">
                      <i className="nav-icon fas fa-chart-pie"></i>
                      <p>รายงานโอที</p>
                    </Link>
                  </li> */}
                </>
              ) : null}
              {ruleAdmin ? (
                <>
                  <li className="nav-header">ADMIN MENU</li>
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      <i className="nav-icon fas fa-tachometer-alt"></i>
                      <p>หน้าหลัก</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/overtime" className="nav-link">
                      <i className="nav-icon fas fa-calendar-plus"></i>
                      <p>เอกสารโอที</p>
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link to="/overtime" className="nav-link">
                      <i className="nav-icon fas fa-calendar-plus"></i>
                      <p>ขออนุมัติ OT</p>
                    </Link>
                  </li> */}
                  {/* <li className="nav-header">OTHER MENU</li> */}
                 
                  <li className="nav-item">
                    <Link to="/admin/employees" className="nav-link">
                      <i className="nav-icon fas fa-users"></i>
                      <p>พนักงาน</p>
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link to="/admin/timescan" className="nav-link">
                      <i className="nav-icon fas fa-business-time"></i>
                      <p>Time-scan</p>
                    </Link>
                  </li> */}
                  <li className="nav-item">
                    <Link to="/admin/approver" className="nav-link">
                      <i className="nav-icon fas fa-check-circle"></i>
                      <p>สายอนุมัติ</p>
                    </Link>
                  </li>
                  <li className="nav-header">REPORT MENU</li>
                  <li className="nav-item">
                    <Link to="/report" className="nav-link">
                      <i className="nav-icon fas fa-users"></i>
                      <p>พนักงานที่ทำโอที</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/ot/overtime" className="nav-link">
                      <i className="nav-icon fas fa-chart-pie"></i>
                      <p>เอกสารการทำโอที</p>
                    </Link>
                  </li>
                </>
              ) : null}
              {ruleCarManage ? (
                <>
                  <li className="nav-header">MAIN MENU</li>
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      <i className="nav-icon fas fa-home"></i>
                      <p>หน้าหลัก</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/officecar" className="nav-link">
                      <i className="nav-icon fas fa-truck"></i>
                      <p>รถรับส่ง</p>
                    </Link>
                  </li>
                </>
              ) : (
                ""
              )}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
