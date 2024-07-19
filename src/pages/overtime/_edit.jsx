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

  const [time, setTime] = useState('')
  const [timeList, setTimeLlist] = useState([]);
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
        reset({
          department_name: res.data.data.department_name,
          department: res.data.data.department,
          ot_member_id: res.data.data.ot_member_id,
          create_name: res.data.data.create_name,
          ot_date: res.data.data.ot_date,
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

  //filter function by ot list
  const listFilter = async (key) => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-filter-list?data=" +
          key
      )
      .then((res) => {
        setTimeLlist(res.data.time);
      });
  };

  //filter function by ot time finish
  const finishFilter = async (key) => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-filter-finish?data=" +
          key
      )
      .then((res) => {
        setTime(res.data.time.ot_total);
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
                <h1 className="m-0">คำร้องขออนุมัติ OT / รายงานผล</h1>
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
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">เลขที่ใบคำร้อง</label>
                                  <input
                                    //readOnly
                                    type="text"
                                    className="form-control"
                                    {...register("ot_member_id", {
                                      required: true,
                                    })}
                                  />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">ผู้จัดการฝ่าย</label>
                                  <input
                                    className="form-control"
                                    id="sel1"
                                    {...register("department_name", {
                                      required: true,
                                    })}
                                  />
                                  {errors.department_name && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">ผู้ควบคุมงาน</label>
                                  <input
                                    className="form-control"
                                    id="sel1"
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
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">หน่วยงาน</label>
                                  <input
                                    className="form-control"
                                    id="sel1"
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
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">วันที่เริ่มต้น</label>
                                  <Controller 
                                    control={control}
                                    name="ot_date"
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
                                  <label htmlFor="">ประเภทงาน</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    {...register("work_type", {
                                      required: true,
                                    })}
                                  >
                                    <option value="">
                                      กรุณาเลือกประเภทงาน
                                    </option>
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
                                    <option
                                      value={"ล่วงเวลาทำงานวันหยุดประเพณี"}
                                    >
                                      ล่วงเวลาทำงานวันหยุดประเพณี
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">ประเภท OT</label>
                                  <select
                                    {...register("ot_type", {
                                      required: true,
                                    })}
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                      listFilter(event.target.value)
                                    }
                                  >
                                    <option value="">
                                      กรุณาเลือกประเภทโอที
                                    </option>
                                    <option value="OT หลังเลิกงาน-ไม่พัก">
                                      OT หลังเลิกงาน-ไม่พัก
                                    </option>
                                    <option value="OT หลังเลิกงาน-พัก 20 นาที">
                                      OT หลังเลิกงาน-พัก 20 นาที
                                    </option>
                                    <option value="OT ก่อนเข้างาน">
                                      OT ก่อนเข้างาน
                                    </option>
                                    <option value="OT ช่วงพักเที่ยง">
                                      OT ช่วงพักเที่ยง
                                    </option>
                                    <option value="OT วันหยุด ทำเต็มวัน">
                                      OT วันหยุด ทำเต็มวัน
                                    </option>
                                    <option value="OT หลังเลิกงาน-ไม่พัก">
                                      OT วันหยุด หลังเลิกงาน-ไม่พัก
                                    </option>
                                    <option value="OT หลังเลิกงาน-พัก 20 นาที">
                                      OT วันหยุด หลังเลิกงาน-พัก 20 นาที
                                    </option>
                                  </select>
                                  {errors.ot_type && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">เวลาที่เริ่มต้น</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    {...register("start_date", {
                                      required: true,
                                    })}
                                  >
                                    <option value="">
                                      กรุณาเลือกเวลาเริ่มต้น
                                    </option>
                                    {timeList.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.ot_start}
                                      >
                                        {item.ot_start}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.start_date && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">เวลาที่สิ้นสุด</label>
                                  <select
                                    {...register("end_date", {
                                      required: true,
                                    })}
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                      finishFilter(event.target.value)
                                    }
                                  >
                                    <option value="">
                                      กรุณาเลือกเวลาสิ้นสุด
                                    </option>
                                    {timeList.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.ot_finish}
                                      >
                                        {item.ot_finish}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">จำนวนชั่วโมง</label>
                                  <input
                                    className="form-control"
                                    {...register("total_date", {
                                      required: true,
                                    })}
                                    type="text"
                                    value={time}
                                  />
                                  {errors.total_date && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
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
                                <div className="col-md-2">
                                  <div className="form-group">
                                    <label htmlFor="">รหัสพนักงาน :</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      //value={code}
                                      //readOnly
                                      {...register(`test.${index}.code`, {
                                        required: true,
                                      })}
                                    />
                                    {errors.code && (
                                      <span className="text-danger">
                                        This field is required
                                      </span>
                                    )}
                                  </div>
                                </div>
                                  <div className="col-md-2">
                                    <div className="form-group">
                                      <label htmlFor="">
                                        ข้อมูลพนักงาน {index + 1} :
                                      </label>
                                      <input 
                                        //readOnly
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
                                  <div className="col-md-2">
                                  <div className="form-group">
                                    <label htmlFor="">ประเภทค่าแรง :</label>
                                    <input
                                      className="form-control"
                                      id="sel1"
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
                                    <input
                                      className="form-control"
                                      id="sel1"
                                      {...register(`test.${index}.job_type`, {
                                        required: true,
                                      })}
                                    />
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
                                    <input
                                      {...register(`test.${index}.target`, {
                                        required: true,
                                      })}
                                      type="text"
                                      className="form-control"
                                      placeholder="กรุณากรอกเป้าหมาย"
                                    />
                                    {errors.target && (
                                      <span className="text-danger">
                                        This field is required
                                      </span>
                                    )}
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
                                      <option value="">
                                        กรุณาเลืกจุดลงรถรับส่ง
                                      </option>
                                      <option value={"จุดที่ 1"}>
                                        จุดที่ 1 สายศาลายา
                                      </option>
                                      <option value={"จุดที่ 2"}>
                                        จุดที่ 2 สายนครชัยศรี
                                      </option>
                                      <option value={"จุดที่ 3"}>
                                        จุดที่ 3 สายหนองแขม
                                      </option>
                                      <option value={"จุดที่ 4"}>
                                        จุดที่ 4 สายวงเวียนใหญ่
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
