import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

const edit = () => {
  dayjs.extend(duration);
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
  const [empcount, setEmpcount] = useState(0);

  const getData = async () => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest/" + id)
      .then((res) => {
        // count employee
        setEmpcount(res.data.data.employees.length);
        const ot = res.data.data;
        setOvertimes(ot);

        const bus = res.data.data.employees;

        setMemebers(bus.filter((b) => b.bus_stations !== "no"));

        reset({
          test: res.data.data.employees.map((employee) => ({
            id: employee.id,
            objective: employee.objective,
            out_time: employee.out_time,
            //bus_price: employee.bus_price,
            remark: employee.remark,
            ot_create_date: res.data.data.ot_date,
            ot_in_time: res.data.data.start_date,
            ot_out_time: res.data.data.end_date,
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
    //alert(JSON.stringify(data))
    await axios
      .put(
        import.meta.env.VITE_API_KEY + "/api/otrequest-update-report/" + id,
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
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
                                  <b>เวลารวม</b> : {overtimes.total_date} ชม.
                                </td>
                                <td>
                                  <b>พนักงาน</b> : {empcount} คน{" "}
                                  <b>รวมทั้งหมด</b> :{" "}
                                  {overtimes.total_date * empcount} ชม.
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
                                <th>เลิกงานจริง</th>
                                <th>รวมเวลา</th>
                                <th>รถรับส่ง</th>
                                <th>ค่าเดินทาง</th>
                                <th>หมายเหตุ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {members.map((member, index) => {
                                const start = dayjs(
                                  "01-01-2024 " + overtimes.start_date
                                );
                                const end = dayjs(
                                  "01-01-2024 " + member.out_time
                                );

                                const diff = dayjs.duration(end.diff(start));

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
                                    <td>
                                    {member.time_scan
                                        .filter((s) =>
                                          s.date_scan
                                            .toLowerCase()
                                            .includes(overtimes.ot_date)
                                        )
                                        .map((t, index) => {
                                          return (
                                            <span key={index}>
                                              {index === 0 ? t.time_scan.substring(0,5) : null}
                                            </span>
                                          );
                                        })}{" "}
                                      -{" "}
                                      {member.time_scan
                                        .filter((s) =>
                                          s.date_scan
                                            .toLowerCase()
                                            .includes(overtimes.ot_date)
                                        )
                                        .map((t, index) => {
                                          return (
                                            <span key={index}>
                                              {index === 1 ? t.time_scan.substring(0,5) : null}
                                            </span>
                                          );
                                        })}
                                    </td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="text"
                                        size="2"
                                        placeholder="20:00"
                                        {...register(`test.${index}.out_time`, {
                                          required: true,
                                          pattern: {
                                            value: /^([01]\d|2[0-3]):([0-5]\d)$/,
                                          }
                                        })}
                                      />
                                      {errors.test && errors.test[index]?.out_time && (
                                        <span className="text-danger">
                                          Please input time format hh:mm
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {member.out_time === null
                                        ? "0"
                                        : `${hours
                                            .toString()
                                            .padStart(2, "0")}:${minutes
                                            .toString()
                                            .padStart(2, "0")}`}
                                      {/* {Math.round((member.out_time - overtimes.start_date)*100) / 100} */}
                                    </td>
                                    <td>{member.bus_stations}</td>
                                    <td>
                                      <input
                                        className="form-control"
                                        type="text"
                                        value={30}
                                        // value={
                                        //   member.bus_stations === "จุดที่ 1" &&
                                        //   overtimes.bus_point_1 !== "0"
                                        //     ? "0"
                                        //     : member.bus_stations ===
                                        //         "จุดที่ 2" &&
                                        //       overtimes.bus_point_2 !== "0"
                                        //     ? "0"
                                        //     : member.bus_stations ===
                                        //         "จุดที่ 3" &&
                                        //       overtimes.bus_point_3 !== "0"
                                        //     ? "0"
                                        //     : member.bus_stations ===
                                        //         "จุดที่ 4" &&
                                        //       overtimes.bus_point_4 !== "0"
                                        //     ? "0"
                                        //     : "30"
                                        // }
                                        size="1"
                                        {...register(
                                          `test.${index}.bus_price`,
                                          {
                                            required: false,
                                          }
                                        )}
                                      />
                                    </td>
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
                                      {/* input hidden */}
                                      <div hidden>
                                        <input
                                          className="form-control"
                                          type="text"
                                          size="6"
                                          {...register(
                                            `test.${index}.ot_create_date`,
                                            {
                                              required: false,
                                            }
                                          )}
                                        />
                                        <input
                                          className="form-control"
                                          type="text"
                                          size="6"
                                          {...register(
                                            `test.${index}.ot_in_time`,
                                            {
                                              required: false,
                                            }
                                          )}
                                        />
                                        <input
                                          className="form-control"
                                          type="text"
                                          size="6"
                                          {...register(
                                            `test.${index}.ot_out_time`,
                                            {
                                              required: false,
                                            }
                                          )}
                                        />
                                      </div>
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
                              <div className="step-name">การรายงานผล</div>
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
                              <i className="fas fa-arrow-circle-left"></i>{" "}
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
