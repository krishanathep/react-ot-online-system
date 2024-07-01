import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      test: [
        {
          id:"",
          emp_name: "",
          cost_type: "",
          job_type: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const handleUpdateSubmit = async (data) => {
    await axios
      .put(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequest-update/" +
          id,
        data
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Your OT request has been updated",
          showConfirmButton: false,
          timer: 2000,
        });
        //navigate("/overtime");
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getData = async () => {
    await axios
      .get("http://localhost/laravel_auth_jwt_api/public/api/otrequest/" + id)
      .then((res) => {
        console.log(res.data.data.employees);
        reset({
          department_name: res.data.data.department_name,
          department: res.data.data.department,
          ot_member_id: res.data.data.ot_member_id,
          create_name: res.data.data.create_name,
          start_date: res.data.data.start_date,
          end_date: res.data.data.end_date,
          test: res.data.data.employees.map(employee => ({
            id: employee.id,
            emp_name: employee.emp_name,
            cost_type: employee.cost_type,
            job_type: employee.job_type,
          }))  
        });
      });
  };

  useEffect(() => {
    getData();
  }, [reset]);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Overtime edit</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Edit</li>
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
                                    <option value="">
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
                                    <option value="">
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
                        <form>
                          {fields.map((item, index) => (
                            <div
                              className="card shadow-none border"
                              key={item.id}
                            >
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label htmlFor="">
                                        ข้อมูลพนักงาน {index + 1} :
                                      </label>
                                      <select
                                        className="form-control"
                                        id="sel1"
                                        control={control}
                                        {...register(`test.${index}.emp_name`, {
                                        })}
                                      >
                                        <option value="">
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
                                      <input type="text" value={item.id} hidden />
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
                                        control={control}
                                        {...register(
                                          `test.${index}.cost_type`,
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
                                        control={control}
                                        {...register(`test.${index}.job_type`, {
                                        })}
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
                                {/* <div className="col-md-12">
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
                                </div> */}
                              </div>
                            </div>
                          ))}
                          <div className="col-md-12">
                            <div className="float-right">
                              <button
                                onClick={handleSubmit(handleUpdateSubmit)}
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
