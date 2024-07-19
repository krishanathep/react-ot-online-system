import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {

  const [overtimes, setOvertimes] = useState(0);
  const [inprogress, setInprogress] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);

  const getAll = async () => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests"
      )
      .then((res) => {
        setOvertimes(res.data.data.length);
      });
  };

  const getInprogress = async () => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-inprogress"
      )
      .then((res) => {
        setInprogress(res.data.otrequests.length);
      });
  };

  const getApproved = async () => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-approved"
      )
      .then((res) => {
        setApproved(res.data.otrequests.length);
      });
  };

  const getRejected = async () => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-rejected"
      )
      .then((res) => {
        setRejected(res.data.otrequests.length);
      });
  };

  useEffect(() => {
    getAll();
    getInprogress()
    getApproved()
    getRejected()
  }, []);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">หน้าหลัก</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <li className="breadcrumb-item active">หน้าหลัก</li>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{overtimes}</h3>
                  <p>คำร้องขออนุมัติ OT ทั้งหมด</p>
                </div>
                <div className="icon">
                <i className="far fa-clock"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="small-box bg-primary">
                <div className="inner">
                  <h3>{ inprogress }</h3>
                  <p>รอการอนุมัติ</p>
                </div>
                <div className="icon">
                <i className="fas fa-cogs"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>{ approved }</h3>
                  <p>ได้รับการอนุมัติ</p>
                </div>
                <div className="icon">
                <i className="far fa-check-circle"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{ rejected }</h3>
                  <p>ไม่ได้รับการอนุมัติ</p>
                </div>
                <div className="icon">
                <i className="far fa-times-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
