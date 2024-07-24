import React from "react";
import { NavLink as Link } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";

export default function Sidebar() {
  const userdetail = useAuthUser()
  return (
    <>
      <aside className="main-sidebar nav-pills sidebar-dark-primary sidebar-no-expand elevation-1">
        <Link to="/" className="brand-link">
          <img
            src="/assets/dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-1"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">OT-REQUEST</span>
        </Link>
        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
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
              <li className="nav-item">
                <Link to="/approver" className="nav-link">
                  <i className="nav-icon fas fa-user-check"></i>
                  <p>การอนุมัติ OT</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
