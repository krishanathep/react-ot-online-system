import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import axios from "axios";
import { em } from "@mantine/core";

const create = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      test: [
        {
          emp_name: "",
          cost_type: "",
          job_type: "",
          bus_stations: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });

  const [approver, setApprover] = useState([]);

  const userDatail = useAuthUser();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [code, setCode] = useState('')
  const [costType, setConstType] = useState('')

  const getEmployees = async () => {
    try {
      setLoading(true);
      await axios
        .get("http://localhost/laravel_auth_jwt_api/public/api/employees")
        .then((res) => {
          setEmployees(
            res.data.employees.map((employee) => ({
              value: employee.full_name,
              label: employee.full_name,
              code: employee.code,
              cost: employee.business_group,
            }))
          );
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Bug เมื่อเพิมฟังชั่นรหัสอัติโนมัติต้องกดยืนยันสองรอบ
  const handleCreateSubmit = async (data) => {
    const newData = JSON.parse(JSON.stringify(data)); // Create a deep copy

    newData.test = newData.test.map((item) => ({
      ...item,
      emp_name: item.emp_name.value,
    }));
    try {
      //alert(JSON.stringify(data))
      await axios
        .post(
          "http://localhost/laravel_auth_jwt_api/public/api/otrequest-create",
          newData
        )
        .then((res) => {
          console.log(res.data);
          Swal.fire({
            icon: "success",
            title: "Your OT request has been created",
            showConfirmButton: false,
            timer: 2000,
          });
          navigate("/overtime");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getApprover = async () => {
    await axios
      .get("http://localhost/laravel_auth_jwt_api/public/api/approver")
      .then((res) => {
        setApprover(res.data.approver);
      });
  };

  useEffect(() => {
    getEmployees();
    getApprover();
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">OT-REQUEST CREATE</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">HOME</a>
                  </li>
                  <li className="breadcrumb-item">OT-REQUEST</li>
                  <li className="breadcrumb-item active">CREATE</li>
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
                                    value={'OT2407093XXX'}
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
                                    <option value="">ผู้จัดการฝ่าย</option>
                                    {approver.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.name_approve_2}
                                      >
                                        {item.name_approve_2}
                                      </option>
                                    ))}
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
                                  <label htmlFor="">ผู้ควบคุมงาน</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    {...register("create_name", {
                                      required: true,
                                    })}
                                  >
                                    <option value="">ผู้ควบคุมงาน</option>
                                    {approver.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.name_approve_1}
                                      >
                                        {item.name_approve_1}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.create_name && (
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
                                    <option value="">กรุณาเลือกหน่วยงาน</option>
                                    {approver.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.division}
                                      >
                                        {item.division}
                                      </option>
                                    ))}
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
                                  <label htmlFor="">วันที่เริ่มต้น</label>
                                  <Controller
                                    control={control}
                                    name="start_date"
                                    render={({ field }) => (
                                      <DatePicker
                                        className="form-control"
                                        placeholderText="กรุณาเลือกวันที่เริ่มต้น"
                                        onChange={(date) =>
                                          field.onChange(
                                            dayjs(date).format(
                                              "YYYY-MM-DD hh:mm:ss"
                                            )
                                          )
                                        }
                                        dateFormat="dd-MMMM-yyyy hh:mm:ss"
                                        selected={field.value}
                                        timeInputLabel="Time:"
                                        showTimeInput
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
                                        placeholderText="กรุณาเลือกวันที่สิ้นสุด"
                                        onChange={(date) =>
                                          field.onChange(
                                            dayjs(date).format(
                                              "YYYY-MM-DD hh:mm:ss"
                                            )
                                          )
                                        }
                                        dateFormat="dd-MMMM-yyyy hh:mm:ss"
                                        selected={field.value}
                                        timeInputLabel="Time:"
                                        showTimeInput
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">ประเภทงาน</label>
                                  <select
                                      className="form-control"
                                      id="sel1"
                                      {...register("department", {
                                        required: true,
                                      })}
                                    >
                                      <option value="">กรุณาเลือกประเภทงาน</option>
                                      <option value={"ล่วงเวลาวันปกติ"}>
                                        ล่วงเวลาวันปกติ
                                      </option>
                                      <option value={"ทำงานวันหยุด"}>
                                        ทำงานวันหยุด
                                      </option>
                                      <option value={"ล่วงเวลาวันหยุด"}>
                                        ล่วงเวลาวันหยุด
                                      </option>
                                      <option value={"ทำงานวันหยุดประเพณี"}>
                                        ทำงานวันหยุดประเพณี
                                      </option>
                                      <option value={"ล่วงเวลาทำงานวันหยุดประเพณี"}>
                                        ล่วงเวลาทำงานวันหยุดประเพณี
                                      </option>
                                    </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {fields.map((item, index) => (
                          <div
                            className="card shadow-none border"
                            key={item.id}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-2">
                                 <div className="form-group">
                                 <label htmlFor="">รหัสพนักงาน :</label>
                                 <input type="text" 
                                 className="form-control"
                                 value={code}
                                 readOnly
                                 />
                                 </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="form-group">
                                    <label htmlFor="">
                                      ชื่อพนักงาน :
                                    </label>
                                    <Controller
                                      control={control}
                                      name={`test.${index}.emp_name`}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          options={employees}
                                          isClearable={true}
                                          isLoading={isLoading}
                                          placeholder="Please Select "
                                          onChange={(employees) => {
                                            field.onChange(employees);
                                            setCode(employees.code);
                                            setConstType(employees.cost)
                                          }}
                                        />
                                      )}
                                    />
                                    {errors.emp_name && (
                                      <span className="text-danger">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="form-group">
                                    <label htmlFor="">ประเภทค่าแรง :</label>
                                    <input
                                      className="form-control"
                                      id="sel1"
                                      value={costType}
                                      readOnly
                                      {...register(`test.${index}.cost_type`, {
                                        required: true,
                                      })}
                                    />
                                    {errors.cost_type && (
                                      <span className="text-danger">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="form-group">
                                    <label htmlFor="">ชนิดงานที่ทำ :</label>
                                    <select
                                      className="form-control"
                                      id="sel1"
                                      {...register(`test.${index}.job_type`, {
                                        required: true,
                                      })}
                                    >
                                      <option value="">กรุณาเลือกชนิดงานที่ทำ</option>
                                      <option value={"ชนิดงานที่ 1"}>
                                        ชนิดงานที่ 1
                                      </option>
                                      <option value={"ชนิดงานที่ 2"}>
                                        ชนิดงานที่ 2
                                      </option>
                                      <option value={"ชนิดงานที่ 3"}>
                                        ชนิดงานที่ 3
                                      </option>
                                      <option value={"ชนิดงานที่ 4"}>
                                        ชนิดงานที่ 4
                                      </option>
                                      <option value={"ชนิดงานที่ 5"}>
                                        ชนิดงานที่ 5
                                      </option>
                                    </select>
                                    {errors.job_type && (
                                      <span className="text-danger">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="form-group">
                                    <label htmlFor="">เป้าหมาย :</label>
                                    <input type="text" className="form-control" 
                                    placeholder="กรุณากรอกเป้าหมาย"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="form-group">
                                    <label htmlFor="">จุดลงรถรับส่ง :</label>
                                    <select
                                      className="form-control"
                                      id="sel1"
                                      {...register(
                                        `test.${index}.bus_stations`,
                                        {
                                          required: true,
                                        }
                                      )}
                                    >
                                      <option value="">กรุณาเลืกจุดลงรถรับส่ง</option>
                                      <option value={"จุดที่ 1"}>
                                        จุดที่ 1
                                      </option>
                                      <option value={"จุดที่ 2"}>
                                        จุดที่ 2
                                      </option>
                                      <option value={"จุดที่ 3"}>
                                        จุดที่ 3
                                      </option>
                                      <option value={"จุดที่ 4"}>
                                        จุดที่ 4
                                      </option>
                                      <option value={"ไม่ระส่ง"}>
                                        ไม่ระบุ
                                      </option>
                                    </select>
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
                                        bus_stations: "",
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
                            {/* <button 
                             onClick={handleRegenerate}
                             className="btn btn-secondary"
                            >สร้างรหัส</button>{' '} */}
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
