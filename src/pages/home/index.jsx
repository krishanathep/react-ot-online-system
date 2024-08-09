import React, { useState, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
import axios from "axios";

export default function Home() {

  // const data = [
  //   {
  //     name: "PRD",
  //     Target: 157,
  //     Actual: 155,
  //   },
  //   {
  //     name: "PLD",
  //     Target: 62,
  //     Actual: 60,
  //   }, {
  //     name: "QAD",
  //     Target: 50,
  //     Actual: 48,
  //   },{
  //     name: "PED",
  //     Target: 12,
  //     Actual: 12,
  //   }, {
  //     name: "RDD",
  //     Target: 27,
  //     Actual: 20,
  //   }, {
  //     name: "PPD",
  //     Target: 116,
  //     Actual: 128,
  //   }, {
  //     name: "FED",
  //     Target: 22,
  //     Actual: 22,
  //   }, {
  //     name: "AED",
  //     Target: 10,
  //     Actual: 8,
  //   }, 
  // ];

  //user login
  const userDatail = useAuthUser();

  const [overtimes, setOvertimes] = useState(0);
  const [inprogress1, setInprogress1] = useState(0);
  const [approved1, setApproved1] = useState(0);
  const [rejected, setRejected] = useState(0);

  const getAll = async () => {
    await axios
      .get(
        import.meta.env.VITE_API_KEY+"/laravel_auth_jwt_api/public/api/otrequests-dept?data="+ userDatail().dept
      )
      .then((res) => {

        const counter1 = res.data.otrequests.filter(ot=>ot.status==="รอการอนุมัติ 2" || ot.status==="รอการอนุมัติ 3" || ot.status==="รอการอนุมัติ 4")
        const counter3 = res.data.otrequests.filter(ot=>ot.status==="ผ่านการอนุมัติ")
        const counter5 = res.data.otrequests.filter(ot=>ot.status==="ไม่ผ่านการอนุมัติ")

        setOvertimes(res.data.otrequests.length);
        setInprogress1(counter1.length)
        setApproved1(counter3.length)
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
            <div className="col-lg-3">
              <div className="small-box bg-primary">
                <div className="inner">
                  <h3>{overtimes}</h3>
                  <p>ขออนุมัติทำ OT</p>
                </div>
                <div className="icon">
                <i className="fas fa-calendar-plus"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3 className="text-white">{ inprogress1 }</h3>
                  <p className="text-white">รอการอนุมัติ</p>
                </div>
                <div className="icon">
                <i className="fas fa-clock"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
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
            <div className="col-lg-3">
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
            {/* <div className="col-lg-6 mt-3">
                <div className="card card-outline card-primary">
                  <div className="card-body">
                    <h5>Overtimes</h5>
                    <ResponsiveContainer width={"100%"} height={300}>
                    <BarChart
                      width={600}
                      height={300}
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Target" fill="#8884d8" />
                      <Bar dataKey="Actual" fill="#82ca9d" />
                    </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
