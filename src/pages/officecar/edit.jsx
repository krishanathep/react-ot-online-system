import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuthUser } from "react-auth-kit";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'

const manageCar = () => {
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

  const [loading,setLoading]=useState(false)

  const userDetail = useAuthUser();
  dayjs.extend(relativeTime);

  const [priceID_01, setPieceID_01] = useState("");
  const [priceID_02, setPieceID_02] = useState("");

  const navigate = useNavigate();

  const [overtimes_01, setOvertimes_01] = useState([]);
  const [overtimes_02, setOvertimes_02] = useState([]);

  const [startDate, setStartDate] = useState(
    new dayjs(Date()).format("YYYY-MM-DD")
  );

  const getData = async () => {
    setLoading(true)
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        const ot_01 = res.data.data.filter(
          (i) => i.ot_date === startDate && i.end_date === "20.00" || i.ot_date === startDate && i.end_date === "19.50"
        );
        const ot_02 = res.data.data.filter(
          (i) => i.ot_date === startDate && i.end_date === "22.00" || i.ot_date === startDate && i.end_date === "21.50"
        );
        setOvertimes_01(ot_01);
        setOvertimes_02(ot_02);

        setPieceID_01(
          ot_01.filter((o, index) => index === 0).map((ot, index) => ot.id)
        );
        setPieceID_02(
          ot_02.filter((o, index) => index === 0).map((ot, index) => ot.id)
        );
      });
      setLoading(false)
  };

  const dateFilter = async (date) => {
    setLoading(true)
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        const ot_01 = res.data.data.filter(
          (i) =>
            (i.ot_date === date && i.end_date === "20.00") ||
          i.ot_date === date && i.end_date === "19.50"
        );
        const ot_02 = res.data.data.filter(
          (i) =>
            (i.ot_date === date && i.end_date === "22.00") ||
          i.ot_date === date && i.end_date === "20.50"
        );
        setOvertimes_01(ot_01);
        setOvertimes_02(ot_02);

        setPieceID_01(
          ot_01.filter((o, index) => index === 0).map((ot, index) => ot.id)
        );
        setPieceID_02(
          ot_02.filter((o, index) => index === 0).map((ot, index) => ot.id)
        );
      });
      setLoading(false)
  };

  const submitCarPrice_01 = async (data) => {
    //alert(JSON.stringify(data) + "id" + priceID_01);

    await axios
      .put(
        import.meta.env.VITE_API_KEY +
          "/api/otrequest-update-point/" +
          priceID_01,
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
        //navigate("/officecar");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitCarPrice_02 = async (data) => {
    //alert(JSON.stringify(data) + "id" + priceID_02);

    await axios
      .put(
        import.meta.env.VITE_API_KEY +
          "/api/otrequest-update-point/" +
          priceID_02,
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
        //navigate("/officecar");
      })
      .catch((error) => {
        console.log(error);
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
                <h1 className="m-0">จัดการข้อมูลรถรับส่ง</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">รถรับส่งพนักงาน</li>
                  <li className="breadcrumb-item active">จัดการข้อมูล</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="col-md-12">
                      <b>วันที่ทำ OT : </b>
                      <DatePicker
                        className="form-control"
                        showIcon
                        placeholderText=" กรุณาเลือกวันที่"
                        selected={startDate}
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
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <h4>เวลา 19.50 น. - 20.00 น.</h4>
                        {overtimes_01.map((ot) => {
                          return (
                            <div
                              className="card shadow-none border"
                              key={ot.id}
                            >
                              <div className="card-body">
                               <div className="row">
                                <div className="col-md-4">
                                <b>หมายเลข : </b>
                                <span>{ot.ot_member_id}</span>{" "}
                                </div>
                                <div className="col-md-4">
                                <b>แก้ไขล่าสุด : </b>
                                <span>{dayjs(ot.updated_at).format("HH:mm:ss")}</span>{" "}น.
                                </div>
                                <div className="col-md-4">
                                <b>แก้ไขโดย : </b>
                                <span>{userDetail().name}</span>{" "}
                                </div>
                               </div>
                              </div>
                              <div className="col-md-12">
                                <form
                                  onSubmit={handleSubmit(submitCarPrice_01)}
                                >
                                  <table className="table table-bordered">
                                    <thead>
                                      <tr align={"center"}>
                                        <th>#</th>
                                        <th>รหัสพนักงาน</th>
                                        <th>ชื่อพนักงาน</th>
                                        <th>หน่วยงาน</th>
                                        <th>รถรับส่ง จุดที่ 1</th>
                                        <th>รถรับส่ง จุดที่ 2</th>
                                        <th>รถรับส่ง จุดที่ 3</th>
                                        <th>รถรับส่ง จุดที่ 4</th>
                                        <th>วันที่ทำ OT</th>
                                        <th>ค่าเดินทาง</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {ot.employees
                                        .filter((e) => e.bus_stations !== "no")
                                        .map((em, index) => {
                                          return (
                                            <tr align="center" key={em.id}>
                                              <td>{index + 1}</td>
                                              <td>{em.code}</td>
                                              <td>{em.emp_name}</td>
                                              <td>{ot.department}</td>
                                              <td>
                                                {em.bus_stations ===
                                                "จุดที่ 1" ? (
                                                  <i className="fas fa-map-marker-alt text-danger"></i>
                                                ) : (
                                                  ""
                                                )}
                                              </td>
                                              <td>
                                                {em.bus_stations ===
                                                "จุดที่ 2" ? (
                                                  <i className="fas fa-map-marker-alt text-danger"></i>
                                                ) : (
                                                  ""
                                                )}
                                              </td>
                                              <td>
                                                {em.bus_stations ===
                                                "จุดที่ 3" ? (
                                                  <i className="fas fa-map-marker-alt text-danger"></i>
                                                ) : (
                                                  ""
                                                )}
                                              </td>
                                              <td>
                                                {em.bus_stations ===
                                                "จุดที่ 4" ? (
                                                  <i className="fas fa-map-marker-alt text-danger"></i>
                                                ) : (
                                                  ""
                                                )}
                                              </td>
                                              <td>
                                                {dayjs(ot.ot_date).format(
                                                  "DD-MM-YYYY"
                                                )}
                                              </td>
                                              <td>
                                                {em.bus_stations ===
                                                  "จุดที่ 1" &&
                                                ot.bus_point_1 !== "0"
                                                  ? "0"
                                                  : em.bus_stations ===
                                                      "จุดที่ 2" &&
                                                    ot.bus_point_2 !== "0"
                                                  ? "0"
                                                  : em.bus_stations ===
                                                      "จุดที่ 3" &&
                                                    ot.bus_point_3 !== "0"
                                                  ? "0"
                                                  : em.bus_stations ===
                                                      "จุดที่ 4" &&
                                                    ot.bus_point_4 !== "0"
                                                  ? "0"
                                                  : "30"}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      <tr align="center">
                                        <td colSpan={"4"}>รวม (พนักงาน)</td>
                                        <td>
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value="1"
                                              {...register("bus_point_1", {
                                                required: false,
                                              })}
                                            />
                                            <label className="form-check-label">
                                              จำนวน{" "}
                                              {
                                                ot.employees.filter(
                                                  (e) =>
                                                    e.bus_stations ===
                                                    "จุดที่ 1"
                                                ).length
                                              }{" "}
                                              คน
                                            </label>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value="2"
                                              {...register("bus_point_2", {
                                                required: false,
                                              })}
                                            />
                                            <label className="form-check-label">
                                              จำนวน{" "}
                                              {
                                                ot.employees.filter(
                                                  (e) =>
                                                    e.bus_stations ===
                                                    "จุดที่ 2"
                                                ).length
                                              }{" "}
                                              คน
                                            </label>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value="3"
                                              {...register("bus_point_3", {
                                                required: false,
                                              })}
                                            />
                                            <label className="form-check-label">
                                              จำนวน{" "}
                                              {
                                                ot.employees.filter(
                                                  (e) =>
                                                    e.bus_stations ===
                                                    "จุดที่ 3"
                                                ).length
                                              }{" "}
                                              คน
                                            </label>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value="4"
                                              {...register("bus_point_4", {
                                                required: false,
                                              })}
                                            />
                                            <label className="form-check-label">
                                              จำนวน{" "}
                                              {
                                                ot.employees.filter(
                                                  (e) =>
                                                    e.bus_stations ===
                                                    "จุดที่ 4"
                                                ).length
                                              }{" "}
                                              คน
                                            </label>
                                          </div>
                                        </td>
                                        <td></td>
                                        <td>
                                          <button
                                            type="submit"
                                            className="btn btn-primary"
                                          >
                                            <i className="fas fa-save">
                                              {" "}
                                              บันทึก
                                            </i>
                                          </button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </form>
                              </div>
                            </div>
                          );
                        })}
                        <span>
                          <b>จุดรถรับ-ส่ง</b> 1. สายศาลายา 2. สายนครชัยศรี 3.
                          สายหนองแขม 4. สายวงเวียนใหญ่
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <h4>เวลา 21.50 น. - 22.00 น.</h4>
                    {overtimes_02.map((ot) => {
                      return (
                        <div
                          className="card shadow-none border mt-3"
                          key={ot.id}
                        >
                          <div className="card-body">
                               <div className="row">
                                <div className="col-md-4">
                                <b>หมายเลข : </b>
                                <span>{ot.ot_member_id}</span>{" "}
                                </div>
                                <div className="col-md-4">
                                <b>แก้ไขล่าสุด : </b>
                                <span>{dayjs(ot.updated_at).format("HH:mm:ss")}</span>{" "}น.
                                </div>
                                <div className="col-md-4">
                                <b>แก้ไขโดย : </b>
                                <span>{userDetail().name}</span>{" "}
                                </div>
                               </div>
                              </div>
                          <div className="col-md-12">
                            <form onSubmit={handleSubmit(submitCarPrice_02)}>
                              <table className="table table-bordered">
                                <thead>
                                  <tr align={"center"}>
                                    <th>#</th>
                                    <th>รหัสพนักงาน</th>
                                    <th>ชื่อพนักงาน</th>
                                    <th>หน่วยงาน</th>
                                    <th>รถรับส่ง จุดที่ 1</th>
                                    <th>รถรับส่ง จุดที่ 2</th>
                                    <th>รถรับส่ง จุดที่ 3</th>
                                    <th>รถรับส่ง จุดที่ 4</th>
                                    <th>วันที่ทำ OT</th>
                                    <th>ค่าเดินทาง</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ot.employees
                                    .filter((e) => e.bus_stations !== "no")
                                    .map((em, index) => {
                                      return (
                                        <tr align="center" key={em.id}>
                                          <td>{index + 1}</td>
                                          <td>{em.code}</td>
                                          <td>{em.emp_name}</td>
                                          <td>{ot.department}</td>
                                          <td>
                                            {em.bus_stations === "จุดที่ 1" ? (
                                              <i className="fas fa-map-marker-alt text-danger"></i>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                          <td>
                                            {em.bus_stations === "จุดที่ 2" ? (
                                              <i className="fas fa-map-marker-alt text-danger"></i>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                          <td>
                                            {em.bus_stations === "จุดที่ 3" ? (
                                              <i className="fas fa-map-marker-alt text-danger"></i>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                          <td>
                                            {em.bus_stations === "จุดที่ 4" ? (
                                              <i className="fas fa-map-marker-alt text-danger"></i>
                                            ) : (
                                              ""
                                            )}
                                          </td>
                                          <td>
                                            {dayjs(ot.ot_date).format(
                                              "DD-MM-YYYY"
                                            )}
                                          </td>
                                          <td>
                                            {em.bus_stations === "จุดที่ 1" &&
                                            ot.bus_point_1 !== "0"
                                              ? "0"
                                              : em.bus_stations ===
                                                  "จุดที่ 2" &&
                                                ot.bus_point_2 !== "0"
                                              ? "0"
                                              : em.bus_stations ===
                                                  "จุดที่ 3" &&
                                                ot.bus_point_3 !== "0"
                                              ? "0"
                                              : em.bus_stations ===
                                                  "จุดที่ 4" &&
                                                ot.bus_point_4 !== "0"
                                              ? "0"
                                              : "30"}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  <tr align="center">
                                    <td colSpan={"4"}>รวม (พนักงาน)</td>
                                    <td>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          value="1"
                                          {...register("bus_point_1", {
                                            required: false,
                                          })}
                                        />
                                        <label className="form-check-label">
                                          จำนวน{" "}
                                          {
                                            ot.employees.filter(
                                              (e) =>
                                                e.bus_stations === "จุดที่ 1"
                                            ).length
                                          }{" "}
                                          คน
                                        </label>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          value="2"
                                          {...register("bus_point_2", {
                                            required: false,
                                          })}
                                        />
                                        <label className="form-check-label">
                                          จำนวน{" "}
                                          {
                                            ot.employees.filter(
                                              (e) =>
                                                e.bus_stations === "จุดที่ 2"
                                            ).length
                                          }{" "}
                                          คน
                                        </label>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          value="3"
                                          {...register("bus_point_3", {
                                            required: false,
                                          })}
                                        />
                                        <label className="form-check-label">
                                          จำนวน{" "}
                                          {
                                            ot.employees.filter(
                                              (e) =>
                                                e.bus_stations === "จุดที่ 3"
                                            ).length
                                          }{" "}
                                          คน
                                        </label>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          value="4"
                                          {...register("bus_point_4", {
                                            required: false,
                                          })}
                                        />
                                        <label className="form-check-label">
                                          จำนวน{" "}
                                          {
                                            ot.employees.filter(
                                              (e) =>
                                                e.bus_stations === "จุดที่ 4"
                                            ).length
                                          }{" "}
                                          คน
                                        </label>
                                      </div>
                                    </td>
                                    <td></td>
                                    <td>
                                      {" "}
                                      <button
                                        type="submit"
                                        className="btn btn-primary"
                                      >
                                        <i className="fas fa-save"> บันทึก</i>
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </form>
                          </div>
                        </div>
                      );
                    })}{" "}
                    <div>
                      <span>
                        <b>จุดรถรับ-ส่ง</b> 1. สายศาลายา 2. สายนครชัยศรี 3.
                        สายหนองแขม 4. สายวงเวียนใหญ่
                      </span>
                    </div>
                    <div className="float-right">
                      <Link to={"/officecar"} className="btn btn-danger">
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
    </>
  );
};

export default manageCar;
