import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";

const edit = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      test: [{}],
    },
  });

  const { id } = useParams();
  const navigate = useNavigate();

  //stepper complete state
  const [complete_1, setComplete_1] = useState(false);
  const [complete_2, setComplete_2] = useState(false);
  const [complete_3, setComplete_3] = useState(false);

  const [overtimes, setOvertimes] = useState({});
  const [members, setMemebers] = useState([]);

  const [scan1, setScan1]=useState([])
  const [scan2, setScan2]=useState([])

  const getData = async () => {
    await axios
      .get(import.meta.env.VITE_API_KEY+"/laravel_auth_jwt_api/public/api/otrequest/" + id)
      .then((res) => {
        setOvertimes(res.data.data);
        setMemebers(res.data.data.employees);
        reset({
          test: res.data.data.employees.map((employee) => ({
            id: employee.id,
            objective: employee.objective,
            out_time: employee.out_time,
            remark: employee.remark,
          })),
        });
        //stepper complete
        if (res.data.data.result === "รอการปิด (ส่วน)") {
          setComplete_1(true);
        }
        if (res.data.data.result === "รอการปิด (ผจก)") {
          setComplete_1(true), setComplete_2(true);
        }
        if (res.data.data.result === "ปิดการรายงาน") {
          setComplete_1(true), setComplete_2(true), setComplete_3(true);
        }
      });
  };

  const handleUpdateSubmit = async (data) => {
    await axios
      .put(
        import.meta.env.VITE_API_KEY+"/laravel_auth_jwt_api/public/api/otrequest-update-report/" +
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
        navigate("/overtime");
        //console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filter_scan_first_time = async () => {
    await axios.get(import.meta.env.VITE_API_KEY+"/laravel_auth_jwt_api/public/api/scan-first-time?data=66056&time=2024-07-30")
    .then((res)=>{
      setScan1(res.data.scan)
    }) 
  }

  
  const filter_scan_last_time = async () => {
    await axios.get(import.meta.env.VITE_API_KEY+"/laravel_auth_jwt_api/public/api/scan-last-time?data=66056&time=2024-07-30")
    .then((res)=>{
      setScan2(res.data.scan)
    }) 
  }

  useEffect(() => {
    filter_scan_first_time()
    filter_scan_last_time()
    getData();
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">รายงานผลการขออนุมัติ OT</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">คำขออนุมัติ</li>
                  <li className="breadcrumb-item active">รายงานผล</li>
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
                        <div className="col-md-12">
                          <table className="table table-borderless mt-3">
                            <thead>
                              <tr>
                                <td>
                                  <b>เลขคำร้อง</b> : {overtimes.ot_member_id}
                                </td>
                                <td>
                                  <b>ผู้จัดการฝ่าย</b> :{" "}
                                  {overtimes.department_name}
                                </td>
                                <td>
                                  <b>ผู้ควบคุมงาน</b> : {overtimes.create_name}
                                </td>
                                <td>
                                  <b>หน่วยงาน</b> : {overtimes.department}
                                </td>
                                <td>
                                  <b>ประเภทงาน</b> : {overtimes.work_type}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>วันที่ทำงาน</b> :{" "}
                                  {dayjs(overtimes.ot_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td>
                                  <b>เวลาเริ่มต้น</b> : {overtimes.start_date}{" "}
                                  น.
                                </td>
                                <td>
                                  <b>เวลาสิ้นสุด</b> : {overtimes.end_date} น.
                                </td>
                                <td>
                                  <b>เวลาทั้งหมด</b> : {overtimes.total_date}
                                </td>
                                <td>
                                  <b>จำนวนพนักงาน</b> : 1 คน
                                </td>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        <div className="col-md-12">
                          <table className="table table-bordered mt-3">
                            <thead>
                              <tr align={"center"}>
                                <th>#</th>
                                <th>รหัส</th>
                                <th>ชื่อพนักงาน</th>
                                <th>ประเภทค่าแรง</th>
                                <th>ชนิดของงาน</th>
                                <th>เป้าหมาย</th>
                                <th>ทำได้จริง</th>
                                <th>ข้อมูลสแกนนิ้ว</th>
                                <th>เลิกงาน</th>
                                <th>รวมเวลา</th>
                                <th>รถรับส่ง</th>
                                {/* <th>ค่ารถ</th> */}
                                <th>หมายเหตุ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {members.map((member, index) => {
                                return (
                                  <tr align="center" key={member.id}>
                                    <td>{index + 1}</td>
                                    <td>{member.code}</td>
                                    <td>{member.emp_name}</td>
                                    <td>{member.cost_type}</td>
                                    <td>{member.job_type}</td>
                                    <td>{member.target}</td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="text"
                                        size="2"
                                        placeholder="เพิ่มข้อมูล"
                                        {...register(
                                          `test.${index}.objective`,
                                          { required: true }
                                        )}
                                      />
                                      {errors.test && (
                                        <span className="text-danger">
                                          This field is required
                                        </span>
                                      )}
                                    </td>
                                    <td>{ dayjs(scan1.time).format('hh:mm') } - { dayjs(scan2.time).format('HH:mm') }</td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="text"
                                        size="2"
                                        placeholder="เพิ่มข้อมูล"
                                        {...register(`test.${index}.out_time`, {
                                          required: true,
                                        })}
                                      />
                                      {errors.test && (
                                        <span className="text-danger">
                                          This field is required
                                        </span>
                                      )}
                                    </td>
                                    <td>{overtimes.total_date}</td>
                                    <td>{member.bus_stations}</td>
                                    {/* <td>{member.bus_price}</td> */}
                                    <td>
                                      <input
                                        className="form-control"
                                        type="text"
                                        size="6"
                                        placeholder="เพิ่มข้อมูล"
                                        {...register(`test.${index}.remark`, {
                                          required: true,
                                        })}
                                      />
                                       {errors.test && (
                                        <span className="text-danger">
                                          This field is required
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-10 offset-1">
                          <table className="table table-borderless mt-5">
                            <thead>
                              <tr align="center">
                                <td width="20%"></td>
                                <td>
                                  <b>หัวหน้าส่วน</b> : {overtimes.name_app_2}
                                </td>
                                <td>
                                  <b>ผู้จัดการฝ่าย</b> : {overtimes.name_app_3}
                                </td>
                                <td width="20%"></td>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        {/* Stepper Function */}
                        <div className="col-md-6 offset-3">
                          <div
                            className="stepper-wrapper"
                            style={{ fontFamily: "Prompt" }}
                          >
                            <div
                              className={`stepper-item ${
                                !complete_1 ? null : "completed"
                              }`}
                            >
                              <div className="step-counter text-white">
                                <i className="fas fa-check"></i>
                              </div>
                              <div className="step-name">รายงานผล</div>
                            </div>
                            <div
                              className={`stepper-item ${
                                !complete_2 ? null : "completed"
                              }`}
                            >
                              <div className="step-counter text-white">
                                <i className="fas fa-check"></i>
                              </div>
                              <div className="step-name">ผู้อนุมัติคนที่ 1</div>
                            </div>
                            <div
                              className={`stepper-item ${
                                !complete_3 ? null : "completed"
                              }`}
                            >
                              <div className="step-counter text-white">
                                <i className="fas fa-check"></i>
                              </div>
                              <div className="step-name">ผู้อนุมัติคนที่ 2</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 mt-3">
                          <div className="float-right">
                            <button
                              className="btn btn-primary"
                              onClick={handleSubmit(handleUpdateSubmit)}
                              disabled={
                                overtimes.status === "ผ่านการอนุมัติ"
                                  ? false
                                  : true
                              }
                            >
                              <i className="fas fa-save"></i> ยืนยัน
                            </button>{" "}
                            <Link to={"/overtime"} className="btn btn-danger">
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
        </div>
      </div>
    </>
  );
};

export default edit;
