import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import axios from "axios";

const create = ({ prefix = "OT" }) => {
  const [id, setId] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const { fields, append } = useFieldArray({
    control,
    name: "test",
    // rules: {
    //   required: "Some fields is required",
    // },
  });

  const [nullTable, setNullTable] = useState(true);

  const [approver, setApprover] = useState([]);
  const userDetail = useAuthUser();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [time, setTime] = useState("");
  const [timeList, setTimeList] = useState([]);
  const [timeList_2, setTimeList_2] = useState([]);

  const [employeesByrole, setEmployeesbyrole] = useState([]);

  const getEmployeesByrole = async () => {
    try {
      await axios
        .get(
          "http://localhost/laravel_auth_jwt_api/public/api/employees-role?data=" +
            userDetail().dept
        )
        .then((res) => {
          setEmployeesbyrole(
            res.data.employees.map((employee, index) => ({
              value: employee.full_name,
              label: employee.code + " | " + employee.full_name,
              code: employee.code,
              cost: employee.business_group,
            }))
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  const [selected, setSelected] = useState([]);

  const submitEmployee = async () => {
    selected.forEach((item) => {
      append({ option: item });
    });
    setNullTable(false);
  };

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

    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-filter-list_2?data=" +
          key
      )
      .then((res) => {
        setTimeList_2(res.data.time);
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
    try {
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
          //create_name: res.data.approver.app_name_1,
          department_name: res.data.approver.app_name_2,
          department: res.data.approver.agency,
          //name_app_1: res.data.approver.app_name_1,
          name_app_2: res.data.approver.app_name_2,
          name_app_3: res.data.approver.app_name_3,
          name_app_4: res.data.approver.app_name_4,
          //email_app_1: res.data.approver.app_email_1,
          email_app_2: res.data.approver.app_email_2,
          email_app_3: res.data.approver.app_email_3,
          email_app_4: res.data.approver.app_email_4,
          dept: res.data.approver.dept,
        });
      });
  };

  useEffect(() => {
    getEmployees();
    getApprover();
    deptFilter();
    getEmployeesByrole();
    const generateId = () => {
      const dept_cut = userDetail().dept.slice(0, -1)
      const date = new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2);
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `${prefix}-${dept_cut}-${month}${year}-${randomNum}`;
    };

    setId(generateId());
  }, [time, prefix]);

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
                  <li className="breadcrumb-item active">
                    เพิ่มคำร้องขออนุมัติ
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
                    <div className="row">
                      <div className="col-md-12 mt-3">
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">เลขที่ใบคำร้อง</label>
                                  <input
                                    //readOnly
                                    type="text"
                                    value={id}
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
                                    placeholder="กรุณากรอกข้อมูล"
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
                                  {/* <Controller
                                    control={control}
                                    name="ot_date"
                                    render={({ field }) => (
                                      <DatePicker
                                        required
                                        className="form-control"
                                        placeholderText="กรุณาเลือกข้อมูล"
                                        onChange={(date) =>
                                          field.onChange(
                                            dayjs(date).format("YYYY-MM-DD")
                                          )
                                        }
                                        dateFormat="dd-MM-yyyy"
                                        selected={field.value}
                                      />
                                    )}
                                  /> */}
                                  <input
                                    type="date"
                                    className="form-control"
                                    onChange={(event) =>
                                      dayjs(event.target.value).format(
                                        "YYYY-MM-DD"
                                      )
                                    }
                                    {...register("ot_date", {
                                      required: true,
                                    })}
                                  />
                                  {errors.ot_date && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">ประเภทการทำงาน OT</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    {...register("work_type", {
                                      required: true,
                                    })}
                                  >
                                    <option value="">กรุณาเลือกข้อมูล</option>
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
                                    id="sel3"
                                    onChange={(event) =>
                                      listFilter(event.target.value)
                                    }
                                  >
                                    <option value="">กรุณาเลือกข้อมูล</option>
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
                                    {/* OT ประเภท ทำงานเป็นกะ */}
                                    <option value="วันธรรมดา ก่อนเข้ากะ 1">
                                      OT วันธรรมดา ประเภท 1 ก่อนเข้ากะ
                                    </option>
                                    <option value="OT วันธรรมดา หลังกะ 1">
                                      OT วันธรรมดา ประเภท 1 หลังกะ
                                    </option>
                                    <option value="OT วันหยุดปกติ 1">
                                      OT วันหยุด ประเภท 1 วันหยุดปกติ
                                    </option>
                                    <option value="OT วันหยุด ก่อนเข้ากะ 1">
                                      OT วันหยุด ประเภท 1 ก่อนเข้ากะ
                                    </option>
                                    <option value="OT วันหยุด หลังกะ 1">
                                      OT วันหยุด ประเภท 1 หลังกะ
                                    </option>
                                    <option value="OT วันธรรมดา ก่อนเข้ากะ 2">
                                      OT วันธรรมดา ประเภท 2 ก่อนเข้ากะ
                                    </option>
                                    <option value="OT วันธรรมดา หลังกะ 2">
                                      OT วันธรรมดา ประเภท 2 หลังกะ
                                    </option>
                                    <option value="OT วันหยุดปกติ 2">
                                      OT วันหยุด ประเภท 2 วันหยุดปกติ
                                    </option>
                                    <option value="OT วันหยุด ก่อนเข้ากะ 2">
                                      OT วันหยุด ประเภท 2 ก่อนเข้ากะ
                                    </option>
                                    <option value="OT วันหยุด หลังกะ 2">
                                      OT วันหยุด ประเภท 2 หลังกะ
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
                                    <option value="">กรุณาเลือกข้อมูล</option>
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
                                    id="sele1"
                                    onChange={(event) =>
                                      finishFilter(event.target.value)
                                    }
                                  >
                                    <option value="">กรุณาเลือกข้อมูล</option>
                                    {timeList_2.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.ot_finish}
                                      >
                                        {item.ot_finish}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.end_date && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">จำนวนชั่วโมง</label>
                                  <input
                                    //readOnly
                                    placeholder="0"
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
                              {/* field hidden */}
                              <div className="col-md-12" hidden>
                                <input
                                  type="text"
                                  value={userDetail().name}
                                  {...register("name_app_1", {
                                    required: true,
                                  })}
                                />{" "}
                                <input
                                  type="text"
                                  {...register("name_app_3", {
                                    required: true,
                                  })}
                                />{" "}
                                <input
                                  type="text"
                                  value={userDetail().email}
                                  {...register("email_app_1", {
                                    required: true,
                                  })}
                                />{" "}
                                <input
                                  type="text"
                                  {...register("email_app_3", {
                                    required: true,
                                  })}
                                />{" "}
                                <input
                                  type="text"
                                  {...register("name_app_2", {
                                    required: true,
                                  })}
                                />{" "}
                                <input
                                  type="text"
                                  {...register("name_app_4", {
                                    required: true,
                                  })}
                                />{" "}
                                <input
                                  type="text"
                                  {...register("email_app_2", {
                                    required: true,
                                  })}
                                />{" "}
                                <input
                                  type="text"
                                  {...register("email_app_4", {
                                    required: true,
                                  })}
                                />
                                <input
                                  type="text"
                                  {...register("dept", { required: true })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12 mb-3">
                                <DualListBox
                                  canFilter
                                  required
                                  options={employeesByrole}
                                  selected={selected}
                                  onChange={(newValue) => setSelected(newValue)}
                                />
                              </div>
                              <div className="col-md-12">
                                <button
                                  className="btn btn-success float-right"
                                  type="button"
                                  onClick={submitEmployee}
                                >
                                  <i className="fas fa-plus-square"></i> พนักงาน
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <table className="table table-bordered">
                          <thead>
                            <tr align="center">
                              <th>#</th>
                              <th>รหัสพนักงาน</th>
                              <th>ชื่อพนักงาน</th>
                              <th>ประเภทค่าแรง</th>
                              <th>ชนิดงานที่ทำ</th>
                              <th>เป้าหมาย</th>
                              <th>จุดลงรถรับส่ง</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fields.map((field, index) => (
                              <tr key={field.id}>
                                <td>{index + 1}</td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={
                                      employeesByrole.find(
                                        (opt) => opt.value === field.option
                                      )?.code
                                    }
                                    {...register(`test.${index}.code`, {
                                      required: true,
                                    })}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={
                                      employeesByrole.find(
                                        (opt) => opt.value === field.option
                                      )?.value
                                    }
                                    {...register(`test.${index}.emp_name`, {
                                      required: true,
                                    })}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={
                                      employeesByrole.find(
                                        (opt) => opt.value === field.option
                                      )?.cost
                                    }
                                    {...register(`test.${index}.cost_type`, {
                                      required: true,
                                    })}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="กรุณาเพิ่มข้อมูล"
                                    {...register(`test.${index}.job_type`, {
                                      required: true,
                                    })}
                                  />
                                  {errors.test && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="กรุณาเพิ่มข้อมูล"
                                    {...register(`test.${index}.target`, {
                                      required: true,
                                    })}
                                  />
                                   {errors.test && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    {...register(`test.${index}.bus_stations`, {
                                      required: true,
                                    })}
                                  >
                                    <option value="">กรุณาเลือกข้อมูล</option>
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
                                      ไม่ใช้บริการรถรับส่ง
                                    </option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                            {nullTable ? (
                              <tr>
                                <td colSpan="7" align="center">
                                  <div className="text-muted">
                                    <i className="fas fa-user-plus"></i>{" "}
                                    กรุณาเพิ่มข้อมูล
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              ""
                            )}
                          </tbody>
                        </table>
                        <div>
                          <div className="float-right">
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
