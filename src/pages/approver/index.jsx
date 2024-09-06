import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Badge } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const Approver = () => {
  //user login
  const userDatail = useAuthUser();

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [overtimes, setOvertimes] = useState([]);
  const [approver, setApprover] = useState([]);

  const [selectedRecords, setSelectedRecords] = useState([]);

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
      .get(
        import.meta.env.VITE_API_KEY +
          "/api/otrequests-dept?data=" +
          userDatail().dept
      )
      .then((res) => {
        //Change api name
        setOvertimes(res.data.otrequests);
        setRecords(res.data.otrequests.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by ot code
  const codeFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        import.meta.env.VITE_API_KEY + "/api/otrequests-filter-code?data=" + key
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
        import.meta.env.VITE_API_KEY + "/api/otrequests-filter-name?data=" + key
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
        import.meta.env.VITE_API_KEY +
          "/api/otrequests-filter-department?data=" +
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
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-status?dept=${
          userDatail().dept
        }&data=${key}`
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
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-date?dept=${
          userDatail().dept
        }&data=${key}`
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
  }, [page, pageSize, selectedRecords]);

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

  const handleRejectSubmit = async (blogs) => {
    await Swal.fire({
      title: "ยืนยันการไม่อนุมัติ OT",
      text: "กรุณากรอกเหตุผล หากท่านไม่ต้องการอนุมัติ ",
      icon: "error",
      // input: "text",
      // inputValidator: (value) => {
      //   if (!value) {
      //     return 'You need to write something!';
      //   }
      // },
      //inputPlaceholder: "Enter your text here",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "error",
          title: "ระบบได้ทำการไม่อนุมัติ OT เรียบร้อยแล้ว ",
          showConfirmButton: false,
          timer: 2000,
        });
        setLoading(true);
        axios
          .put(
            import.meta.env.VITE_API_KEY + "/api/otrequest-reject/" + blogs.id
            // data, {text:value}
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

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = "_" + month + "_" + date + "_" + year;

  // Text export function
  const textExport = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_KEY + "/api/otrequest-export",
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
      .get(
        import.meta.env.VITE_API_KEY +
          "/api/approve-role?data=" +
          userDatail().dept
      )
      .then((res) => {
        setApprover(res.data.approver);
      });
  };

  // Approve all by selected
  const handleApproveAll = async (data) => {

    const selected = selectedRecords.map((r) => r.id);

    console.log(selected);

    await axios
      .put(
        import.meta.env.VITE_API_KEY + "/api/otrequest-approve-all/" +  selected,data
      )
      .then((res) => {
        console.log(res);
        getData();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
                    <a href="#">หน้าหลัก</a>
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
                      <div className="col-lg-12">
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-3">
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

                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">ผู้ควบคุมงาน</label>
                                  <input
                                    placeholder="กรุณากรอกข้อมูล"
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                      nameFilter(event.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-md-3">
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
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">วันที่จัดทำ</label>
                                  {/* <DatePicker/> */}
                                  <input
                                    type="date"
                                    className="form-control"
                                    onChange={(event) =>
                                      dateFilter(
                                        dayjs(event.target.value).format(
                                          "YYYY-MM-DD"
                                        )
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <button
                                  onClick={handleApproveAll}
                                  disabled={selectedRecords.length === 0}
                                  className="btn btn-info"
                                >
                                  <i className="fas fa-check-circle"></i>{" "}
                                  Approve
                                </button>
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
                          accessor: "dept",
                          title: "แผนก",
                          textAlignment: "center",
                        },
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
                          accessor: "ot_date",
                          title: "วันที่ทำ OT",
                          textAlignment: "center",
                          render: ({ ot_date }) =>
                            dayjs(ot_date).format("DD-MM-YYYY"),
                        },
                        // {
                        //   accessor: "start_date",
                        //   title: "เวลาเริ่มต้น",
                        //   textAlignment: "center",
                        //   render: ({ start_date }) => start_date + " น.",
                        // },
                        // {
                        //   accessor: "end_date",
                        //   title: "เวลาสิ้นสุด",
                        //   textAlignment: "center",
                        //   render: ({ end_date }) => end_date + " น.",
                        // },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "ดำเนินการ",
                          render: (blogs) => (
                            <>
                              <Link
                                to={"/approver/view/" + blogs.id}
                                className="btn btn-primary"
                              >
                                <i className="fas fa-bars"></i>
                              </Link>{" "}
                              <button
                                className="btn btn-success"
                                onClick={() => handleApproverSubmit2(blogs)}
                                hidden={
                                  userDatail().role === "approver_1"
                                    ? false
                                    : true
                                }
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
                                hidden={
                                  userDatail().role === "approver_2"
                                    ? false
                                    : true
                                }
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
                                hidden={
                                  userDatail().role === "approver_3"
                                    ? false
                                    : true
                                }
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
                                hidden={
                                  userDatail().role === "approver_1"
                                    ? false
                                    : true
                                }
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
                                hidden={
                                  userDatail().role === "approver_2"
                                    ? false
                                    : true
                                }
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
                                disabled={
                                  blogs.status !== "ผ่านการอนุมัติ"
                                    ? false
                                    : true
                                }
                              >
                                <i className="fas fa-times-circle"></i>{" "}
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
                      selectedRecords={selectedRecords}
                      onSelectedRecordsChange={setSelectedRecords}
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

export default Approver;
