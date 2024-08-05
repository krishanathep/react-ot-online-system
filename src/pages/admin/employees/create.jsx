import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import dayjs from "dayjs";

const EmployeeEdit = () => {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const [overtimes, setOvertimes] = useState({});

  const handleCreateSubmit = async () => {
    ///
  }

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
                <h1 className="m-0">เพิ่มข้อมูลพนักงาน</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">พนักงานทั้งหมด</li>
                  <li className="breadcrumb-item active">เพิ่มข้อมูลพนักงาน</li>
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
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">รหัสพนักงาน :</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="กรุณาเพิ่มข้อมูล"
                          {...register("emp_id", {
                            required: true,
                          })}
                        />
                        {errors.emp_id && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">ชื่อพนักงาน :</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="กรุณาเพิ่มข้อมูล"
                          {...register("emp_name", {
                            required: true,
                          })}
                        />
                        {errors.emp_name && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">กลุ่มงาน :</label>
                        <select
                          type="text"
                          className="form-control"
                          {...register("business_group", {
                            required: true,
                          })}
                        >
                        <option value={''}>กรุณาเลือกข้อมูล</option>
                        </select>
                        {errors.business_group && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">ตำแหน่ง :</label>
                        <select
                          type="text"
                          className="form-control"
                          {...register("position", {
                            required: true,
                          })}
                        >
                          <option value={''}>กรุณาเลือกข้อมูล</option>
                          </select>
                        {errors.position && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">ส่วนงาน :</label>
                        <select
                          type="text"
                          className="form-control"
                          {...register("agency", {
                            required: true,
                          })}
                        >
                        <option value={''}>กรุณาเลือกข้อมูล</option>
                        </select>
                        {errors.agency && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">ฝ่ายงาน :</label>
                        <select
                          type="text"
                          className="form-control"
                          {...register("department", {
                            required: true,
                          })}
                        >
                        <option value={''}>กรุณาเลือกข้อมูล</option>
                        </select>
                        {errors.department && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">แผนก :</label>
                        <select
                          type="text"
                          className="form-control"
                          {...register("dept", {
                            required: true,
                          })}
                        >
                        <option value={''}>กรุณาเลือกข้อมูล</option>
                        </select>
                        {errors.dept && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">บริษัท :</label>
                        <select
                          type="text"
                          className="form-control"
                          {...register("company", {
                            required: true,
                          })}
                        >
                        <option value={''}>กรุณาเลือกข้อมูล</option>
                        </select>
                        {errors.company && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="float-right">
                        <button className="btn btn-primary" onClick={handleSubmit(handleCreateSubmit)}>SUBMIT</button>{' '}
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
