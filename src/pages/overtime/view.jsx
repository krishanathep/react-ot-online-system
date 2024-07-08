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
                <h1 className="m-0">Overtime view</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">View</li>
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
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <td>ผู้จัดการฝ่าย : { overtimes.department_name }</td>
                                <td>หน่วยงาน :  { overtimes.department }</td>
                                <td>เลขคำร้อง :  { overtimes.ot_member_id }</td>
                                <td>ผู้ควบคุมงาน : { overtimes.create_name }</td>
                              </tr>
                              <tr>
                                <td>วันที่เริ่มต้น : { dayjs(overtimes.start_date).format("DD-MMMM-YYYY") }</td>
                                <td>วันที่สิ้นสุด : { dayjs(overtimes.end_date).format("DD-MMMM-YYYY") }</td>
                                <td>เวลาที่เริ่มต้น : { dayjs(overtimes.start_date).format("hh:mm") }</td>
                                <td>เวลาที่สิ้นสุด : { dayjs(overtimes.end_date).format("hh:mm") }</td>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        <div className="col-md-12">
                          <table className="table table-bordered">
                            <thead>
                              <tr align={'center'}>
                                <th>#</th>
                                <th>ชื่อพนักงาน</th>
                                <th>ประเภทค่าแรง</th>
                                <th>ชนิดของงาน</th>
                                <th>ความสำเร็จ</th>
                                <th>รถรับส่ง</th>
                              </tr>
                            </thead>
                            <tbody>
                                {members.map((member, index)=>{
                                  return(
                                    <tr align='center' key={member.id}>
                                    <td>{index +1}</td>
                                    <td>{member.emp_name}</td>
                                    <td>{member.cost_type}</td>
                                    <td>{member.job_type}</td>
                                    <td>{member.objective}</td>
                                    <td>{member.bus_stations}</td>
                                  </tr>
                                  )
                                })}
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-12">
                            <table className="table table-bordered">
                                <thead>
                                  <tr align="center">
                                    <td>{ overtimes.create_name }</td>
                                    <td>{ overtimes.create_name }</td>
                                    <td>{ overtimes.create_name }</td>
                                    <td>{ overtimes.create_name }</td>
                                  </tr>
                                  <tr align="center">
                                    <td>หัวหน้าหน่วย</td>
                                    <td>หัวหน้าส่วน</td>
                                    <td>ผู้จัดการฝ่าย</td>
                                    <td>ผู้จัดการอาวุโส</td>
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