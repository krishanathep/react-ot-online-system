import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const EmployeeEdit = () => {
  const { id } = useParams();

  const [overtimes, setOvertimes] = useState({});

  const getData = async () => {
    await axios
      .get("http://localhost/laravel_auth_jwt_api/public/api/otrequest/" + id, {
        timeout: 5000,
      })
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
                <h1 className="m-0">แก้ไขข้อมูลพนักงาน</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">พนักงานทั้งหมด</li>
                  <li className="breadcrumb-item active">แก้ไขข้อมูลพนักงาน</li>
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
                    <div className="col-md-12 mt-3">
                        ...
                      <div className="float-right">
                        <Link to={"/employees"} className="btn btn-danger">
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
    </>
  );
};

export default EmployeeEdit;
