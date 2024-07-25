import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const view = () => {

  const { id } = useParams();

  const [overtimes, setOvertimes] = useState({});
  const [members, setMemebers] = useState([]);

  //stepper complete state
  const [complete_1, setComplete_1] = useState(false)
  const [complete_2, setComplete_2] = useState(false)
  const [complete_3, setComplete_3] = useState(false)
  const [complete_4, setComplete_4] = useState(false)

  const getData = async () => {
    await axios
      .get("http://localhost/laravel_auth_jwt_api/public/api/otrequest/" + id, {
        timeout: 5000,
      })
      .then((res) => {
        setOvertimes(res.data.data);
        setMemebers(res.data.data.employees);
        //console.log(res.data.data.status);
        //stepper complete
        if(res.data.data.status==='approver_1'){
          setComplete_1(true)
        } if(res.data.data.status==='approver_2'){
          setComplete_1(true),setComplete_2(true)
        } if(res.data.data.status==='approver_3'){
          setComplete_1(true),setComplete_2(true),setComplete_3(true)
        } if(res.data.data.status==='approver_4'){
          setComplete_1(true),setComplete_2(true),setComplete_3(true),setComplete_4(true)
        }
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
                <h1 className="m-0">ข้อมูลคำร้องขออนุมัติ OT</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">คำร้องขออนุมัติ OT</li>
                  <li className="breadcrumb-item active">
                    ข้อมูลคำร้องขออนุมัติ OT
                  </li>
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
                          <table className="table table-borderless mt-3">
                            <thead>
                              <tr>
                                <td>
                                  <b>เลขที่คำร้อง</b> : {overtimes.ot_member_id}
                                </td>
                                <td>
                                  <b>ผู้จัดการฝ่าย</b> :{" "}
                                  {overtimes.department_name}
                                </td>
                                <td>
                                  <b>ผู้ควบคุมงาน</b> : {overtimes.create_name}
                                </td>
                                <td>
                                  <b>หน่วยงาน</b> : {overtimes.department}
                                </td>
                                <td>
                                  <b>ประเภทงาน</b> : {overtimes.work_type}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>วันที่ทำงาน</b> :{" "}
                                  {dayjs(overtimes.ot_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td>
                                  <b>เวลาเริ่มต้น</b> : {overtimes.start_date}{" "}
                                  น.
                                </td>
                                <td>
                                  <b>เวลาสิ้นสุด</b> : {overtimes.end_date} น.
                                </td>
                                <td>
                                  <b>เวลาทั้งหมด</b> : {overtimes.total_date}
                                </td>
                                <td>
                                  <b>จำนวนพนักงาน</b> : 1 คน
                                </td>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        <div className="col-md-12">
                          <table className="table table-bordered mt-3">
                            <thead>
                              <tr align={"center"}>
                                <th>#</th>
                                <th>รหัส</th>
                                <th>ชื่อพนักงาน</th>
                                <th>ประเภทค่าแรง</th>
                                <th>ชนิดของงาน</th>
                                <th>เป้าหมาย</th>
                                <th>ทำได้จริง</th>
                                <th>ข้อมูลแสกน</th>
                                <th>เวลาเลิกงาน</th>
                                <th>รวมเวลา</th>
                                <th>รถรับส่ง</th>
                                {/* <th>ค่ารถ</th> */}
                                <th>หมายเหตุ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {members.map((member, index) => {
                                return (
                                  <tr align="center" key={member.id}>
                                    <td>{index + 1}</td>
                                    <td>{member.code}</td>
                                    <td>{member.emp_name}</td>
                                    <td>{member.cost_type}</td>
                                    <td>{member.job_type}</td>
                                    <td>{member.target}</td>
                                    <td className="text-muted">
                                      {member.objective === null ? (
                                        <i className="fas fa-edit"></i>
                                      ) : (
                                        member.objective
                                      )}
                                    </td>
                                    <td>{overtimes.end_date}</td>
                                    <td className="text-muted">
                                      {member.out_time === null ? (
                                        <i className="fas fa-edit"></i>
                                      ) : (
                                        member.out_time
                                      )}
                                    </td>
                                    <td>{overtimes.total_date}</td>
                                    <td>{member.bus_stations}</td>
                                    {/* <td>{member.bus_price}</td> */}
                                    <td className="text-muted">
                                      {member.remark === null ? (
                                        <i className="fas fa-edit"></i>
                                      ) : (
                                        member.remark
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-12">
                          <table className="table table-borderless mt-5">
                            <thead>
                              <tr align="center">
                                <td>
                                  <b>หัวหน้าหน่วย</b> : {overtimes.name_app_1}
                                </td>
                                <td>
                                  <b>หัวหน้าส่วน</b> : {overtimes.name_app_1}
                                </td>
                                <td>
                                  <b>ผู้จัดการฝ่าย</b> : {overtimes.name_app_3}
                                </td>
                                <td>
                                  <b>ผู้จัดการอาวุโส</b> :{" "}
                                  {overtimes.name_app_4}
                                </td>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        {/* Stepper Function */}
                        <div className="col-md-12">
                            <div className="stepper-wrapper">
                            <div className={`stepper-item ${(!complete_1)?(null):('completed')}`}>
                              <div className="step-counter text-white">1</div>
                              <div className="step-name">First</div>
                            </div>
                            <div className={`stepper-item ${(!complete_2)?(null):('completed')}`}>
                              <div className="step-counter text-white">2</div>
                              <div className="step-name">Second</div>
                            </div>
                            <div className={`stepper-item ${(!complete_3)?(null):('completed')}`}>
                              <div className="step-counter text-white">3</div>
                              <div className="step-name">Third</div>
                            </div>
                            <div className={`stepper-item ${(!complete_4)?(null):('completed')}`}>
                              <div className="step-counter text-white">4</div>
                              <div className="step-name">Forth</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 mt-3">
                          <div className="float-right">
                            <Link to={"/overtime"} className="btn btn-danger">
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
  );
};

export default view;
