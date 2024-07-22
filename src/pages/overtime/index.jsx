import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Badge } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const Overtime = () => {
  //user login
  const userDatail = useAuthUser();

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [overtimes, setOvertimes] = useState([]);
  const [approver, setApprover] = useState([]);

  const [d, setDate] = useState(new Date());

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState(overtimes.slice(0, pageSize));

  const getData = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get("http://localhost/laravel_auth_jwt_api/public/api/otrequests")
      .then((res) => {
        //Change api name
        setOvertimes(res.data.data);
        setRecords(res.data.data.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by ot code
  const codeFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-filter-code?data=" +
          key
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        console.log(overtimes);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by department name
  const nameFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-filter-name?data=" +
          key
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        console.log(overtimes);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by department
  const departmentFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-filter-department?data=" +
          key
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        console.log(overtimes);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by status
  const statusFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-filter-status?data=" +
          key
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        console.log(overtimes);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by date
  const dateFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequests-filter-date?data=" +
          key
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        console.log(overtimes);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
    getApprover();
  }, [page, pageSize]);

  const hanldeDelete = (blogs) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Your blog has been deleted",
          showConfirmButton: false,
          timer: 2000,
        });
        axios
          .delete(
            "http://localhost/laravel_auth_jwt_api/public/api/otrequest-delete/" +
              blogs.id
          )
          .then((res) => {
            console.log(res);
            getData();
          });
      }
    });
  };

  const handleApproverSubmit = async (blogs, data) => {
    await axios
      .put(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequest-approve/" +
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
  };

  const handleRejectSubmit = async (blogs, data) => {
    await axios
      .put(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequest-reject/" +
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
  };

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = "_" + month + "_" + date + "_" + year;

  // Text export function
  const textExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost/laravel_auth_jwt_api/public/api/otrequest-export",
        { responseType: "blob" }
      );
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "text/plain" });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ot_request_export" + currentDate + ".txt");
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
      .get("http://localhost/laravel_auth_jwt_api/public/api/approve-role?data="+userDatail().dept)
      .then((res) => {
        setApprover(res.data.approver);
      });
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">คำร้องขออนุมัติ OT ทั้งหมด</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item active">คำร้องขออนุมัติ OT</li>
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
                        <div className="float-right">
                          <button
                            onClick={textExport}
                            className="btn btn-secondary mb-3"
                          >
                            <i className="fas fa-download"></i> ดึงข้อมูล
                          </button>{" "}
                          <Link
                            to={"/overtime/create"}
                            className="btn btn-success mb-3"
                          >
                            <i className="fa fa-plus"></i> คำร้องใหม่
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">เลขที่ใบคำร้อง</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="กรุณากรอกเลขที่ใบคำร้อง"
                                    onChange={(event) =>
                                      codeFilter(event.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">ผู้ควบคุมงาน</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                    nameFilter(event.target.value)
                                    }
                                  >
                                    <option value="">กรุณาเลือกผู้ควบคุมงาน</option>
                                    {approver.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.app_name_1}
                                      >
                                        {item.app_name_1}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              
                              
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">หน่วยงาน</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                      departmentFilter(event.target.value)
                                    }
                                  >
                                    <option value="">กรุณาเลือกหน่วยงาน</option>
                                    {approver.map((item) => (
                                      <option
                                        key={item.id}
                                        value={item.agency}
                                      >
                                        {item.agency}
                                      </option>
                                    ))}
                                  </select>
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
                                      กรุณาเลือกสถานะการอนุมัติ
                                    </option>
                                    <option value="รออนุมัติ">
                                      รออนุมัติ
                                    </option>
                                    <option value="อนุมัติ">อนุมัติ</option>
                                    <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">วันที่จัดทำ</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    onChange={(event) => dateFilter(dayjs(event.target.value).format("YYYY-MM-DD"))}
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
                          title: "เลขที่ใบคำร้อง",
                          textAlignment: "center",
                        },
                        { accessor: "department_name", title: "ผู้จัดการฝ่าย",textAlignment: "center", },
                        {
                          accessor: "department",
                          title: "หน่วยงาน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "status",
                          title: "สถานะการอนุมัติ",
                          textAlignment: "center",
                          render: ({ status }) => (
                            <>
                              <h5>
                                {status === "อนุมัติ" ? (
                                  <Badge bg="success">{status}</Badge>
                                ) : status === "ไม่อนุมัติ" ? (
                                  <Badge bg="danger">{status}</Badge>
                                ) : (
                                  <Badge bg="primary">{status}</Badge>
                                )}
                              </h5>
                            </>
                          ),
                        },
                        {
                          accessor: "created_at",
                          title: "วันที่จัดทำ",
                          textAlignment: "center",
                          render: ({ created_at }) =>
                            dayjs(created_at).format("DD-MM-YYYY"),
                        },
                        {
                          accessor: "start_date",
                          title: "เวลาเริ่มต้น",
                          textAlignment: "center",
                          render:({start_date})=>start_date +' น.'
                        },
                        {
                          accessor: "end_date",
                          title: "เวลาสิ้นสุด",
                          textAlignment: "center",
                          render:({end_date})=>end_date +' น.',
                        },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "ดำเนินการ",
                          render: (blogs) => (
                            <>
                              <Link
                                to={"/overtime/view/" + blogs.id}
                                className="btn btn-info"
                              >
                                ดูข้อมูล
                              </Link>{" "}
                              <Link
                                to={"/overtime/edit/" + blogs.id}
                                className="btn btn-primary"
                              >
                                รายงานผล
                              </Link>{" "}
                              {/* <button
                                className="btn btn-danger"
                                onClick={() => hanldeDelete(blogs)}
                              >
                                ลบ
                              </button> */}
                              <button
                                className="btn btn-success"
                                onClick={() => handleApproverSubmit(blogs)}
                                // disbled button then status = In progress
                                disabled={
                                  blogs.status === "รออนุมัติ" ? false : true
                                }
                              >
                                อนุมัติ
                              </button>{" "}
                              <button
                                className="btn btn-danger"
                                onClick={() => handleRejectSubmit(blogs)}
                                // disbled button then status = In progress
                                disabled={
                                  blogs.status === "รออนุมัติ" ? false : true
                                }
                              >
                                ไม่อนุมัติ
                              </button>
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

export default Overtime;
