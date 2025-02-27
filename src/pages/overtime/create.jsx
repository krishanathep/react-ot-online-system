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
  const [employeeSource, setEmployeeSource] = useState("agency"); // Default to department view
  const [displayedEmployees, setDisplayedEmployees] = useState([]);
  const [employeesByrole, setEmployeesbyrole] = useState([]);
  const [employeesByDept, setEmployeesByDept] = useState([]);
  const [employeesByAgency, setEmployeesByAgency] = useState([]);

  const otOptions = {
    normal_ot: [
      { value: "OT หลังเลิกงาน-ไม่พัก", label: "OT หลังเลิกงาน-ไม่พัก" },
      {
        value: "OT หลังเลิกงาน-พัก 20 นาที",
        label: "OT หลังเลิกงาน-พัก 20 นาที",
      },
      { value: "OT ก่อนเข้างาน", label: "OT ก่อนเข้างาน" },
      { value: "OT ช่วงพักเที่ยง", label: "OT ช่วงพักเที่ยง" },
      { value: "OT วันธรรมดา ก่อนเข้ากะ 1", label: "OT วันธรรมดา ก่อนกะ 21.45"},
      { value: "OT วันธรรมดา หลังกะ 1", label: "OT วันธรรมดา หลังกะ 7.05"},
      {
        value: "OT วันธรรมดา ก่อนเข้ากะ 2",
        label: "OT วันธรรมดา ก่อนกะ 20.15",
      },
      { value: "OT วันธรรมดา หลังกะ 2", label: "OT วันธรรมดา หลังกะ 5.35" },
    ],
    holiday_ot: [
      { value: "OT วันหยุด ทำเต็มวัน", label: "OT วันหยุด ทำเต็มวัน" },
      {
        value: "OT วันหยุด หลังเลิกงาน-ไม่พัก",
        label: "OT วันหยุด หลังเลิกงาน-ไม่พัก",
      },
      {
        value: "OT วันหยุด หลังเลิกงาน-พัก 20 นาที",
        label: "OT วันหยุด หลังเลิกงาน-พัก 20 นาที",
      },
    ],
    spacial_ot: [
      { value: "OT วันหยุดปกติ 1", label: "OT วันหยุดปกติ 21.45-6.45"},
      { value: "OT วันหยุด ก่อนเข้ากะ 1", label: "OT วันหยุด ก่อนกะ 21.45"},
      { value: "OT วันหยุด หลังกะ 1", label: "OT วันหยุด หลังกะ 6.45"},
      { value: "OT วันหยุดปกติ 2", label: "OT วันหยุดปกติ 20.15-5.15" },
      { value: "OT วันหยุด ก่อนเข้ากะ 2", label: "OT วันหยุด ก่อนกะ 20.15" },
      { value: "OT วันหยุด หลังกะ 2", label: "OT วันหยุด หลังกะ 5.15" },
    ],
  };

  const handleStartDateChange = (event) => {
    const value = event.target.value;
    setValue("start_date", value); // ตั้งค่าตัวแปร start_date
    finishFilter(value);
  };

  // Function to handle employee source change
  const handleSourceChange = (e) => {
    const source = e.target.value;
    setEmployeeSource(source);
    if (source === "agency") {
      setDisplayedEmployees(employeesByAgency);
    } else if (source === "dept") {
      setDisplayedEmployees(employeesByrole);
    } else if (source === "department") {
      setDisplayedEmployees(employeesByDept);
    } else {
      setDisplayedEmployees(employees);
    }
  };

  const [id, setId] = useState("");

  const [lock, SetLock] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const workType = watch("work_type"); // ดูค่าที่เลือกในประเภทการทำงาน OT

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
  const [isLoading, setLoading] = useState(true);
  const [loading, setLoading2] = useState(false);

  const [time, setTime] = useState(0);
  const [timeList, setTimeList] = useState([]);
  const [timeList_2, setTimeList_2] = useState([]);
  const [bus_point, setBusPoint] = useState([]);

  const [startDate, setStartDate] = useState("");

  const [ottime, setOttime] = useState("");

  // filter by All
  const getEmployees = async () => {
    try {
      setLoading(true);
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/employees")
        .then((res) => {
          setEmployees(
            res.data.employees.map((employee) => ({
              value: employee.emp_name,
              label: `${employee.emp_id} | ${employee.emp_name} | ${employee.department} | ${employee.agency} | ${employee.dept}`,
              code: employee.emp_id,
              cost: employee.bus_group,
            }))
          );
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // filter by Agency (หน่วยงาน)
  const getEmployeebyAgency = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_API_KEY + "/api/employees"
      );

      const userAgency = userDetail().agency; // ดึงค่า agency ของผู้ใช้ปัจจุบัน

      const filteredEmployees = response.data.employees
        .filter((employee) => employee.agency.startsWith(userAgency)) // กรองเฉพาะพนักงานใน agency เดียวกัน
        .map((employee) => ({
          value: employee.emp_name,
          label: `${employee.emp_id} | ${employee.emp_name} | ${employee.department} | ${employee.agency} | ${employee.dept}`,
          code: employee.emp_id,
          cost: employee.bus_group,
        }));

      setEmployeesByAgency(filteredEmployees);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // filter by Department (ส่วนงาน)
  const getEmployeebyDept = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_API_KEY + "/api/employees"
      );

      const userDepartment = userDetail().department;

      const filteredEmployees = response.data.employees
        .filter((employee) => employee.department===userDepartment) // กรองเฉพาะพนักงานใน agency เดียวกัน
        .map((employee) => ({
          value: employee.emp_name,
          label: `${employee.emp_id} | ${employee.emp_name} | ${employee.department} | ${employee.agency} | ${employee.dept}`,
          code: employee.emp_id,
          cost: employee.bus_group,
        }));

      setEmployeesByDept(filteredEmployees);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // fillter by dept (ฝ่ายงาน)
  const getEmployeesByrole = async () => {
    try {
      await axios
        .get(
          import.meta.env.VITE_API_KEY +
            "/api/employees-role?data=" +
            userDetail().dept
        )
        .then((res) => {
          setEmployeesbyrole(
            res.data.employees.map((employee) => ({
              value: employee.emp_name,
              label: `${employee.emp_id} | ${employee.emp_name} | ${employee.department} | ${employee.agency} | ${employee.dept}`,
              code: employee.emp_id,
              cost: employee.bus_group,
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
    SetLock(false);
  };

  const getBusPrice = async () => {
    try {
      setLoading(true);
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequest-bus-price-select")
        .then((res) => {
          setBusPoint(res.data.bus_price);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //filter เวลาที่เริ่มต้น
  const listFilter = async (key) => {
    await axios
      .get(
        import.meta.env.VITE_API_KEY + "/api/otrequests-filter-list?data=" + key
      )
      .then((res) => {
        setTimeList(res.data.time);
      });
  };

  //filter เวลาที่สิ้นสุด
  const finishFilter = async (key) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-finish?data=${key}`
      );
  
      // ใช้ setValue เพื่ออัปเดตเฉพาะ field ที่ต้องการ ไม่ให้ค่าอื่นโดนรีเซต
      setValue("total_date", res.data.time.ot_total);
      setValue("end_date", res.data.time.ot_finish);
    } catch (error) {
      console.error("Error fetching OT data:", error);
    }
  };

  const handleCreateSubmit = async (data) => {
    try {
      SetLock(true);
      setLoading2(true);
      await axios
        .post(import.meta.env.VITE_API_KEY + "/api/otrequest-create", data)
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
        import.meta.env.VITE_API_KEY +
          "/api/approver-role?data=" +
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
        import.meta.env.VITE_API_KEY +
          "/api/approve-dept?data=" +
          userDetail().agency
      )
      .then((res) => {
        reset({
          //create_name: res.data.approver.app_name_1,
          department_name: res.data.approver.app_name_3,
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
    const fetchLastIdAndGenerate = async () => {
      try {
        // เรียก API เพื่อดึง last ID
        const response = await axios.get(
          import.meta.env.VITE_API_KEY + "/api/get-last-id"
        );
        let lastId = response.data.last_id; // ใช้ lastId หรือ fallback เป็น "00000"

        // Add leading zeros to lastId
        lastId = lastId.toString().padStart(4, "0");

        // Generate ID
        const date = new Date();
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString().slice(-2);
        const generatedId = `${prefix}-${day}${month}${year}-${lastId}`;

        console.log(lastId);

        // ตั้งค่า ID
        setId(generatedId);
      } catch (error) {
        console.error("Error fetching last ID:", error);
      }
    };

    // เรียกฟังก์ชันเพื่อดึงข้อมูลและตั้ง ID
    fetchLastIdAndGenerate();

    // เรียกข้อมูลอื่น ๆ ที่จำเป็น
    getBusPrice();
    getEmployees();
    getApprover();
    deptFilter();
    getEmployeesByrole();
    getEmployeebyAgency();
    getEmployeebyDept();
  }, [time, prefix]);

  // Update displayedEmployees when employees or employeesByrole changes
  useEffect(() => {
    if (employeeSource === "dept") {
      setDisplayedEmployees(employeesByrole);
    } else if (employeeSource === "agency") {
      setDisplayedEmployees(employeesByAgency);
    } else if (employeeSource === "department") {
      setDisplayedEmployees(employeesByDept);
    } else {
      setDisplayedEmployees(employees);
    }
  }, [
    employees,
    employeesByrole,
    employeeSource,
    employeesByAgency,
    employeesByDept,
  ]);

  //loading with css
  if (loading === true) {
    return (
      <>
        <div className="loading-state">
          <div className="loading"></div>
        </div>
      </>
    );
  }

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
                    <Link to={"/"}>หน้าหลัก</Link>
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
                                    readOnly
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
                                    readOnly
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
                                  <label htmlFor="">
                                    <span className="text-danger">* </span>
                                    ผู้ควบคุมงาน
                                  </label>
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
                                    readOnly
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
                                  <label htmlFor="">
                                    <span className="text-danger">* </span>
                                    วันที่จัดทำ
                                  </label>
                                  <br />
                                  <Controller
                                    rules={{ required: true }}
                                    control={control}
                                    name="ot_date"
                                    render={({ field }) => (
                                      <DatePicker
                                        minDate={dayjs().toDate()}
                                        className="form-control"
                                        placeholderText="กรุณาเลือกวันที่"
                                        onChange={(date) =>
                                          field.onChange(
                                            dayjs(date).format("YYYY-MM-DD")
                                          )
                                        }
                                        dateFormat="dd-MM-yyyy"
                                        selected={field.value}
                                      />
                                    )}
                                  />
                                  {errors.ot_date && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">
                                    <span className="text-danger">* </span>
                                    ประเภทการทำงาน OT
                                  </label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    {...register("work_type", {
                                      required: true,
                                    })}
                                  >
                                    <option value="">กรุณาเลือกข้อมูล</option>
                                    <option value={"normal_ot"}>
                                      ล่วงเวลาวันปกติ
                                    </option>
                                    <option value={"holiday_ot"}>
                                      ทำงานวันหยุด
                                    </option>
                                    <option value={"spacial_ot"}>
                                      ล่วงเวลาวันหยุด
                                    </option>
                                  </select>
                                  {errors.work_type && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">
                                    <span className="text-danger">* </span>
                                    ช่วงเวลา OT
                                  </label>
                                  <select
                                    className="form-control"
                                    {...register("ot_type", { required: true })}
                                    onChange={(event) =>
                                      listFilter(event.target.value)
                                    }
                                  >
                                    <option value="">กรุณาเลือกข้อมูล</option>
                                    {(otOptions[workType] || []).map(
                                      (option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      )
                                    )}
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
                                  <label htmlFor="">
                                    <span className="text-danger">* </span>
                                    เวลาที่ทำ OT
                                  </label>
                                  <select
                                    {...register("start_date", {
                                      required: true,
                                    })}
                                    className="form-control"
                                    id="sele1"
                                    onChange={handleStartDateChange}
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
                                  {errors.end_date && (
                                    <span className="text-danger">
                                      This field is required
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <input
                                  hidden
                                  className="form-control"
                                  id="sel1"
                                  {...register("end_date", {
                                    required: true,
                                  })}
                                />
                                {errors.start_date && (
                                  <span className="text-danger">
                                    This field is required
                                  </span>
                                )}
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">จำนวนชั่วโมง (ชม.)</label>
                                  <input
                                    readOnly
                                    placeholder="0"
                                    className="form-control"
                                    {...register("total_date", {
                                      required: true,
                                    })}
                                    type="text"
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
                                <div className="d-flex justify-content-end mb-3">
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="employeeFilter"
                                      id="agencyFilter"
                                      value="agency"
                                      checked={employeeSource === "agency"}
                                      onChange={handleSourceChange}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="agencyFilter"
                                    >
                                      หน่วย
                                    </label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="employeeFilter"
                                      id="departmentFilter"
                                      value="department"
                                      checked={employeeSource === "department"}
                                      onChange={handleSourceChange}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="departmentFilter"
                                    >
                                      ส่วน
                                    </label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="employeeFilter"
                                      id="deptFilter"
                                      value="dept"
                                      checked={employeeSource === "dept"}
                                      onChange={handleSourceChange}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="deptFilter"
                                    >
                                      ฝ่าย
                                    </label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="employeeFilter"
                                      id="allFilter"
                                      value="all"
                                      checked={employeeSource === "all"}
                                      onChange={handleSourceChange}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="allFilter"
                                    >
                                      ทั้งหมด
                                    </label>
                                  </div>
                                </div>
                                <DualListBox
                                  canFilter
                                  required
                                  options={displayedEmployees}
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
                              <th>
                                <span className="text-danger">* </span>
                                ชนิดงานที่ทำ
                              </th>
                              <th>
                                <span className="text-danger">* </span>เป้าหมาย
                              </th>
                              <th>
                                <span className="text-danger">* </span>
                                จุดรถรับส่ง
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {fields.map((field, index) => (
                              <tr key={field.id}>
                                <td>{index + 1}</td>
                                <td>
                                  <input
                                    style={{ border: 0 }}
                                    size={1}
                                    className="form-control"
                                    type="text"
                                    value={
                                      employees.find(
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
                                    style={{ border: 0 }}
                                    className="form-control"
                                    type="text"
                                    value={
                                      employees.find(
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
                                    size={6}
                                    style={{ border: 0 }}
                                    className="form-control"
                                    type="text"
                                    value={
                                      employees.find(
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
                                    {bus_point.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.bus_point}
                                      >
                                        {item.bus_name}
                                      </option>
                                    ))}
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
                              disabled={lock}
                            >
                              <i className="fas fa-save"></i> ยืนยัน
                            </button>{" "}
                            <Link to={"/overtime"} className="btn btn-danger">
                              <i className="fas fa-arrow-circle-left"></i>{" "}
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
