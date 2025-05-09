import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useAuthUser } from "react-auth-kit";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";

const busPrice = () => {
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

  const [employees_1, setEmployees_1] = useState([]);
  const [employees_2, setEmployees_2] = useState([]);

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
        setEmployees_1(otrequest1);
        
        const otrequest2 = res.data.employees.filter(
          (e) =>
            (e.ot_create_date === startdate && e.end_time === "22.00") ||
            (e.ot_create_date === startdate && e.end_time === "21.50")
        );
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
              bus_price: employee.bus_price,
              //updated_by: employee.updated_by,
            })),
          test_2: res.data.employees
            .filter(
              (e) =>
                (e.ot_create_date === startdate && e.end_time === "22.00") ||
                (e.ot_create_date === startdate && e.end_time === "21.50")
            )
            .map((employee) => ({
              id: employee.id,
              // bus_point_1: employee.bus_point_1,
              // bus_point_2: employee.bus_point_2,
              // bus_point_3: employee.bus_point_3,
              // bus_point_4: employee.bus_point_4,
              //check_price: employee.check_price,
              bus_price: employee.bus_price,
              //updated_by: employee.updated_by,
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
        setEmployees_1(otrequest1);
        const otrequest2 = res.data.employees.filter(
          (e) =>
            (e.ot_create_date === date && e.end_time === "22.00") ||
            (e.ot_create_date === date && e.end_time === "21.50")
        );
        setEmployees_2(otrequest2);
        reset({
          test: res.data.employees
            .filter(
              (e) =>
                (e.ot_create_date === date && e.end_time === "20.00") ||
                (e.ot_create_date === date && e.end_time === "19.50")
            )
            .map((employee) => ({
              id: employee.id,
              bus_price: employee.bus_price,
            })),
          test_2: res.data.employees
            .filter(
              (e) =>
                (e.ot_create_date === date && e.end_time === "22.00") ||
                (e.ot_create_date === date && e.end_time === "21.50")
            )
            .map((employee) => ({
              id: employee.id,
              bus_price: employee.bus_price,
              // bus_point_1: employee.bus_point_1,
              // bus_point_2: employee.bus_point_2,
              // bus_point_3: employee.bus_point_3,
              // bus_point_4: employee.bus_point_4,
            })),
        });
        //setLoading(false);
      });
  };

  const handleUpdate_01 = async (data) => {
    //alert(JSON.stringify(data))
    await axios
      .put(
        import.meta.env.VITE_API_KEY + "/api/employees-update-bus-price_1",
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
        import.meta.env.VITE_API_KEY + "/api/employees-update-bus-price_2",
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

  const [busprice, setBusPrice] = useState(employees_1);
  const [selectedIds, setSelectedIds] = useState([]);

 const handleCheckboxChange = (id) => {
  // setSelectedIds(prev => 
  //   prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  // );
  // alert(id)
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
                  <Link to={'/'}>หน้าหลัก</Link>
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
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="">วันที่ทำ OT</label>
                            <br />
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-4">
                        <h5>เวลาที่เลิกทำ OT : 19.50 น. - 20.00 น.</h5>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit(handleUpdate_01)}>
                    <table className="table table-bordered mt-2">
                      <thead>
                        <tr align="center">
                          {/* <th>#</th> */}
                          <th>รหัสพนักงาน</th>
                          <th>ชื่อพนักงาน</th>
                          <th>สายศาลายา</th>
                          <th>สายนครชัยศรี</th>
                          <th>สายหนองแขม</th>
                          <th>สายวงเวียนใหญ่</th>
                          <th>วันที่ทำ OT</th>
                          <th>เวลาเลิก OT</th>
                          <th>ค่าเดินทาง</th>
                          <th>เวลาที่บันทึก</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees_1.map((e, index) => (
                          <tr key={e.id} align="center" hidden={e.bus_stations === "ไม่ใช้บริการ"}>
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
                            <td>
                              {dayjs(e.ot_create_date).format("DD-MM-YYYY")}
                            </td>
                            <td>{e.end_time} </td>
                            <td width={100} align="center">
                              <input
                                size={1}
                                className="form-control"
                                type="text"
                                {...register(`test.${index}.bus_price`, {
                                  required: false,
                                })}
                              />
                            </td>
                           <td>{e.update_time ? dayjs(e.update_time).format("HH:mm") : "ไม่พบข้อมูล"}</td>
                            <td hidden>
                              <input
                                type="text"
                                size={8}
                                className="form-control"
                                readOnly
                                value={userdetail().name}
                                {...register(`test.${index}.updated_by`, {
                                  required: false,
                                })}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr align="center">
                          <td colSpan={2}><b>รวมพนักงานทั้งหมด {employees_1.filter((e)=> e.bus_stations === "จุดที่ 1" || e.bus_stations === "จุดที่ 2" || e.bus_stations === "จุดที่ 3" || e.bus_stations === "จุดที่ 4").length} คน</b></td>
                          <td>
                            <div className="form-check">
                              {/* <input
                                className="form-check-input"
                                type="checkbox"
                                value="1"
                                {...register("bus_point_1", {
                                  required: false,
                                })}
                              /> */}
                              <label className="form-check-label">
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
                              {/* <input
                                className="form-check-input"
                                type="checkbox"
                                value="2"
                                {...register("bus_point_2", {
                                  required: false,
                                })}
                              /> */}
                              <label className="form-check-label">
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
                              {/* <input
                                className="form-check-input"
                                type="checkbox"
                                value="3"
                                {...register("bus_point_3", {
                                  required: false,
                                })}
                              /> */}
                              <label className="form-check-label">
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
                              {/* <input
                                className="form-check-input"
                                type="checkbox"
                                value="4"
                                {...register("bus_point_4", {
                                  required: false,
                                })}
                              /> */}
                              <label className="form-check-label">
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
                          <td colSpan={4}>
                            
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
                      type="submit"
                      className="btn btn-primary mt-2 float-right"
                    >
                      <i className="fas fa-save"> บันทึก</i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-4">
                        <h5>เวลาที่เลิกทำ OT : 21.50 น. - 22.00 น.</h5>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit(handleUpdate_02)}>
                    <table className="table table-bordered mt-2">
                      <thead>
                        <tr align="center">
                          {/* <th>#</th> */}
                          <th>รหัสพนักงาน</th>
                          <th>ชื่อพนักงาน</th>
                          <th>สายศาลายา</th>
                          <th>สายนครชัยศรี</th>
                          <th>สายหนองแขม</th>
                          <th>สายวงเวียนใหญ่</th>
                          <th>วันที่ทำ OT</th>
                          <th>เวลาเลิก OT</th>
                          <th>ค่าเดินทาง</th>
                          <th>เวลาที่บันทึก</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees_2.map((e, index) => (
                          <tr key={e.id} align="center" hidden={e.bus_stations === "ไม่ใช้บริการ"}>
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
                            <td>
                              {dayjs(e.ot_create_date).format("DD-MM-YYYY")}
                            </td>
                            <td>{e.end_time} </td>
                            <td width={100} align="center">
                              <input
                                size={1}
                                className="form-control"
                                type="text"
                                {...register(`test_2.${index}.bus_price`, {
                                  required: false,
                                })}
                              />
                            </td>
                           
                            <td>{e.update_time ? dayjs(e.update_time).format("HH:mm") : "ไม่พบข้อมูล"}</td>
                            <td hidden>
                              <input
                                type="text"
                                size={8}
                                className="form-control"
                                readOnly
                                value={userdetail().name}
                                {...register(`test_2.${index}.updated_by`, {
                                  required: false,
                                })}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr align="center">
                        <td colSpan={2}><b>รวมพนักงานทั้งหมด {employees_2.filter((e)=> e.bus_stations === "จุดที่ 1" || e.bus_stations === "จุดที่ 2" || e.bus_stations === "จุดที่ 3" || e.bus_stations === "จุดที่ 4").length} คน</b></td>
                          <td>
                            <div className="form-check">
                              {/* <input
                                className="form-check-input"
                                type="checkbox"
                                value="1"
                                {...register("bus_point_1", {
                                  required: false,
                                })}
                              /> */}
                              <label className="form-check-label">
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
                              {/* <input
                                className="form-check-input"
                                type="checkbox"
                                value="2"
                                {...register("bus_point_2", {
                                  required: false,
                                })}
                              /> */}
                              <label className="form-check-label">
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
                              {/* <input
                                className="form-check-input"
                                type="checkbox"
                                value="3"
                                {...register("bus_point_3", {
                                  required: false,
                                })}
                              /> */}
                              <label className="form-check-label">
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
                              {/* <input
                                className="form-check-input"
                                type="checkbox"
                                value="4"
                                {...register("bus_point_4", {
                                  required: false,
                                })}
                              /> */}
                              <label className="form-check-label">
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
                          <td colSpan={4}>
                            
                          {employees_2.find((e) => e.updated_by)
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
                      type="submit"
                      className="btn btn-primary mt-2 float-right"
                    >
                      <i className="fas fa-save"> บันทึก</i>
                    </button>
                  </form>
                  <Link
                    to={"/admin/overtime"}
                    className="btn btn-danger mt-2 float-right mr-1"
                  >
                    <i className="fas fa-arrow-circle-left"></i> ย้อนกลับ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default busPrice;
