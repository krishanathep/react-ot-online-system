import React from "react";
import { NavLink as Link } from "react-router-dom";

export default function Sidebar() {
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
          <span className="brand-text font-weight-light">KSS SYSTEM</span>
        </Link>
        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-header">เมนูหลัก</li>
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="nav-icon fas fa-home"></i>
                  <p>หน้าแรก</p>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to="/restaurant" className="nav-link">
                  <i className="nav-icon fas fa-utensils"></i>
                  <p>Restaurent</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/foods" className="nav-link">
                  <i className="nav-icon fas fa-hamburger"></i>
                  <p>Foods</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/meetings" className="nav-link">
                  <i className="nav-icon fas fa-calendar"></i>
                  <p>Meetings</p>
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link to="/documents" className="nav-link">
                  <i className="nav-icon fas fa-file-pdf"></i>
                  <p>เอกสาร</p>
                </Link>
              </li> */}
              <li className="nav-item">
                <Link to="/suggestions" className="nav-link">
                  <i className="nav-icon fas fa-users"></i>
                  <p>ข้อเสนอแนะ</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/approver" className="nav-link">
                  <i className="nav-icon fas fa-user-check"></i>
                  <p>การอนุมัติ</p>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to="/movies" className="nav-link">
                  <i className="nav-icon fas fa-photo-video"></i>
                  <p>Movies</p>
                </Link>
              </li>
              <li className="nav-header">TEST MENU</li>
              <li className="nav-item">
                <Link to="/test/table" className="nav-link">
                  <i className="nav-icon fas fa-vial"></i>
                  <p>Table</p>
                </Link>
              </li>
               <li className="nav-item">
                <Link to="/chart" className="nav-link">
                  <i className="nav-icon fas fa-chart-pie"></i>
                  <p>Chart</p>
                </Link>
              </li> */}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
