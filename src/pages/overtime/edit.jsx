import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
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
          id: "",
          emp_name: "",
          cost_type: "",
          job_type: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "test",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const [approver, setApprover] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(false);

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
            }))
          );
          console.log(employees)
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (data) => {

    const newData = JSON.parse(JSON.stringify(data)); // Create a deep copy

    newData.test = newData.test.map(item => ({
      ...item,
      emp_name: item.emp_name.value
    }));

    await axios
      .put(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequest-update/" +
          id,
        newData
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Your OT request has been updated",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/overtime");
        //console.log(res.data);
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
          test: res.data.data.employees.map((employee) => ({
            id: employee.id,
            emp_name: employee.emp_name,
            cost_type: employee.cost_type,
            job_type: employee.job_type,
            bus_stations: employee.bus_stations,
          })),
        });
      });
  };

  const getApprover = async () => {
    await axios
      .get("http://localhost/laravel_auth_jwt_api/public/api/approver")
      .then((res) => {
        console.log(res.data.approver);
        setApprover(res.data.approver);
      });
  };

  useEffect(() => {
    getData();
    getEmployees();
    getApprover()
  }, [reset]);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">OT-REQUEST EDIT</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">HOME</a>
                  </li>
                  <li className="breadcrumb-item">OT-REQUEST</li>
                  <li className="breadcrumb-item active">EDIT</li>
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
                                     {approver.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.name_approve_1}
                                      >
                                        {item.name_approve_1}
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
                                  <label htmlFor="">หน่วยงาน</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    {...register("department", {
                                      required: true,
                                    })}
                                  >
                                     {approver.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.division}
                                      >
                                        {item.division}
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
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <label htmlFor="">
                                        ข้อมูลพนักงาน {index + 1} :
                                      </label>
                                      <input 
                                        readOnly
                                        className="form-control" 
                                        type="text" 
                                        {...register(
                                          `test.${index}.emp_name`,
                                          {}
                                        )}
                                      />
                                      {/* ยังดึงข้อมูลที่ต้องการแก้ไขไม่ได้ 08/07/24 */}
                                      {/* <Controller
                                      control={control}
                                      name={`test.${index}.emp_name`}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          options={employees}
                                          isClearable={true}
                                          isLoading={isLoading}
                                          placeholder="Please Select "
                                        />
                                      )}
                                    /> */}
                                      <input
                                        type="text"
                                        value={item.id}
                                        hidden
                                      />
                                      {errors.emp_name && (
                                        <span className="text-danger">
                                          This field is required
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                  <div className="form-group">
                                    <label htmlFor="">ประเภทค่าแรง :</label>
                                    <select
                                      className="form-control"
                                      id="sel1"
                                      {...register(`test.${index}.cost_type`, {
                                        required: true,
                                      })}
                                    >
                                      <option value="">Please Select</option>
                                      <option value={"ประเภทค่าแรง D"}>
                                        ประเภทค่าแรง D
                                      </option>
                                      <option value={"ประเภทค่าแรง I"}>
                                        ประเภทค่าแรง I
                                      </option>
                                    </select>
                                    {errors.cost_type && (
                                      <span className="text-danger">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="form-group">
                                    <label htmlFor="">ชนิดงานที่ทำ :</label>
                                    <select
                                      className="form-control"
                                      id="sel1"
                                      {...register(`test.${index}.job_type`, {
                                        required: true,
                                      })}
                                    >
                                      <option value="">Please Select</option>
                                      <option value={"ล่วงเวลาปกติ"}>
                                        ล่วงเวลาปกติ
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
                                      <option value={"ล่วงเวลาวันหยุดประเพณี"}>
                                        ล่วงเวลาวันหยุดประเพณี
                                      </option>
                                    </select>
                                    {errors.job_type && (
                                      <span className="text-danger">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-3">
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
                                      <option value="">Please Select</option>
                                      <option value={"จุดลงรถรับส่งที่ 1"}>
                                        จุดลงรถรับส่งที่ 1
                                      </option>
                                      <option value={"จุดลงรถรับส่งที่ 2"}>
                                        จุดลงรถรับส่งที่ 2
                                      </option>
                                      <option value={"จุดลงรถรับส่งที่ 3"}>
                                        จุดลงรถรับส่งที่ 3
                                      </option>
                                      <option value={"จุดลงรถรับส่งที่ 4"}>
                                        จุดลงรถรับส่งที่ 4
                                      </option>
                                      <option value={"ไม่ระบุจุดรถรับส่ง"}>
                                        ไม่ระบุจุดรถรับส่ง
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
