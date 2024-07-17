import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import dayjs from "dayjs";

const view = () => {

  const { id } = useParams();

  const [overtimes, setOvertimes]=useState({})
  const [members, setMemebers]=useState([])

  const getData = async () => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequest/"+id
      )
      .then((res) => {
        setOvertimes(res.data.data);
        setMemebers(res.data.data.employees)
        console.log(res.data.data)
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">OT-REQUEST VIEW</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">HOME</a>
                  </li>
                  <li className="breadcrumb-item">OT-REQUEST</li>
                  <li className="breadcrumb-item active">VIEW</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
              <div className="card card-outline card-primary">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="col-md-12">
                          <table className="table table-bordered mt-5">
                            <thead>
                              <tr>
                                <td><b>เลขคำร้อง</b> :  { overtimes.ot_member_id }</td>
                                <td><b>ผู้จัดการฝ่าย</b>  : { overtimes.department_name }</td>
                                <td><b>ผู้ควบคุมงาน</b>  : { overtimes.create_name }</td>
                                <td><b>หน่วยงาน</b>  :  { overtimes.department }</td>
                                <td><b>ประเภทงาน</b>  : { overtimes.work_type }</td>
                              </tr>
                              <tr>
                                <td><b>วันที่ทำงาน</b>  : { dayjs(overtimes.ot_date).format("DD-MM-YYYY") }</td>
                                <td><b>เวลาที่เริ่มต้น</b>  : {overtimes.start_date } น.</td>
                                <td><b>เวลาที่สิ้นสุด</b>  : { overtimes.end_date } น.</td>
                                <td><b>เวลาทั้งหมด</b>  : { overtimes.total_date }</td>
                                <td><b>จำนวนพนักงาน</b> : 1 คน</td>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        <div className="col-md-12">
                          <table className="table table-bordered mt-5">
                            <thead>
                              <tr align={'center'}>
                                <th>#</th>
                                <th>รหัส</th>
                                <th>ชื่อพนักงาน</th>
                                <th>หน่วยงาน</th>
                                <th>ประเภทค่าแรง</th>
                                <th>ชนิดของงาน</th>
                                <th>เป้าหมาย</th>
                                <th>ทำได้จริง</th>
                                <th>ข้อมูลแสกน</th>
                                <th>เวลาเลิกงาน</th>
                                <th>รวมเวลา</th>
                                <th>รถรับส่ง</th>
                                <th>ค่ารถ</th>
                              </tr>
                            </thead>
                            <tbody>
                                {members.map((member, index)=>{
                                  return(
                                    <tr align='center' key={member.id}>
                                    <td>{index +1}</td>
                                    <td>{member.code }</td>
                                    <td>{member.emp_name}</td>
                                    <td>HRD</td>
                                    <td>{member.cost_type}</td>
                                    <td>{member.job_type}</td>
                                    <td>{member.target}</td>
                                    <td><span className="text-primary">{member.objective}</span></td>
                                    <td>{ overtimes.end_date }</td>
                                    <td><span className="text-primary">{ member.out_time }</span></td>
                                    <td>{ overtimes.total_date }</td>
                                    <td>{member.bus_stations}</td>
                                    <td>{member.bus_price}</td>
                                  </tr>
                                  )
                                })}
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-12">
                            <table className="table table-bordered mt-5">
                                <thead>
                                <tr align="center">
                                    <th>หัวหน้าหน่วย</th>
                                    <th>หัวหน้าส่วน</th>
                                    <th>ผู้จัดการฝ่าย</th>
                                    <th>ผู้จัดการอาวุโส</th>
                                  </tr>
                                  <tr align="center">
                                    <td>{ overtimes.create_name }</td>
                                    <td>{ overtimes.create_name }</td>
                                    <td>{ overtimes.department_name }</td>
                                    <td>{ overtimes.department_name }</td>
                                  </tr>
                                </thead>
                            </table>
                          </div>
                          <div className="col-md-12">
                            <div className="float-right">
                              <Link
                                to={"/overtime"}
                                className="btn btn-danger"
                              >
                                ย้อนกลับ
                              </Link>{" "}
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default view