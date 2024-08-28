import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Badge } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const OfficeCar = () => {
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

    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        setOvertimes(res.data.data);
        setRecords(res.data.data.slice(from, to));
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
                                <DatePicker
                                  showIcon
                                  //icon="fa fa-calendar"
                                  className="form-control"
                                  //isClearable
                                  placeholderText="ค้นหาตามวันที่"
                                  selected={startDate}
                                  onChange={(date) => {
                                    setStartDate(date);
                                    dateFilter(
                                      dayjs(date).format("YYYY-MM-DD")
                                    );
                                  }}
                                  dateFormat="dd-MM-yyyy"
                                />{" "} 
                              </div>
                              <div className="col-md-9">
                              <div className="float-right">
                              <Link to='/officecar/managecar' className="btn btn-success">
                                  <i className="fas fa-edit"></i> จัดการรถรับส่ง
                                </Link>
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
                        // {
                        //   accessor: "dept",
                        //   title: "แผนก",
                        //   textAlignment: "center",
                        // },
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
                        {
                          accessor: "end_date",
                          title: "เวลาสิ้นสุด",
                          textAlignment: "center",
                          render: ({ end_date }) => (
                            <>
                              {end_date === "20.00" ? (
                                <>
                                  <Badge bg="success">{end_date}</Badge>
                                </>
                              ) : end_date === "22.00" ? (
                                <>
                                  <Badge bg="success">{end_date}</Badge>
                                </>
                              ) : (
                                end_date
                              )}
                            </>
                          ),
                        },
                        {
                          accessor: "bus_point_1",
                          title: "จุดรถรับส่ง",
                          textAlignment: "center",
                          render: ({
                            bus_point_1,
                            bus_point_2,
                            bus_point_3,
                            bus_point_4,
                          }) => (
                            <span>
                              {bus_point_1} : {bus_point_2} : {bus_point_3} :{" "}
                              {bus_point_4}
                            </span>
                          ),
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
                        // {
                        //   accessor: "actions",
                        //   textAlignment: "center",
                        //   title: "ดำเนินการ",
                        //   render: (blogs) => (
                        //     <>
                        //       {/* <Link
                        //         to={"/officecar/edit/" + blogs.id}
                        //         className="btn btn-primary"
                        //       >
                        //         <i className="fas fa-bars"></i>
                        //       </Link>{" "} */}
                        //       <Link
                        //         to={"/officecar/edit/" + blogs.id}
                        //         className="btn btn-info"
                        //       >
                        //         <i className="fas fa-edit"></i>
                        //       </Link>{" "}
                        //     </>
                        //   ),
                        // },
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

export default OfficeCar;
