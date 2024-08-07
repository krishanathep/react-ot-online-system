import React, { useState, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";
import axios from "axios";

export default function Home() {

  //user login
  const userDatail = useAuthUser();

  const [overtimes, setOvertimes] = useState(0);
  const [inprogress1, setInprogress1] = useState(0);
  const [inprogress2, setInprogress2] = useState(0);
  const [approved1, setApproved1] = useState(0);
  const [approved2, setApproved2] = useState(0);
  const [rejected, setRejected] = useState(0);

  const getAll = async () => {
    await axios
      .get(
        import.meta.env.VITE_API_KEY+"/laravel_auth_jwt_api/public/api/otrequests-dept?data="+ userDatail().dept
      )
      .then((res) => {

        const counter1 = res.data.otrequests.filter(ot=>ot.status==="รอการอนุมัติ 2" || ot.status==="รอการอนุมัติ 3")
        const counter2 = res.data.otrequests.filter(ot=>ot.result==="รอการรายงาน")
        const counter3 = res.data.otrequests.filter(ot=>ot.status==="ผ่านการอนุมัติ")
        const counter4 = res.data.otrequests.filter(ot=>ot.result==="ปิดการรายงาน")
        const counter5 = res.data.otrequests.filter(ot=>ot.status==="ไม่ผ่านการอนุมัติ")

        setOvertimes(res.data.otrequests.length);
        setInprogress1(counter1.length)
        setInprogress2(counter2.length)
        setApproved1(counter3.length)
        setApproved2(counter4.length)
        setRejected(counter5.length)
      });
  };

  

  useEffect(() => {
    getAll();
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
                  <a className="breadcrumb-item active">หน้าหลัก</a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2">
              <div className="small-box bg-primary">
                <div className="inner">
                  <h3>{overtimes}</h3>
                  <p>ขออนุมัติทำ OT</p>
                </div>
                <div className="icon">
                <i className="fas fa-user-plus"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="small-box bg-secondary">
                <div className="inner">
                  <h3>{ inprogress1 }</h3>
                  <p>รอการอนุมัติ</p>
                </div>
                <div className="icon">
                <i className="fas fa-user-clock"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3 className="text-white">{ inprogress2 }</h3>
                  <p className='text-white'>รอการรายงาน</p>
                </div>
                <div className="icon">
                <i className="fas fa-user-cog"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>{ approved1 }</h3>
                  <p>ผ่านการอนุมัติ</p>
                </div>
                <div className="icon">
                <i className="fas fa-user-check"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{ approved2 }</h3>
                  <p>ปิดการรายงาน</p>
                </div>
                <div className="icon">
                <i className="fas fa-user-edit"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-2">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{ rejected }</h3>
                  <p>ไม่ผ่านการอนุมัติ</p>
                </div>
                <div className="icon">
                <i className="fas fa-user-times"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
