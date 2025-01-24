import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Badge } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const Overtime = () => {
  //user login
  const userDatail = useAuthUser();

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [overtimes, setOvertimes] = useState([]);
  const [startDate, setStartDate] = useState("");

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
          "/api/otrequests-agency?data=" +
          userDatail().agency
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
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-code?dept=${
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

  //filter function by department name
  const nameFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-name?dept=${
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

  const handleDeleteSubmit = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการลบ OT",
      text: "คุณต้องการลบคำร้อง OT ใช่ไหม",
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
          title: "ระบบได้ทำการลบ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        //setLoading(true);
        axios
          .delete(
            import.meta.env.VITE_API_KEY + "/api/otrequest-delete/" + blogs.id,
            data
          )
          .then((res) => {
            console.log(res);
            getData();
            //setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  useEffect(() => {
    getData();
  }, [page, pageSize]);

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
                  <Link to={'/'}>หน้าหลัก</Link>
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
                      <div className="col-md-12">
                        <div className="float-right">
                          <Link
                            to={"/overtime/create"}
                            className="btn btn-success mb-2"
                            hidden={
                              userDatail().role === "approver" ? true : false
                            }
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
                                    className="form-control"
                                    id="sel1"
                                    placeholder="กรุณากรอกข้อมูล"
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
                              {/* <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">สถานะการรายงาน</label>
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
                                    <option value="รออนุมัติ">รออนุมัติ</option>
                                    <option value="อนุมัติ">อนุมัติ</option>
                                    <option value="ไม่อนุมัติ">
                                      ไม่อนุมัติ
                                    </option>
                                  </select>
                                </div>
                              </div> */}
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">วันที่จัดทำ</label>
                                  <br />
                                  <DatePicker
                                    //showIcon
                                    //icon="fa fa-calendar"
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
                          title: "สถานะการรายงาน",
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
                        // {
                        //   accessor: "#",
                        //   title: "จุดรถรับส่ง",
                        //   textAlignment: "center",
                        //   render: ({}) => (
                        //     <span>
                        //      {bus_point_1} : {bus_point_2} : {bus_point_3} : {bus_point_4}
                        //     </span>
                        //   ),
                        // },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "ดำเนินการ",
                          render: (blogs) => (
                            <>
                              <Link
                                to={"/overtime/view/" + blogs.id}
                                className="btn btn-primary"
                              >
                                <i className="fas fa-bars"></i>
                              </Link>{" "}
                              {blogs.result != "รอการรายงาน" ? (
                                <>
                                <button disabled className="btn btn-info">
                                    <i className="far fa-edit"></i>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <Link
                                    to={"/overtime/edit/" + blogs.id}
                                    className="btn btn-info"
                                  >
                                    <i className="far fa-edit"></i>
                                  </Link>
                                  
                                </>
                              )}{" "}
                              <button
                                onClick={() => handleDeleteSubmit(blogs)}
                                className="btn btn-danger"
                                disabled={
                                  blogs.status === "รอการอนุมัติ 1"
                                    ? false
                                    : true
                                }
                              >
                                <i className="far fa-trash-alt"></i>
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
