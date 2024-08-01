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
  } = useForm({});

  const { id } = useParams();
  const navigate = useNavigate();

  const [empcount, setEmpcount] = useState(0);
  const [overtimes, setOvertimes] = useState({});
  const [members, setMemebers] = useState([]);

  const[station_1, setStation_1] = useState(0)
  const[station_2, setStation_2] = useState(0)
  const[station_3, setStation_3] = useState(0)
  const[station_4, setStation_4] = useState(0)

  const getData = async () => {
    await axios
      .get("http://localhost/laravel_auth_jwt_api/public/api/otrequest/" + id)
      .then((res) => {
        setOvertimes(res.data.data);
        setMemebers(res.data.data.employees);
        setEmpcount(res.data.data.employees.length);
        setStation_1(res.data.data.employees.filter(item=>item.bus_stations==="จุดที่ 1").length)
        setStation_2(res.data.data.employees.filter(item=>item.bus_stations==="จุดที่ 2").length)
        setStation_3(res.data.data.employees.filter(item=>item.bus_stations==="จุดที่ 3").length)
        setStation_4(res.data.data.employees.filter(item=>item.bus_stations==="จุดที่ 4").length)
      });
  };

  const handleUpdateSubmit = async (data) => {
    //alert(JSON.stringify(data))
    await axios
    .put(
      "http://localhost/laravel_auth_jwt_api/public/api/otrequest-update-point/" +
        id,
      data
    )
    .then((res) => {
      Swal.fire({
        icon: "success",
        title: "Your Office Car has been updated",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/officecar");
      //console.log(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

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
                  <li className="breadcrumb-item active">
                    จัดการข้อมูล
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
                      <div className="col-md-12">
                        <div className="col-md-12">
                          <table className="table table-borderless">
                            <thead>
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
                                  <b>จำนวนพนักงาน</b> : {empcount} คน
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
                                <th>หน่วยงาน</th>
                                <th>รถรับส่ง จุดที่ 1</th>
                                <th>รถรับส่ง จุดที่ 2</th>
                                <th>รถรับส่ง จุดที่ 3</th>
                                <th>รถรับส่ง จุดที่ 4</th>
                                <th>ค่ารถ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {members.map((member, index) => {
                                return (
                                  <tr align="center" key={member.id}>
                                    <td>{index + 1}</td>
                                    <td>{member.code}</td>
                                    <td>{member.emp_name}</td>
                                    <td>{overtimes.department}</td>
                                    <td>
                                      {member.bus_stations === "จุดที่ 1" ? (
                                        <i className="fas fa-check text-success"></i>
                                      ) : (
                                        ''
                                      )}
                                    </td>
                                    <td>
                                      {member.bus_stations === "จุดที่ 2" ? (
                                        <i className="fas fa-check text-success"></i>
                                      ) : (
                                        ''
                                      )}
                                    </td>
                                    <td>
                                      {member.bus_stations === "จุดที่ 3" ? (
                                        <i className="fas fa-check text-success"></i>
                                      ) : (
                                        ''
                                      )}
                                    </td>
                                    <td>
                                      {member.bus_stations === "จุดที่ 4" ? (
                                        <i className="fas fa-check text-success"></i>
                                      ) : (
                                       ''
                                      )}
                                    </td>
                                    <td>
                                     {(overtimes.bus_point_1==="0"||overtimes.bus_point_2==="0"||overtimes.bus_point_3==="0"||overtimes.bus_point_4==="0")?('30'):('0')}
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr align="center">
                                <td colSpan={"4"}>
                                  รวมพนักงานที่ใช้บริการรถรับส่ง
                                </td>
                                <td>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value='1'
                                      {...register("bus_point_1", {
                                        required: false,
                                      })}
                                    />
                                    <label className="form-check-label">
                                      จำนวน {station_1} คน
                                    </label>
                                  </div>
                                </td>
                                <td>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value='2'
                                      {...register("bus_point_2", {
                                        required: false,
                                      })}
                                    />
                                    <label className="form-check-label">
                                      จำนวน {station_2} คน
                                    </label>
                                  </div>
                                </td>
                                <td>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value='3'
                                      {...register("bus_point_3", {
                                        required: false,
                                      })}
                                    />
                                    <label className="form-check-label">
                                      จำนวน {station_3} คน
                                    </label>
                                  </div>
                                </td>
                                <td>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value='4'
                                      {...register("bus_point_4", {
                                        required: false,
                                      })}
                                    />
                                    <label className="form-check-label">
                                      จำนวน {station_4} คน
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="col-md-12">
                            <span className="text-muted">
                              จุดลงรถรับ-ส่ง 1. สายศาลายา 2. สายนครชัยศรี 3.
                              สายหนองแขม 4. สายวงเวียนใหญ่
                            </span>
                          </div>
                        </div>
                        <div className="col-md-12 mt-3">
                          <div className="float-right">
                            <button onClick={handleSubmit(handleUpdateSubmit)} className="btn btn-primary">
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
      </div>
    </>
  );
};

export default edit;
