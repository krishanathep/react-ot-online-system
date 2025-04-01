import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

const viewAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  dayjs.extend(duration);
  const [overtimes, setOvertimes] = useState({});
  const [members, setMemebers] = useState([]);
  const [empcount, setEmpcount] = useState(0);

  //stepper complete state
  const [complete_1, setComplete_1] = useState(false);
  const [complete_2, setComplete_2] = useState(false);
  const [complete_3, setComplete_3] = useState(false);
  const [complete_4, setComplete_4] = useState(false);

  //stepper complete state 1
  const [complete_5, setComplete_5] = useState(false);
  const [complete_6, setComplete_6] = useState(false);
  const [complete_7, setComplete_7] = useState(false);

  const getData = async () => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest/" + id, {
        timeout: 5000,
      })
      .then((res) => {
        setOvertimes(res.data.data);
        setMemebers(res.data.data.employees);
        setEmpcount(res.data.data.employees.length);

        //stepper complete
        if (res.data.data.status === "รอการอนุมัติ 1") {
          setComplete_1(true);
        }
        if (res.data.data.status === "รอการอนุมัติ 2") {
          setComplete_1(true), setComplete_2(true);
        }
        if (res.data.data.status === "รอการอนุมัติ 3") {
          setComplete_1(true), setComplete_2(true), setComplete_3(true);
        }
        if (res.data.data.status === "ผ่านการอนุมัติ") {
          setComplete_1(true),
            setComplete_2(true),
            setComplete_3(true),
            setComplete_4(true);
        }

        //stepper complete 2
        if (res.data.data.result === "รอการปิด (ส่วน)") {
          setComplete_5(true);
        }
        if (res.data.data.result === "รอการปิด (ผจก)") {
          setComplete_5(true), setComplete_6(true);
        }
        if (res.data.data.result === "ปิดการรายงาน") {
          setComplete_5(true), setComplete_6(true), setComplete_7(true);
        }

        //คำนวนเวลาทั้งหมด * จำนวนพนักงาน
        const overtime = res.data.data.total_date; // เวลาล่วงเวลาในรูปแบบ 'ชั่วโมง:นาที'
        const count = res.data.data.employees.length;

        const calculateOvertime = () => {
          // แยกชั่วโมงและนาทีจาก overtime
          const [hours, minutes] = overtime.split(".").map(Number);

          // คำนวณเวลาล่วงเวลาทั้งหมด
          const totalMinutes = (hours * 60 + minutes) * count; // แปลงทั้งหมดเป็นนาที
          const totalHours = Math.floor(totalMinutes / 60); // คำนวณชั่วโมง
          const remainingMinutes = totalMinutes % 60; // คำนวณนาทีที่เหลือ

          // แสดงผลลัพธ์เป็นรูปแบบ 'ชั่วโมง:นาที'
          return `${totalHours}:${
            remainingMinutes < 10 ? "0" : ""
          }${remainingMinutes}`;
        };

        setResult(calculateOvertime);
      });
  };

  const [result, setResult] = useState("");

  const [timeRecord, setTimeRecord] = useState([]);

  const getTimeRecord = () => {
    axios
      .get(
        "http://129.200.6.52/laravel_oracle11g_hrcompu_api/public/api/time-records"
      )
      .then((res) => {
        const time = res.data.time_records;
        setTimeRecord(time);
      });
  };

  useEffect(() => {
    getData();
    getTimeRecord();
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">ข้อมูลการขออนุมัติ OT</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to={"/"}>หน้าหลัก</Link>
                  </li>
                  <li className="breadcrumb-item">การขออนุมัติ</li>
                  <li className="breadcrumb-item active">ข้อมูลการขออนุมัติ</li>
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
                                  <b>เลขที่คำร้อง</b> : {overtimes.ot_member_id}
                                </td>
                                <td>
                                  <b>ผู้จัดการฝ่าย</b> : {overtimes.name_app_3}
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
                                  <b>เวลาที่ทำ OT</b> : {overtimes.start_date}{" "}
                                  น.
                                </td>
                                <td>
                                  <b>เวลารวม</b> : {overtimes.total_date}
                                </td>
                                <td>
                                  <b>พนักงาน</b> : {empcount} คน{" "}
                                </td>
                                <td>
                                  <b>รวมทั้งหมด</b> : {result} ชม.
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
                                <th>เวลาเลิกงาน</th>
                                <th>รวมเวลา</th>
                                <th>รถรับส่ง</th>
                                <th>ค่าเดินทาง</th>
                                <th>หมายเหตุ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {members.map((member, index) => {
                                const start = dayjs(
                                  "01-01-2024 " + member.ot_in_time
                                );
                                const end = dayjs(
                                  "01-01-2024 " + member.out_time
                                );

                                let diff = dayjs.duration(end.diff(start));

                                // ตรวจสอบว่า overtimes.start_date เป็นช่วงที่ต้องหัก 60 นาทีหรือไม่
                                if (
                                  overtimes.start_date === "8:00 - 17:10" &&
                                  member.out_time > "12:00"
                                ) {
                                  diff = dayjs.duration(
                                    diff.asMinutes() - 70,
                                    "minutes"
                                  );
                                }

                                if (overtimes.start_date === "21:45 - 6:45") {
                                  diff = dayjs.duration(
                                    diff.asMinutes() + 1380,
                                    "minutes"
                                  );
                                }

                                const hours = Math.floor(diff.asHours());
                                const minutes = diff.minutes();
                                return (
                                  <tr align="center" key={member.id}>
                                    <td>{index + 1}</td>
                                    <td>{member.code}</td>
                                    <td>{member.emp_name}</td>
                                    <td>{member.cost_type}</td>
                                    <td>{member.job_type}</td>
                                    <td>{member.target}</td>
                                    <td className="text-secondary">
                                      {member.objective === null ? (
                                        <i className="fas fa-pencil-alt"></i>
                                      ) : (
                                        member.objective
                                      )}
                                    </td>
                                    <td>
                                    {timeRecord.filter(
                                        (r) =>
                                          r.dl_date.startsWith(
                                            overtimes.ot_date
                                          ) && r.em_code === member.code
                                      ).length === 0 ? (
                                        <div className="text-muted">
                                          ไม่มีข้อมูล...
                                        </div>
                                      ) : (
                                        timeRecord
                                          .filter(
                                            (r) =>
                                              r.dl_date.startsWith(
                                                overtimes.ot_date
                                              ) && r.em_code === member.code
                                          )
                                          .map((s, index) => (
                                            <div key={index} className="text-muted">
                                              {s.dl_sacttime === null || s.dl_eacttime === null
                                                ? "ไม่มีข้อมูล..."
                                                : `${s.dl_sacttime.substring(
                                                    11,
                                                    16
                                                  )} - ${s.dl_eacttime.substring(
                                                    11,
                                                    16
                                                  )}`}
                                            </div>
                                          ))
                                      )}
                                    </td>
                                    <td className="text-secondary">
                                      {member.out_time === null ? (
                                        <i className="fas fa-pencil-alt"></i>
                                      ) : (
                                        member.out_time
                                      )}
                                    </td>
                                    <td className="text-secondary">
                                      {member.out_time === null ? (
                                        <i className="fas fa-pencil-alt"></i>
                                      ) : (
                                        `${hours
                                          .toString()
                                          .padStart(2, "0")}:${minutes
                                          .toString()
                                          .padStart(2, "0")}`
                                      )}
                                    </td>
                                    <td>{member.bus_stations}</td>
                                    <td>{member.bus_price}</td>
                                    <td className="text-secondary">
                                      {member.remark === null ? (
                                        <i className="fas fa-pencil-alt"></i>
                                      ) : (
                                        member.remark
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-12">
                          <table className="table table-borderless mt-5">
                            <thead>
                              <tr align="center">
                                <td>
                                  <b>หัวหน้าหน่วย/ผู้จัดทำ</b> :{" "}
                                  {overtimes.name_app_1}<br/>
                                  <b>วัน/เวลาที่จัดทำ</b> :{" "}{dayjs(overtimes.created_at).format('DD-MMM-YYYY, HH:mm:ss')}
                                </td>
                                <td>
                                  <b>หัวหน้าส่วน</b> : {overtimes.name_app_2}
                                </td>
                                <td>
                                  <b>ผู้จัดการฝ่าย</b> : {overtimes.name_app_3}
                                </td>
                                <td>
                                  <b>ผู้จัดการอาวุโส</b> :{" "}
                                  {overtimes.name_app_4}
                                </td>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        {/* Stepper Function */}
                        <div className="col-md-12">
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
                              <div className="step-name">
                                หัวหน้าหน่วย/ผู้จัดทำ<br/>
                                
                              </div>
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
                            <div
                              className={`stepper-item ${
                                !complete_4 ? null : "completed"
                              }`}
                            >
                              <div className="step-counter text-white">
                                <i className="fas fa-check"></i>
                              </div>
                              <div className="step-name">ผู้อนุมัติคนที่ 3</div>
                            </div>
                          </div>
                        </div>
                        {/* Stepper Function */}
                        <div className="col-md-6 offset-3">
                          <div
                            className="stepper-wrapper"
                            style={{ fontFamily: "Prompt" }}
                          >
                            <div
                              className={`stepper-item ${
                                !complete_5 ? null : "completed"
                              }`}
                            >
                              <div className="step-counter text-white">
                                <i className="fas fa-check"></i>
                              </div>
                              <div className="step-name">การรายงานผล</div>
                            </div>
                            <div
                              className={`stepper-item ${
                                !complete_6 ? null : "completed"
                              }`}
                            >
                              <div className="step-counter text-white">
                                <i className="fas fa-check"></i>
                              </div>
                              <div className="step-name">ผู้อนุมัติคนที่ 1</div>
                            </div>
                            <div
                              className={`stepper-item ${
                                !complete_7 ? null : "completed"
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
                              onClick={() => navigate(-1)}
                              className="btn btn-danger"
                            >
                              <i className="fas fa-arrow-circle-left"></i>{" "}
                              ย้อนกลับ
                            </button>{" "}
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

export default viewAdmin;
