import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import axios from "axios";

const create = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setError,
    formState: { errors },
  } = useForm({
    // defaultValues: {}; you can populate the fields by this attribute
    defaultValues: {
      test: [
        {
          firstName: "",
          lastName: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });

  const userDatail = useAuthUser();
  const navigate = useNavigate();

  const handleCreateSubmit = async (data) => {
    await axios
      .post(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequest-create",
        data
      )
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          icon: "success",
          title: "Your OT request has been created",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate('/overtime')
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Overtime create</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Create</li>
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
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">เลขที่ใบคำร้อง</label>
                                  <input
                                    readOnly
                                    type="text"
                                    className="form-control"
                                    value={"OT012324QC"}
                                    {...register("ot_member_id", {
                                      required: true,
                                    })}
                                  />
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">ผู้จัดการฝ่าย</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    {...register("department_name", {
                                      required: true,
                                    })}
                                  >
                                    <option value="" disabled selected>
                                      Please Select
                                    </option>
                                    <option value={"ผู้จัดการฝ่าย 1"}>
                                      ผู้จัดการฝ่าย 1
                                    </option>
                                    <option value={"ผู้จัดการฝ่าย 2"}>
                                      ผู้จัดการฝ่าย 2
                                    </option>
                                    <option value={"ผู้จัดการฝ่าย 3"}>
                                      ผู้จัดการฝ่าย 3
                                    </option>
                                    <option value={"ผู้จัดการฝ่าย 4"}>
                                      ผู้จัดการฝ่าย 4
                                    </option>
                                  </select>
                                  {errors.department_name && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">หน่วยงาน</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    {...register("department", {
                                      required: true,
                                    })}
                                  >
                                    <option value="" disabled selected>
                                      Please Select
                                    </option>
                                    <option value={"หน่วยงาน 1"}>
                                      หน่วยงาน 1
                                    </option>
                                    <option value={"หน่วยงาน 2"}>
                                      หน่วยงาน 2
                                    </option>
                                    <option value={"หน่วยงาน 3"}>
                                      หน่วยงาน 3
                                    </option>
                                    <option value={"หน่วยงาน 4"}>
                                      หน่วยงาน 4
                                    </option>
                                  </select>
                                  {errors.department && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">ผู้ควบคุมงาน</label>
                                  <input
                                    readOnly
                                    type="text"
                                    className="form-control"
                                    value={userDatail().name}
                                    {...register("create_name", {
                                      required: true,
                                    })}
                                  />
                                  {errors.create_name && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">วันที่เริ่มต้น</label>
                                  <Controller
                                    control={control}
                                    name="start_date"
                                    render={({ field }) => (
                                      <DatePicker
                                        className="form-control"
                                        placeholderText="Select start date"
                                        onChange={(date) =>
                                          field.onChange(
                                            dayjs(date).format("YYYY/MM/DD")
                                          )
                                        }
                                        selected={field.value}
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">วันที่สิ้นสุด</label>
                                  <Controller
                                    control={control}
                                    name="end_date"
                                    render={({ field }) => (
                                      <DatePicker
                                        className="form-control"
                                        placeholderText="Select end date"
                                        onChange={(date) =>
                                          field.onChange(
                                            dayjs(date).format("YYYY/MM/DD")
                                          )
                                        }
                                        selected={field.value}
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <form
                        // onSubmit={handleSubmit((data) =>
                        //   alert(JSON.stringify(data))
                        // )}
                        >
                          {fields.map((item, index) => (
                            <div
                              className="card shadow-none border"
                              key={item.index}
                            >
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label htmlFor="">ข้อมูลพนักงาน :</label>
                                      <select
                                        className="form-control"
                                        id="sel1"
                                        {...register(
                                          `employee.${index}.emp_name`,
                                          { required: true }
                                        )}
                                      >
                                        <option value="" disabled selected>
                                          Please Select
                                        </option>
                                        <option value={"ข้อมูลพนักงาน 1"}>
                                          ข้อมูลพนักงาน 1
                                        </option>
                                        <option value={"ข้อมูลพนักงาน 2"}>
                                          ข้อมูลพนักงาน 2
                                        </option>
                                        <option value={"ข้อมูลพนักงาน 3"}>
                                          ข้อมูลพนักงาน 3
                                        </option>
                                        <option value={"ข้อมูลพนักงาน 4"}>
                                          ข้อมูลพนักงาน 4
                                        </option>
                                      </select>
                                      {errors.emp_name && (
                                        <span className="text-danger">
                                          This field is required
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label htmlFor="">ประเภทค่าแรง :</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        {...register(
                                          `employee.${index}.cost_type`,
                                          { required: true }
                                        )}
                                        placeholder="Please Enter Cost Type"
                                      />
                                      {errors.cost_type && (
                                        <span className="text-danger">
                                          This field is required
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label htmlFor="">ประเภทงาน :</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        {...register(
                                          `employee.${index}.job_type`,
                                          { required: true }
                                        )}
                                        placeholder="Please Enter Job Type"
                                      />
                                      {errors.job_type && (
                                        <span className="text-danger">
                                          This field is required
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="float-right">
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      type="button"
                                      onClick={() =>
                                        append({
                                          emp_name: "",
                                          cost_type: "",
                                          job_type: "",
                                        })
                                      }
                                    >
                                      <i className="fas fa-plus"></i>
                                    </button>{" "}
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      type="button"
                                      onClick={() => remove(index)}
                                    >
                                      <i className="fas fa-minus"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="col-md-12">
                            <div className="float-right">
                              <button
                                onClick={handleSubmit(handleCreateSubmit)}
                                className="btn btn-primary"
                              >
                                ยืนยัน
                              </button>{" "}
                              <Link to={"/overtime"} className="btn btn-danger">
                                ย้อนกลับ
                              </Link>
                            </div>
                          </div>
                        </form>
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

export default create;
