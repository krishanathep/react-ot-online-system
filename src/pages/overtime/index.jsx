import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Button, Badge } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import "react-datepicker/dist/react-datepicker.css";

import Swal from "sweetalert2";
import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const Overtime = () => {
    
  //user login
  const userDatail = useAuthUser();

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState(blogs.slice(0, pageSize));

  const getData = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        "https://full-stack-app.com/laravel_auth_jwt_api/public/api/ksssystems"
      )
      .then((res) => {
        setBlogs(res.data.ksssystems);
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
                          <button
                            className="btn btn-success mb-3"
                            
                          >
                            <i className="fa fa-plus"></i> Create
                          </button>
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
                          title: "หัวข้อเรื่อง",
                        },
                        { accessor: "objective", title: "วัตถุประสงค์" },
                        { accessor: "suggest_type", title: "ประเภทข้อเสนอแนะ" },
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
                          title: "วันที่จัดทำ",
                          textAlignment: "center",
                          render: ({ created_at }) =>
                            dayjs(created_at).format("DD-MMM-YYYY"),
                        },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "Actions",
                          width: 300,
                          render: (blogs) => (
                            <>
                              <Button
                                variant="primary"
                               
                              >
                                View
                              </Button>{" "}
                              <Button
                                variant="info"
                                
                              >
                                Update
                              </Button>{" "}
                              <Button
                                variant="danger"
                                onClick={() => hanldeDelete(blogs)}
                              >
                                Delete
                              </Button>
                            </>
                          ),
                        },
                      ]}
                      records={records}
                      minHeight={200}
                      totalRecords={blogs.length}
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
