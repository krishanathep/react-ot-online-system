import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Badge } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import Swal from "sweetalert2";
import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const Overtime = () => {
  //user login
  const userDatail = useAuthUser();

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [overtimes, setOvertimes] = useState([]);

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
      .get(
        "https://full-stack-app.com/laravel_auth_jwt_api/public/api/ksssystems"
      )
      .then((res) => {
        //Change api name
        setOvertimes(res.data.ksssystems);
        setRecords(res.data.ksssystems.slice(from, to));
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
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
            "https://full-stack-app.com/laravel_auth_jwt_api/public/api/ksssystem-delete/" +
              blogs.id
          )
          .then((res) => {
            console.log(res);
            getData();
          });
      }
    });
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Overtime list</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Overtime</li>
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
                          >
                            <i className="fa fa-plus"></i> Create
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-2">
                                <div className="form-group">
                                  {/* <label htmlFor="">เลขที่ใบคำร้อง</label> */}
                                  <input className="form-control" type="text" placeholder="เลขที่ใบคำร้อง"/>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  {/* <label htmlFor="">ผู้ควบคุมงาน</label> */}
                                  <input className="form-control" type="text" placeholder="ผู้ควบคุมงาน"/>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  {/* <label htmlFor="">สถานะการอนุมัติ</label> */}
                                  <input className="form-control" type="text" placeholder="หน่วยงาน"/>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  {/* <label htmlFor="">วันที่จัดทำ</label> */}
                                  <input className="form-control" type="text" placeholder="สถานะการอนุมัติ"/>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  {/* <label htmlFor="">วันที่จัดทำ</label> */}
                                  <input className="form-control" type="text" placeholder="วันที่เริ่มต้น"/>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  {/* <label htmlFor="">วันที่จัดทำ</label> */}
                                  <input className="form-control" type="text" placeholder="วันที่สิ้นสุด"/>
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
                      idAccessor="_id"
                      columns={[
                        {
                          accessor: "index",
                          title: "#",
                          textAlignment: "center",
                          width: 80,
                          render: (record) => records.indexOf(record) + 1,
                        },
                        {
                          accessor: "title",
                          title: "เลขที่ใบคำร้อง",
                        },
                        { accessor: "objective", title: "ผู้ควบคุมงาน" },
                        {
                          accessor: "suggest_type",
                          title: "หน่วย / ส่วน / ฝ่าย",
                        },
                        {
                          accessor: "status",
                          title: "สถานะการอนุมัติ",
                          textAlignment: "center",
                          render: ({ status }) => (
                            <>
                              <h5>
                                {status === "Approved" ? (
                                  <Badge bg="success">{status}</Badge>
                                ) : status === "Rejected" ? (
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
                          title: "วันที่เริ่มต้น",
                          textAlignment: "center",
                          render: ({ created_at }) =>
                            dayjs(created_at).format("DD-MMM-YYYY"),
                        },
                        {
                          accessor: "created_at",
                          title: "วันที่สิ้นสุด",
                          textAlignment: "center",
                          render: ({ updated_at }) =>
                            dayjs(updated_at).format("DD-MMM-YYYY"),
                        },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "Actions",
                          width: 300,
                          render: (blogs) => (
                            <>
                              <Link
                                to={"/overtime/view/" + blogs.id}
                                className="btn btn-info"
                              >
                                View
                              </Link>{" "}
                              <Link
                                to={"/overtime/edit/" + blogs.id}
                                className="btn btn-primary"
                              >
                                Edit
                              </Link>{" "}
                              <button
                                className="btn btn-danger"
                                onClick={() => hanldeDelete(blogs)}
                              >
                                Delete
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
