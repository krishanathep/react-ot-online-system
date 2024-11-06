import React, { useEffect, useState } from "react";
import { Link, useNavigate,useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";

const EmployeeUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const getData = async () => {
    try {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/employees/" + id)
        .then((res) => {
            console.log(res)
          reset({
            emp_id: res.data.employee.emp_id,
            emp_name: res.data.employee.emp_name,
            //start_date: res.data.employee.start_date,
            work_exp: res.data.employee.work_exp,
            bus_group: res.data.employee.bus_group,
            position: res.data.employee.position,
            agency: res.data.employee.agency,
            department: res.data.employee.department,
            dept: res.data.employee.dept,
            //company: res.data.employee.company,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateSubmit = async (data) => {
    try {
      await axios
        .put(import.meta.env.VITE_API_KEY + "/api/employees-update/"+id, data)
        .then((res) => {
          console.log(res.employees);
          Swal.fire({
            icon: "success",
            title: "Your employees has been updated",
            showConfirmButton: false,
            timer: 2000,
          });
          navigate("/admin/employees");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  },[]);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">แก้ไขรายชื่อพนักงาน</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">พนักงานทั้งหมด</li>
                  <li className="breadcrumb-item active">
                    แก้ไขรายชื่อพนักงาน
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
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">รหัสพนักงาน</label>
                        <input
                          className="form-control"
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
                        <label htmlFor="">ชื่อพนักงาน</label>
                        <input
                          className="form-control"
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
                    {/* <div className="col-md-2">
                      <div className="form-group">
                        <label htmlFor="">วันที่เริ่มงาน</label>
                        <Controller
                          control={control}
                          name="start_date"
                          render={({ field }) => (
                            <DatePicker
                              required
                              className="form-control"
                              placeholderText="กรุณาเลือกวันที่"
                              onChange={(date) =>
                                field.onChange(dayjs(date).format("YYYY-MM-DD"))
                              }
                              dateFormat="DD-MM-yyyy"
                              selected={field.value}
                            />
                          )}
                        />
                        {errors.start_date && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div> */}
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">อายุงาน</label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("work_exp", {
                            required: true,
                          })}
                        />
                        {errors.work_exp && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">กลุ่มงาน</label>
                        <input
                          className="form-control"
                          {...register("bus_group", {
                            required: true,
                          })}
                        />
                        {errors.bus_group && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">ตำแหน่ง</label>
                        <input
                          className="form-control"
                          {...register("position", {
                            required: true,
                          })}
                        />
                        {errors.position && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">หน่วยงาน</label>
                        <input
                          className="form-control"
                          {...register("agency", {
                            required: true,
                          })}
                        />
                        {errors.agency && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">ส่วนงาน</label>
                        <input
                          className="form-control"
                          {...register("department", {
                            required: true,
                          })}
                        />
                        {errors.department && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="">หน่วยงานย่อ</label>
                        <input
                          className="form-control"
                          {...register("dept", {
                            required: true,
                          })}
                        />
                        {errors.dept && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                      <div className="float-right">
                        <button
                          type="submit"
                          onClick={handleSubmit(handleUpdateSubmit)}
                          className="btn btn-primary mr-1"
                        >
                          Submit
                        </button>
                        <Link
                          className="btn btn-danger"
                          to={"/admin/employees"}
                        >
                          Canccel
                        </Link>
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

export default EmployeeUpdate;
