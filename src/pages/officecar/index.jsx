import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import dayjs from "dayjs";

const view = () => {
  const { id } = useParams();

  const [overtimes, setOvertimes] = useState({});
  const [members, setMemebers] = useState([]);
  const [empcount, setEmpcount] = useState(0);
  const [startDate, setStartDate] = useState(new Date());

  const getData = async () => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequest/136" + id,
        {
          timeout: 5000,
        }
      )
      .then((res) => {
        setOvertimes(res.data.data);
        setMemebers(res.data.data.employees);
        setEmpcount(res.data.data.employees.length);
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
                <h1 className="m-0">รถรับส่งพนักงาน</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">รถรับส่งพนักงาน</li>
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
                          <div className="float-right">
                            <div className="formgroup">
                              <DatePicker
                                className="form-control"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="กรุณาเลือกวันที่"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 mt-5">
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
                                    <td className="text-success">
                                      {member.objective === null ? (
                                        <i className="fas fa-pencil-alt"></i>
                                      ) : (
                                        member.objective
                                      )}
                                    </td>
                                    <td>{overtimes.end_date}</td>
                                    <td className="text-success">
                                      {member.out_time === null ? (
                                        <i className="fas fa-pencil-alt"></i>
                                      ) : (
                                        member.out_time
                                      )}
                                    </td>
                                    <td>{overtimes.total_date}</td>
                                    <td>{member.bus_stations}</td>
                                    {/* <td>{member.bus_price}</td> */}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <div className="form-group float-right">
                            <button className="btn btn-primary">บันทึกข้อมูล</button>
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
