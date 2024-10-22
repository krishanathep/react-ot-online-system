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
    formState: { errors },
  } = useForm({

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
              check_price: employee.check_price,
              bus_point_1: employee.bus_point_1,
              bus_point_2: employee.bus_point_2,
              bus_point_3: employee.bus_point_3,
              bus_point_4: employee.bus_point_4,
              //bus_price: employee.bus_price,
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
              //bus_price: employee.bus_price,
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
            })),
        });
        //setLoading(false);
      });
  };


  const handleUpdate_01 = async (data) => {
    //alert(JSON.stringify(data)
    console.log(data);
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
    //alert(JSON.stringify(data))
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

  useEffect(() => {
    getData();
  }, []);

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
                          <th>#</th>
                          <th>รหัส</th>
                          <th>ชื่อพนักงาน</th>
                          <th>จุดรับส่ง 1</th>
                          <th>จุดรับส่ง 2</th>
                          <th>จุดรับส่ง 3</th>
                          <th>จุดรับส่ง 4</th>
                          <th>วันที่ทำ</th>
                          <th>เวลาเลิก</th>
                          <th>ค่าเดินทาง</th>
                          <th>แก้ไขล่าสุด</th>
                          <th>จัดทำโดย</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees_1.map((e, index) => (
                          <tr key={e.id} align="center">
                            <td>{index + 1}</td>
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
                            <td>
                              {dayjs(e.ot_create_date).format("DD-MM-YYYY")}
                            </td>
                            <td>{e.end_time} </td>
                            <td width={100} align="center">
                              <input
                                size={1}
                                className="form-control"
                                type="text"
                                value={
                                  e.bus_point_1 === '1' &&
                                  e.bus_stations === "จุดที่ 1"
                                    ? 0
                                    : e.bus_point_2 === '1' &&
                                      e.bus_stations === "จุดที่ 2"
                                    ? 0
                                    : e.bus_point_3 === '1' &&
                                      e.bus_stations === "จุดที่ 3"
                                    ? 0
                                    : e.bus_point_4 === '1' &&
                                      e.bus_stations === "จุดที่ 4"
                                    ? 0
                                    : 30
                                }
                                {...register(`test.${index}.bus_price`, {
                                  required: false,
                                })}
                              />
                            </td>
                            <td>
                              {dayjs(e.updated_at).format("DD-MM-YYYY HH.mm")}
                            </td>
                            <td>
                              <input
                                type="text"
                                size={8}
                                className="form-control"
                                value={userdetail().name}
                                {...register(`test.${index}.updated_by`, {
                                  required: false,
                                })}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr align="center">
                          <td colSpan={3}>รวมพนักงานทั้งหมด</td>
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
                      disabled={buttonLock}
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
                          <th>#</th>
                          <th>รหัส</th>
                          <th>ชื่อพนักงาน</th>
                          <th>จุดรับส่ง 1</th>
                          <th>จุดรับส่ง 2</th>
                          <th>จุดรับส่ง 3</th>
                          <th>จุดรับส่ง 4</th>
                          <th>วันที่ทำ</th>
                          <th>เวลาเลิก</th>
                          <th>ค่าเดินทาง</th>
                          {/* <th>สถานะ</th> */}
                          <th>แก้ไขล่าสุด</th>
                          <th>จัดทำโดย</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees_2.map((e, index) => (
                          <tr key={e.id} align="center">
                            <td>{index + 1}</td>
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
                            <td>
                              {dayjs(e.ot_create_date).format("DD-MM-YYYY")}
                            </td>
                            <td>{e.end_time} </td>
                            <td width={100} align="center">
                              <input
                                size={1}
                                className="form-control"
                                type="text"
                                value={
                                  e.bus_point_1 === '1' &&
                                  e.bus_stations === "จุดที่ 1"
                                    ? 0
                                    : e.bus_point_2 === '1' &&
                                      e.bus_stations === "จุดที่ 2"
                                    ? 0
                                    : e.bus_point_3 === '1' &&
                                      e.bus_stations === "จุดที่ 3"
                                    ? 0
                                    : e.bus_point_4 === '1' &&
                                      e.bus_stations === "จุดที่ 4"
                                    ? 0
                                    : 30
                                }
                                {...register(`test_2.${index}.bus_price`, {
                                  required: false,
                                })}
                              />
                            </td>
                            <td>
                              {dayjs(e.updated_at).format("DD-MM-YYYY HH.mm")}
                            </td>
                            <td>
                              <input
                                type="text"
                                size={8}
                                className="form-control"
                                value={userdetail().name}
                                {...register(`test_2.${index}.updated_by`, {
                                  required: false,
                                })}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr align="center">
                          <td colSpan={3}>รวมพนักงานทั้งหมด</td>
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
                                  {...register("bus_point_6", {
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
                                  {...register("bus_point_7", {
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
                                  {...register("bus_point_8", {
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
                      disabled={buttonLock}
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
