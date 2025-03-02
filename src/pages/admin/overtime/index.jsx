import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Badge } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import { Link, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const OverTimeAdmin = () => {
  //user login
  const userDatail = useAuthUser();

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [overtimes, setOvertimes] = useState([]);
  const [approver, setApprover] = useState("");
  const [startDate, setStartDate] = useState("");
  const [empcount, setEmpcount] = useState(0);
  const [emptotal, setEmptotal] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState(overtimes.slice(0, pageSize));

  const getData = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    // get ot requrst data from dept by user login
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        //Change api name
        setOvertimes(res.data.data);
        setRecords(res.data.data.slice(from, to));
        setLoading(false);
        //setEmpcount(res.data.data.employees.length);

        // Calculate the number of employees for each ot_member_id
        const employeeCounts = res.data.data.reduce((acc, otrequest) => {
          acc[otrequest.ot_member_id] = otrequest.employees.length;
          return acc;
        }, {});

        // Calculate the total number of employees
        const totalEmployees = res.data.data.reduce(
          (acc, otrequest) => acc + otrequest.employees.length,
          0
        );
        setEmpcount(employeeCounts);
        setEmptotal(totalEmployees);
      });
  };

  //filter function by ot code
  const codeFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        const code = res.data.data.filter((ot) =>
          ot.ot_member_id.includes(key)
        );
        setOvertimes(code);
        setRecords(code.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by department name
  const agencyFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        const controller = res.data.data.filter((ot) =>
          ot.department.includes(key)
        );
        setOvertimes(controller);
        setRecords(controller.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by dept name
  const departmentFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        const controller = res.data.data.filter((ot) => ot.dept.includes(key));
        setOvertimes(controller);
        setRecords(controller.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by result
  const resultFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        const controller = res.data.data.filter((ot) =>
          ot.result.includes(key)
        );
        setOvertimes(controller);
        setRecords(controller.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by status
  const statusFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(`${import.meta.env.VITE_API_KEY}/api/otrequests`)
      .then((res) => {
        const status = res.data.data.filter((ot) => ot.status.includes(key));
        setOvertimes(status);
        setRecords(status.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by date
  const dateFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(`${import.meta.env.VITE_API_KEY}/api/otrequests`)
      .then((res) => {
        setStartDate(key);
        const date_time = res.data.data.filter((ot) => ot.ot_date === key);
        setOvertimes(date_time);
        setRecords(date_time.slice(from, to));
        setSelectDate(key);
        setLoading(false);
      });
    console.log(overtimes);
  };

  useEffect(() => {
    getData();
    getApprover();
  }, [page, pageSize]);

  // Approver 2 update status
  const handleApproverSubmit2 = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการอนุมัติ OT",
      text: "คุณต้องการอนุมัติคำร้อง OT ใช่ไหม",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "ระบบได้ทำการอนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        setLoading(true);
        axios
          .put(
            import.meta.env.VITE_API_KEY +
              "/api/otrequest-approve2/" +
              blogs.id,
            data
          )
          .then((res) => {
            console.log(res);
            getData();
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  // Approver 3 update status
  const handleApproverSubmit3 = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการอนุมัติ OT",
      text: "คุณต้องการอนุมัติคำร้อง OT ใช่ไหม",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "ระบบได้ทำการอนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        setLoading(true);
        axios
          .put(
            import.meta.env.VITE_API_KEY +
              "/api/otrequest-approve3/" +
              blogs.id,
            data
          )
          .then((res) => {
            console.log(res);
            getData();
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  // Approver 4 update status
  const handleApproverSubmit4 = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการอนุมัติ OT",
      text: "คุณต้องการอนุมัติคำร้อง OT ใช่ไหม",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "ระบบได้ทำการอนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        setLoading(true);
        axios
          .put(
            import.meta.env.VITE_API_KEY +
              "/api/otrequest-approve4/" +
              blogs.id,
            data
          )
          .then((res) => {
            console.log(res);
            getData();
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  // Approver 5 update status
  const handleApproverSubmit5 = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการอนุมัติ OT",
      text: "คุณต้องการอนุมัติคำร้อง OT ใช่ไหม",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "ระบบได้ทำการอนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        axios
          .put(
            import.meta.env.VITE_API_KEY +
              "/api/otrequest-approve5/" +
              blogs.id,
            data
          )
          .then((res) => {
            console.log(res);
            getData();
            Swal.fire({
              icon: "success",
              title: "Your OT request has been status update",
              showConfirmButton: false,
              timer: 2000,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  // Approver 6 update status
  const handleApproverSubmit6 = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการอนุมัติ OT",
      text: "คุณต้องการอนุมัติคำร้อง OT ใช่ไหม",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "ระบบได้ทำการอนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        axios
          .put(
            import.meta.env.VITE_API_KEY +
              "/api/otrequest-approve6/" +
              blogs.id,
            data
          )
          .then((res) => {
            console.log(res);
            getData();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const handleRejectSubmit = async (blogs, data) => {
    await Swal.fire({
      title: "ยืนยันการไม่อนุมัติ OT",
      text: "คุณไม่ต้องการอนุมัติคำร้อง OT ใช่ไหม",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "error",
          title: "ระบบได้ทำการไม่อนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        axios
          .put(
            import.meta.env.VITE_API_KEY + "/api/otrequest-reject/" + blogs.id,
            data
          )
          .then((res) => {
            console.log(res);
            getData();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = "_" + month + "_" + date + "_" + year;
  const [selectDate, setSelectDate] = useState("");

  // text export function
  const textExport = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_KEY +
          "/api/otrequest-text-export?data=" +
          selectDate,
        { responseType: "blob" }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "text/plain" });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ot_request_" + currentDate + ".txt");
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      //alert('Failed to export data. Please try again.');
    }
  };

  const getApprover = async () => {
    await axios
      .get(
        import.meta.env.VITE_API_KEY +
          "/api/approve-role?data=" +
          userDatail().dept
      )
      .then((res) => {
        setApprover(res.data.approver);
      });
  };

  console.log(selectDate);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">การขออนุมัติ OT ทั้งหมด</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to={"/"}>หน้าหลัก</Link>
                  </li>
                  <li className="breadcrumb-item active">การขออนุมัติ</li>
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
                      <div className="col-12">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="float-right">
                              <Link
                                to={"/admin/overtime/busprice"}
                                className="btn btn-info mb-2 mr-1"
                              >
                                <i className="fas fa-truck"></i> การจัดรถ
                              </Link>
                              <button
                                onClick={textExport}
                                className="btn btn-secondary mb-2"
                              >
                                <i className="fas fa-download"></i> ดึงข้อมูล
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">เลขที่คำร้อง</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="กรุณากรอกข้อมูล"
                                    onChange={(event) =>
                                      codeFilter(event.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">หน่วยงาน</label>
                                  <input
                                    placeholder="กรุณากรอกข้อมูล"
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                      agencyFilter(event.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">ฝ่ายงาน</label>
                                  <input
                                    placeholder="กรุณากรอกข้อมูล"
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                      departmentFilter(event.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">สถานะการอนุมัติ</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                      statusFilter(event.target.value)
                                    }
                                  >
                                    <option defaultValue="">
                                      กรุณาเลือกข้อมูล
                                    </option>
                                    <option value="รอการอนุมัติ">
                                      รอการอนุมัติ
                                    </option>
                                    <option value="ผ่านการอนุมัติ">
                                      ผ่านการอนุมัติ
                                    </option>
                                    <option value="ไม่ผ่านการอนุมัติ">
                                      ไม่ผ่านการอนุมัติ
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">สถานะรายงาน</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                      resultFilter(event.target.value)
                                    }
                                  >
                                    <option defaultValue="">
                                      กรุณาเลือกข้อมูล
                                    </option>
                                    <option value="รอการรายงาน">
                                      รอการรายงาน
                                    </option>
                                    <option value="รอการปิด (ส่วน)">
                                      รอการปิด (ส่วน)
                                    </option>
                                    <option value="รอการปิด (ผจก)">
                                      รอการปิด (ผจก)
                                    </option>
                                    <option value="ปิดการรายงาน">
                                      ปิดการรายงาน
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">วันที่จัดทำ</label>
                                  <br />
                                  <DatePicker
                                    //showIcon
                                    //icon="fa fa-calendar"
                                    style={{ width: "100%" }} // กำหนดความกว้างตรงๆ
                                    //wrapperClassName="w-100" // ใช้ class ควบคุม wrapper
                                    className="form-control"
                                    //isClearable
                                    placeholderText="กรุณาเลือกวันที่"
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
                    </div>
                    <DataTable
                      style={{
                        fontFamily: "Prompt",
                      }}
                      withBorder
                      highlightOnHover
                      fontSize={"md"}
                      verticalSpacing="md"
                      paginationSize="md"
                      withColumnBorders
                      fetching={loading}
                      idAccessor="id"
                      columns={[
                        {
                          accessor: "index",
                          title: "#",
                          textAlignment: "center",
                          width: 80,
                          render: (record) => records.indexOf(record) + 1,
                        },
                        {
                          accessor: "ot_member_id",
                          title: "เลขที่คำร้อง",
                          textAlignment: "center",
                        },
                        {
                          accessor: "create_name",
                          title: "ผู้ควบคุมงาน",
                          textAlignment: "center",
                        },

                        {
                          accessor: "department",
                          title: "หน่วยงาน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "dept",
                          title: "ฝ่ายงาน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "status",
                          title: "สถานะการอนุมัติ",
                          textAlignment: "center",
                          render: ({ status }) => (
                            <>
                              <h5>
                                {status === "รอการอนุมัติ 1" ? (
                                  <Badge bg="warning">
                                    <span className="text-white">{status}</span>
                                  </Badge>
                                ) : status === "รอการอนุมัติ 2" ? (
                                  <Badge bg="secondary">
                                    <span className="text-white">{status}</span>
                                  </Badge>
                                ) : status === "รอการอนุมัติ 3" ? (
                                  <Badge bg="primary">
                                    <span className="text-white">{status}</span>
                                  </Badge>
                                ) : status === "ผ่านการอนุมัติ" ? (
                                  <Badge bg="success">
                                    <span>{status}</span>
                                  </Badge>
                                ) : (
                                  <Badge bg="danger">ไม่ผ่านการอนุมัติ</Badge>
                                )}
                              </h5>
                            </>
                          ),
                        },
                        {
                          accessor: "result",
                          title: "สถานะรายงาน",
                          textAlignment: "center",
                          render: ({ result }) => (
                            <>
                              <h5>
                                {result === "รอการรายงาน" ? (
                                  <Badge bg="warning">
                                    <span className="text-white">{result}</span>
                                  </Badge>
                                ) : result === "รอการปิด (ส่วน)" ? (
                                  <Badge bg="secondary">
                                    <span className="text-white">{result}</span>
                                  </Badge>
                                ) : result === "รอการปิด (ผจก)" ? (
                                  <Badge bg="primary">
                                    <span className="text-white">{result}</span>
                                  </Badge>
                                ) : result === "ปิดการรายงาน" ? (
                                  <Badge bg="success">
                                    <span>{result}</span>
                                  </Badge>
                                ) : (
                                  <Badge bg="danger">
                                    <span>{result}</span>
                                  </Badge>
                                )}
                              </h5>
                            </>
                          ),
                        },
                        {
                          accessor: "start_date",
                          title: "เวลาที่ OT",
                          textAlignment: "center",
                        },
                        {
                          accessor: "ot_date",
                          title: "วันที่ทำ OT",
                          textAlignment: "center",
                          render: ({ ot_date }) =>
                            dayjs(ot_date).format("DD-MM-YYYY"),
                        },
                        {
                          accessor: "employee_count",
                          title: "จำนวน(คน)",
                          textAlignment: "center",
                          render: (row) => (
                            <span>{empcount[row.ot_member_id]}</span>
                          ),
                          //footer: `${emptotal}`,
                        },
                        {
                          accessor: "otrequests",
                          title: "จุดรถรับส่ง",
                          textAlignment: "center",
                          render: (otrequests) => (
                            <span>
                              {otrequests.employees.map((e, index) =>
                                index === 0 ? e.bus_point_1 : null
                              )}{" "}
                              : {""}
                              {otrequests.employees.map((e, index) =>
                                index === 0 ? e.bus_point_2 : null
                              )}{" "}
                              : {""}
                              {otrequests.employees.map((e, index) =>
                                index === 0 ? e.bus_point_3 : null
                              )}{" "}
                              : {""}
                              {otrequests.employees.map((e, index) =>
                                index === 0 ? e.bus_point_4 : null
                              )}
                            </span>
                          ),
                        },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "ดำเนินการ",
                          render: (blogs) => (
                            <>
                              <Link
                                to={"/admin/overtime/view/" + blogs.id}
                                className="btn btn-primary"
                              >
                                <i className="fas fa-bars"></i>
                              </Link>{" "}
                              <div hidden>
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleApproverSubmit2(blogs)}
                                  // hidden={
                                  //   userDatail().role === "approver_1"
                                  //     ? false
                                  //     : true
                                  // }
                                  disabled={
                                    blogs.status === "รอการอนุมัติ 1"
                                      ? false
                                      : true
                                  }
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleApproverSubmit3(blogs)}
                                  // hidden={
                                  //   userDatail().role === "approver_2"
                                  //     ? false
                                  //     : true
                                  // }
                                  disabled={
                                    blogs.status === "รอการอนุมัติ 2"
                                      ? false
                                      : true
                                  }
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleApproverSubmit4(blogs)}
                                  // hidden={
                                  //   userDatail().role === "approver_3"
                                  //     ? false
                                  //     : true
                                  // }
                                  disabled={
                                    blogs.status === "รอการอนุมัติ 3"
                                      ? false
                                      : true
                                  }
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-warning text-white"
                                  onClick={() => handleApproverSubmit5(blogs)}
                                  // hidden={
                                  //   userDatail().role === "approver_2"
                                  //     ? false
                                  //     : true
                                  // }
                                  disabled={
                                    blogs.result === "รอการปิด (ส่วน)"
                                      ? false
                                      : true
                                  }
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-warning text-white"
                                  onClick={() => handleApproverSubmit6(blogs)}
                                  // hidden={
                                  //   userDatail().role === "approver_3"
                                  //     ? false
                                  //     : true
                                  // }
                                  disabled={
                                    blogs.result === "รอการปิด (ผจก)"
                                      ? false
                                      : true
                                  }
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleRejectSubmit(blogs)}
                                  // disabled={
                                  //   blogs.status === "รอการอนุมัติ 2"
                                  //     ? false
                                  //     : true
                                  // }
                                >
                                  <i className="fas fa-times-circle"></i>{" "}
                                </button>
                              </div>
                            </>
                          ),
                        },
                      ]}
                      records={records}
                      minHeight={200}
                      totalRecords={overtimes.length}
                      recordsPerPage={pageSize}
                      page={page}
                      onPageChange={(p) => setPage(p)}
                      recordsPerPageOptions={PAGE_SIZES}
                      onRecordsPerPageChange={setPageSize}
                    />
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

export default OverTimeAdmin;
