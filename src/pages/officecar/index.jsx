import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useAuthUser } from "react-auth-kit";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";

const manageCar = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {},
  } = useForm({
    defaultValues: {
      bus_point_1: false,
      bus_point_2: false,
      bus_point_3: false,
      bus_point_4: false,
      bus_point_5: false,
      bus_point_6: false,
      bus_point_7: false,
      bus_point_8: false,
    },
  });

  const [employees_1, setEmployees_1] = useState([]);
  const [employees_2, setEmployees_2] = useState([]);

  const [buttonLock, setButtonLock] = useState(false);

  const userdetail = useAuthUser();

  const [loading, setLoading] = useState(false);

  const [startdate, setStartDate] = useState(
    new dayjs(Date()).format("YYYY-MM-DD")
  );

  const getData = async () => {
    //setLoading(true);
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest-employees")
      .then((res) => {
        const otrequest1 = res.data.employees.filter(
          (e) =>
            (e.ot_create_date === startdate && e.end_time === "20.00") ||
            (e.ot_create_date === startdate && e.end_time === "19.50")
        );

        const otrequest2 = res.data.employees.filter(
          (e) =>
            (e.ot_create_date === startdate && e.end_time === "22.00") ||
            (e.ot_create_date === startdate && e.end_time === "21.50")
        );
        setEmployees_1(otrequest1);
        setEmployees_2(otrequest2);

        reset({
          test: res.data.employees
            .filter(
              (e) =>
                (e.ot_create_date === startdate && e.end_time === "20.00") ||
                (e.ot_create_date === startdate && e.end_time === "19.50")
            )
            .map((employee) => ({
              id: employee.id,
              //check_price: employee.check_price,
              bus_point_1: 0,
              bus_point_2: employee.bus_point_2,
              bus_point_3: employee.bus_point_3,
              bus_point_4: employee.bus_point_4,
              bus_price: employee.bus_price,
              bus_stations: employee.bus_stations,
            })),

          test_2: res.data.employees
            .filter(
              (e) =>
                (e.ot_create_date === startdate && e.end_time === "22.00") ||
                (e.ot_create_date === startdate && e.end_time === "21.50")
            )
            .map((employee) => ({
              id: employee.id,
              check_price: employee.check_price,
              bus_point_5: employee.bus_point_1,
              bus_point_6: employee.bus_point_2,
              bus_point_7: employee.bus_point_3,
              bus_point_8: employee.bus_point_4,
              bus_price: employee.bus_price,
              bus_stations: employee.bus_stations,
            })),
        });
        //setLoading(false);
      });
  };

  const dateFilter = async (date) => {
    //setLoading(true);
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest-employees")
      .then((res) => {
        const otrequest1 = res.data.employees.filter(
          (e) =>
            (e.ot_create_date === date && e.end_time === "20.00") ||
            (e.ot_create_date === date && e.end_time === "19.50")
        );

        const otrequest2 = res.data.employees.filter(
          (e) =>
            (e.ot_create_date === date && e.end_time === "22.00") ||
            (e.ot_create_date === date && e.end_time === "21.50")
        );
        setEmployees_1(otrequest1);
        setEmployees_2(otrequest2);
        setButtonLock(true);

        reset({
          test: res.data.employees
            .filter(
              (e) =>
                (e.ot_create_date === date && e.end_time === "20.00") ||
                (e.ot_create_date === date && e.end_time === "19.50")
            )
            .map((employee) => ({
              id: employee.id,
              check_price: employee.check_price,
              bus_point_1: employee.bus_point_1,
              bus_point_2: employee.bus_point_2,
              bus_point_3: employee.bus_point_3,
              bus_point_4: employee.bus_point_4,
              bus_price: employee.bus_price,
              bus_stations: employee.bus_stations,
            })),

          test_2: res.data.employees
            .filter(
              (e) =>
                (e.ot_create_date === startdate && e.end_time === "22.00") ||
                (e.ot_create_date === startdate && e.end_time === "21.50")
            )
            .map((employee) => ({
              id: employee.id,
              check_price: employee.check_price,
              bus_point_5: employee.bus_point_1,
              bus_point_6: employee.bus_point_2,
              bus_point_7: employee.bus_point_3,
              bus_point_8: employee.bus_point_4,
              bus_price: employee.bus_price,
              bus_stations: employee.bus_stations,
            })),
        });
        //setLoading(false);
      });
  };

  const handleUpdate_01 = async (data) => {
    await axios
      .put(
        import.meta.env.VITE_API_KEY + "/api/otrequest-employees-update",
        data
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Your Office Car has been updated",
          showConfirmButton: false,
          timer: 2000,
        });
        console.log(res);
        getData();
      });
  };

  const handleUpdate_02 = async (data) => {
    // localStorage.setItem("bus_point_5", JSON.stringify(data.bus_point_5));
    // localStorage.setItem("bus_point_6", JSON.stringify(data.bus_point_6));
    // localStorage.setItem("bus_point_7", JSON.stringify(data.bus_point_7));
    // localStorage.setItem("bus_point_8", JSON.stringify(data.bus_point_8));

    await axios
      .put(
        import.meta.env.VITE_API_KEY + "/api/otrequest-employees-update2",
        data
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Your Office Car has been updated",
          showConfirmButton: false,
          timer: 2000,
        });
        getData();
        console.log(res);
      });
  };

  // const getValue = () => {
  //   const savedAcceptTerm1 = JSON.parse(localStorage.getItem("bus_point_1"));
  //   if (savedAcceptTerm1 !== null) {
  //     setValue("bus_point_1", savedAcceptTerm1);
  //   }
  //   const savedAcceptTerm2 = JSON.parse(localStorage.getItem("bus_point_2"));
  //   if (savedAcceptTerm2 !== null) {
  //     setValue("bus_point_2", savedAcceptTerm2);
  //   }
  //   const savedAcceptTerm3 = JSON.parse(localStorage.getItem("bus_point_3"));
  //   if (savedAcceptTerm3 !== null) {
  //     setValue("bus_point_3", savedAcceptTerm3);
  //   }
  //   const savedAcceptTerm4 = JSON.parse(localStorage.getItem("bus_point_4"));
  //   if (savedAcceptTerm4 !== null) {
  //     setValue("bus_point_4", savedAcceptTerm4);
  //   }
  //   const savedAcceptTerm5 = JSON.parse(localStorage.getItem("bus_point_5"));
  //   if (savedAcceptTerm5 !== null) {
  //     setValue("bus_point_5", savedAcceptTerm5);
  //   }
  //   const savedAcceptTerm6 = JSON.parse(localStorage.getItem("bus_point_6"));
  //   if (savedAcceptTerm6 !== null) {
  //     setValue("bus_point_6", savedAcceptTerm6);
  //   }
  //   const savedAcceptTerm7 = JSON.parse(localStorage.getItem("bus_point_7"));
  //   if (savedAcceptTerm7 !== null) {
  //     setValue("bus_point_7", savedAcceptTerm7);
  //   }
  //   const savedAcceptTerm8 = JSON.parse(localStorage.getItem("bus_point_8"));
  //   if (savedAcceptTerm8 !== null) {
  //     setValue("bus_point_8", savedAcceptTerm8);
  //   }
  // };

  useEffect(() => {
    getData();
    //getValue();
  }, [setValue]);

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
                <h1 className="m-0">จัดการรถรับส่ง</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">จัดการรถรับส่ง</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content-wraper">
          <div className="container-fluid">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="float-right">
                          <DatePicker
                            className="form-control"
                            placeholderText="กรุณาเลือกวันที่"
                            selected={startdate}
                            onChange={(date) => {
                              setStartDate(date);
                              dateFilter(dayjs(date).format("YYYY-MM-DD"));
                            }}
                            dateFormat="dd-MM-yyyy"
                          />
                        </div>
                        <h5>เวลาเลิก : 19.50 น. - 20.00 น.</h5>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit(handleUpdate_01)}>
                    <table className="table table-bordered mt-2">
                      <thead>
                        <tr align="center">
                          {/* <th>#</th> */}
                          <th>รหัส</th>
                          <th>ชื่อพนักงาน</th>
                          <th>สายศาลายา</th>
                          <th>สายนครชัยศรี</th>
                          <th>สายหนองแขม</th>
                          <th>สายวงเวียนใหญ่</th>
                          {/* <th>ไม่ใช้บริการ</th> */}
                          <th>วันที่ทำ</th>
                          <th>เวลาที่เลิก</th>
                          <th>ค่าเดินทาง</th>
                          <th>เวลาที่บันทึก</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees_1.map((e, index) => (
                          <tr
                            key={e.id}
                            align="center"
                            hidden={e.bus_stations === "ไม่ใช้บริการ"}
                          >
                            {/* <td>{index + 1}</td> */}
                            <td>{e.code}</td>
                            <td>{e.emp_name}</td>
                            <td>
                              {e.bus_stations === "จุดที่ 1" ? (
                                <i className="fas fa-map-marker-alt text-danger"></i>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {e.bus_stations === "จุดที่ 2" ? (
                                <i className="fas fa-map-marker-alt text-danger"></i>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {e.bus_stations === "จุดที่ 3" ? (
                                <i className="fas fa-map-marker-alt text-danger"></i>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {e.bus_stations === "จุดที่ 4" ? (
                                <i className="fas fa-map-marker-alt text-danger"></i>
                              ) : (
                                "-"
                              )}
                            </td>
                            {/* <td>
                              {e.bus_stations === "ไม่ใช้บริการ" ? (
                                <i className="fas fa-ban text-danger"></i>
                              ) : (
                                "-"
                              )}
                            </td> */}
                            <td>
                              {dayjs(e.ot_create_date).format("DD-MM-YYYY")}
                            </td>
                            <td>{e.end_time} </td>
                            <td hidden>
                              <input
                                size={2}
                                type="text"
                                value={e.bus_stations}
                              />
                            </td>
                            <td>
                              <input
                                style={{ border: 0 }}
                                size={1}
                                type="text"
                                {...register(`test.${index}.bus_price`, {
                                  required: false,
                                })}
                              />
                            </td>
                            <td>{e.update_time ? dayjs(e.update_time).format("HH:mm") : "ไม่พบข้อมูล"}</td>
                            <input
                              hidden
                              type="text"
                              size={1}
                              className="form-control"
                              value={userdetail().name}
                              {...register(`test.${index}.updated_by`, {
                                required: false,
                              })}
                            />
                          </tr>
                        ))}
                        <tr align="center">
                          <td colSpan={2}>
                            <b>รวมพนักงานทั้งหมด{" "}
                            {
                              employees_1.filter(
                                (e) =>
                                  e.bus_stations === "จุดที่ 1" ||
                                  e.bus_stations === "จุดที่ 2" ||
                                  e.bus_stations === "จุดที่ 3" ||
                                  e.bus_stations === "จุดที่ 4"
                              ).length
                            }{" "}
                            คน</b>
                          </td>
                          <td>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input
                                  type="checkbox"
                                  value={1}
                                  {...register("bus_point_1", {
                                    required: false,
                                  })}
                                />{" "}
                                จำนวน{" "}
                                {
                                  employees_1.filter(
                                    (e) => e.bus_stations === "จุดที่ 1"
                                  ).length
                                }{" "}
                                คน
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input
                                  type="checkbox"
                                  value={1}
                                  {...register("bus_point_2", {
                                    required: false,
                                  })}
                                />{" "}
                                จำนวน{" "}
                                {
                                  employees_1.filter(
                                    (e) => e.bus_stations === "จุดที่ 2"
                                  ).length
                                }{" "}
                                คน
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input
                                  type="checkbox"
                                  value={1}
                                  {...register("bus_point_3", {
                                    required: false,
                                  })}
                                />{" "}
                                จำนวน{" "}
                                {
                                  employees_1.filter(
                                    (e) => e.bus_stations === "จุดที่ 3"
                                  ).length
                                }{" "}
                                คน
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input
                                  type="checkbox"
                                  value={1}
                                  {...register("bus_point_4", {
                                    required: false,
                                  })}
                                />{" "}
                                จำนวน{" "}
                                {
                                  employees_1.filter(
                                    (e) => e.bus_stations === "จุดที่ 4"
                                  ).length
                                }{" "}
                                คน
                              </label>
                            </div>
                          </td>
                          <td></td>
                          <td><b>บันทึกโดย</b></td>
                          <td colSpan={2}>
                              {" "}
                              {employees_1.find((e) => e.updated_by)
                                ?.updated_by || "ไม่พบข้อมูล"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      <span>
                        <b>จุดรถรับ-ส่ง</b> 1. สายศาลายา 2. สายนครชัยศรี 3.
                        สายหนองแขม 4. สายวงเวียนใหญ่
                      </span>
                    </div>
                    <button
                      disabled={buttonLock || employees_1.length===0}
                      type="submit"
                      className="btn btn-success mt-2 float-right"
                    >
                      <i className="fas fa-save"> บันทึก</i>
                    </button>
                  </form>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-12">
                        <h5>เวลาเลิก : 21.50 น. - 22.00 น.</h5>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit(handleUpdate_02)}>
                    <table className="table table-bordered mt-2">
                      <thead>
                        <tr align="center">
                          {/* <th>#</th> */}
                          <th>รหัส</th>
                          <th>ชื่อพนักงาน</th>
                          <th>สายศาลายา</th>
                          <th>สายนครชัยศรี</th>
                          <th>สายหนองแขม</th>
                          <th>สายวงเวียนใหญ่</th>
                          {/* <th>ไม่ใช้บริการ</th> */}
                          <th>วันที่ทำ</th>
                          <th>เวลาที่เลิก</th>
                          <th>ค่าเดินทาง</th>
                          <th>เวลาที่บันทึก</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees_2.map((e, index) => (
                          <tr
                            key={e.id}
                            align="center"
                            hidden={e.bus_stations === "ไม่ใช้บริการ"}
                          >
                            {/* <td>{index + 1}</td> */}
                            <td>{e.code}</td>
                            <td>{e.emp_name}</td>
                            <td>
                              {e.bus_stations === "จุดที่ 1" ? (
                                <i className="fas fa-map-marker-alt text-danger"></i>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {e.bus_stations === "จุดที่ 2" ? (
                                <i className="fas fa-map-marker-alt text-danger"></i>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {e.bus_stations === "จุดที่ 3" ? (
                                <i className="fas fa-map-marker-alt text-danger"></i>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {e.bus_stations === "จุดที่ 4" ? (
                                <i className="fas fa-map-marker-alt text-danger"></i>
                              ) : (
                                "-"
                              )}
                            </td>
                            {/* <td>
                              {e.bus_stations === "ไม่ใช้บริการ" ? (
                                <i className="fas fa-ban text-danger"></i>
                              ) : (
                                "-"
                              )}
                            </td> */}
                            <td>
                              {dayjs(e.ot_create_date).format("DD-MM-YYYY")}
                            </td>
                            <td>{e.end_time} </td>
                            <td hidden>
                              <input
                                type="text"
                                size={1}
                                value={e.bus_stations}
                              />
                            </td>
                            <td>
                              <input
                                style={{ border: 0 }}
                                size={1}
                                className="form-control"
                                type="text"
                                {...register(`test_2.${index}.bus_price`, {
                                  required: false,
                                })}
                              />
                            </td>
                            <td>{e.update_time ? dayjs(e.update_time).format("HH:mm") : "ไม่พบข้อมูล"}</td>

                            <input
                              hidden
                              type="text"
                              size={8}
                              className="form-control"
                              value={userdetail().name}
                              {...register(`test_2.${index}.updated_by`, {
                                required: false,
                              })}
                            />
                          </tr>
                        ))}
                        <tr align="center">
                          <td colSpan={2}>
                            <b>รวมพนักงานทั้งหมด{" "}
                            {
                              employees_2.filter(
                                (e) =>
                                  e.bus_stations === "จุดที่ 1" ||
                                  e.bus_stations === "จุดที่ 2" ||
                                  e.bus_stations === "จุดที่ 3" ||
                                  e.bus_stations === "จุดที่ 4"
                              ).length
                            }{" "}
                            คน</b>
                          </td>
                          <td>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input
                                  type="checkbox"
                                  value={1}
                                  {...register("bus_point_5", {
                                    required: false,
                                  })}
                                />{" "}
                                จำนวน{" "}
                                {
                                  employees_2.filter(
                                    (e) => e.bus_stations === "จุดที่ 1"
                                  ).length
                                }{" "}
                                คน
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input
                                  type="checkbox"
                                  value={1}
                                  {...register("bus_point_6", {
                                    required: false,
                                  })}
                                />{" "}
                                จำนวน{" "}
                                {
                                  employees_2.filter(
                                    (e) => e.bus_stations === "จุดที่ 2"
                                  ).length
                                }{" "}
                                คน
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input
                                  type="checkbox"
                                  value={1}
                                  {...register("bus_point_7", {
                                    required: false,
                                  })}
                                />{" "}
                                จำนวน{" "}
                                {
                                  employees_2.filter(
                                    (e) => e.bus_stations === "จุดที่ 3"
                                  ).length
                                }{" "}
                                คน
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input
                                  type="checkbox"
                                  value={1}
                                  {...register("bus_point_8", {
                                    required: false,
                                  })}
                                />{" "}
                                จำนวน{" "}
                                {
                                  employees_2.filter(
                                    (e) => e.bus_stations === "จุดที่ 4"
                                  ).length
                                }{" "}
                                คน
                              </label>
                            </div>
                          </td>
                          <td></td>
                          <td><b>บันทึกโดย</b></td>
                          <td colSpan={2}>
                          {employees_2.find((e) => e.updated_by)?.updated_by || "ไม่พบข้อมูล"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      <span>
                        <b>จุดรถรับ-ส่ง</b> 1. สายศาลายา 2. สายนครชัยศรี 3.
                        สายหนองแขม 4. สายวงเวียนใหญ่
                      </span>
                    </div>
                    <button
                      disabled={buttonLock || employees_2.length===0}
                      type="submit"
                      className="btn btn-success mt-2 float-right"
                    >
                      <i className="fas fa-save"> บันทึก</i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default manageCar;
