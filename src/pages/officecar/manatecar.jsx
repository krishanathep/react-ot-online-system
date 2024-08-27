import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
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
    defaultValues: {
      test: [{}],
    },
  });


  const [priceID, setPieceID] = useState("");

  const navigate = useNavigate();

  const [busPrice, setBusPrice] = useState(30);

  const [overtimes, setOvertimes] = useState([]);
  const [startDate, setStartDate] = useState(
    new dayjs(Date()).format("YYYY-MM-DD")
  );

  const getData = async () => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        const ot =  res.data.data.filter(
          (i) =>
            (i.ot_date === startDate && i.end_date === "20.00") ||
            (i.ot_date === startDate && i.end_date === "22.00")
        )
        setOvertimes(ot);
        setPieceID(
          ot.filter((o, index) => index === 0).map((ot, index) => ot.id)
        );
      });
  };

  const dateFilter = async (date) => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        const ot = res.data.data.filter(
          (i) =>
            (i.ot_date === date && i.end_date === "20.00") ||
            (i.ot_date === date && i.end_date === "22.00")
        );
        setOvertimes(ot);
        setPieceID(
          ot.filter((o, index) => index === 0).map((ot, index) => ot.id)
        );
      });
  };

  const handleUpdateSubmit = async (data) => {
    alert(JSON.stringify(data) + "id" + priceID);

    await axios
      .put(
        import.meta.env.VITE_API_KEY + "/api/otrequest-update-point/" + priceID,
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
        navigate("/officecar");
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
              <div className="col-lg-12">
                <div className="card card-outline card-primary">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12">
                                <b>วันที่ทำ OT : </b>
                                <DatePicker
                                  className="form-control"
                                  showIcon
                                  placeholderText=" กรุณาเลือกวันที่"
                                  selected={startDate}
                                  onChange={(date) => {
                                    setStartDate(date);
                                    dateFilter(
                                      dayjs(date).format("YYYY-MM-DD")
                                    );
                                  }}
                                  dateFormat="dd-MM-yyyy"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        {overtimes.map((ot) => {
                          return (
                            <div
                              className="card shadow-none border"
                              key={ot.id}
                            >
                              <div className="card-body">
                                <table className="table table-borderless">
                                  <thead>
                                    <tr>
                                      <td>
                                        <b>เวลาที่ทำ OT : </b>
                                        <span>{ot.end_date}</span> น.
                                      </td>
                                    </tr>
                                  </thead>
                                </table>
                              </div>
                              <div className="col-md-12">
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
                                    </tr>
                                  </tbody>
                                </table>
                                <div className="col-md-12 mb-3">
                                  <span>
                                    <b>จุดรถรับ-ส่ง</b> 1. สายศาลายา 2.
                                    สายนครชัยศรี 3. สายหนองแขม 4. สายวงเวียนใหญ่
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div className="float-right">
                          <button
                            onClick={handleSubmit(handleUpdateSubmit)}
                            className="btn btn-primary"
                          >
                            <i className="fas fa-save"></i> ยืนยัน
                          </button>{" "}
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
        </div>
      </div>
    </>
  );
};

export default manageCar;
