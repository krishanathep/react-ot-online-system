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

const create = () => {
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
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
          // emp_name: "",
          // cost_type: "",
          // job_type: "",
          // bus_stations: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });

  const [startDate, setStartDate] = useState('')

  const [approver, setApprover] = useState([]);
  const userDetail = useAuthUser();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [costType, setConstType] = useState("");

  const [time, setTime] = useState("");
  const [timeList, setTimeList] = useState([]);

  const [employeesByrole, setEmployeesByrole] = useState([]);

  const getEmployeesByrole = async () => {
    try {
      await axios
        .get(
          "http://localhost/laravel_auth_jwt_api/public/api/employees-role?data=" +
            userDetail().dept
        )
        .then((res) => {
          setEmployeesByrole(
            res.data.employees.map((employee) => ({
              value: employee.full_name,
              label: employee.full_name,
              code: employee.code,
              cost: employee.cost,
            }))
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Transform API data to match react-select format
  const formattedOptions = employees.map(item => ({
    value: item.id,
    label: item.emp_name
  }));
  
  setOptions(formattedOptions);

  const getEmployees = async () => {
    try {
      setLoading(true);
      await axios
        .get("http://localhost/laravel_auth_jwt_api/public/api/employees")
        .then((res) => {
          setEmployees(res.data.employees);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //filter function by ot list
  const listFilter = async (key) => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-filter-list?data=" +
          key
      )
      .then((res) => {
        setTimeList(res.data.time);
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

  const handleCreateSubmit = async (data) => {
    const newData = JSON.parse(JSON.stringify(data))

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

  //fetch approver by login role
  const getApprover = async () => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/approver-role?data=" +
          userDetail().dept
      )
      .then((res) => {
        setApprover(res.data.approver);
      });
  };

  //filter function by ot list
  const deptFilter = async () => {
    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/approve-dept?data=" +
          userDetail().dept
      )
      .then((res) => {
        reset({
          create_name: res.data.approver.app_name_1,
          department_name: res.data.approver.app_name_2,
          department: res.data.approver.agency,
        });
      });
  };

  useEffect(() => {
    getEmployees();
    getApprover();
    deptFilter();
    getEmployeesByrole();
  }, [time,code,costType]);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">เพิ่มคำร้องขออนุมัติ OT</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">คำร้องขออนุมัติ OT</li>
                  <li className="breadcrumb-item active">เพิ่มคำร้องขออนุมัติ</li>
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
                                    value={"OT2407093XXX"}
                                    className="form-control"
                                    {...register("ot_member_id", {
                                      required: true,
                                    })}
                                  />
                                  {errors.ot_member_id && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">ผู้จัดการฝ่าย</label>
                                  <input
                                    className="form-control"
                                    id="sel1"
                                    //readOnly
                                    //value={}
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
                                    value={approver.division}
                                    //readOnly
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
                                  rules={{ required: true }}
                                    control={control}
                                    name="ot_date"
                                    render={({ field }) => (
                                      <DatePicker
                                        className="form-control"
                                        placeholderText="กรุณาเลือกวันที่เริ่มต้น"
                                        onChange={(date) =>
                                          field.onChange(
                                            dayjs(date).format("YYYY-MM-DD")
                                          )
                                        }
                                        dateFormat="dd-MM-yyyy"
                                        selected={field.value}
                                      />
                                    )}
                                  /><br/>
                                  {errors.ot_date && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
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
                                  {errors.work_type && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
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
                                    <label htmlFor="">ชื่อพนักงาน :</label>
                                    <Select options={formattedOptions} 
                                  
                                    />
                                    {/* <Controller
                                      rules={{ required: true }}
                                      control={control}
                                      name={`test.${index}.emp_name`}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          options={employeesByrole}
                                          isClearable={true}
                                          isLoading={isLoading}
                                          placeholder="Please Select "
                                          onChange={(employeesByrole) => {
                                            field.onChange(employeesByrole);
                                            setCode(employeesByrole.code);
                                            setConstType(employeesByrole.cost);
                                          }}
                                        />
                                      )}
                                    /> */}
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="form-group">
                                    <label htmlFor="">ประเภทค่าแรง :</label>
                                    <input
                                      className="form-control"
                                      id="sel1"
                                      //value={costType}
                                      //readOnly
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
                                      placeholder="กรุณากรอกชนิดงานที่ทำ"
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
                                    {errors.bus_stations && (
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
                              <i className="fas fa-save"></i> ยืนยัน
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
