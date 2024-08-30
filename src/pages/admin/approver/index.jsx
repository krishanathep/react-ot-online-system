import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
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
  const [approver, setApprover] = useState([]);

  useEffect(() => {
    setPage(1);
    setApprover;
  }, [pageSize]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState(approver.slice(0, pageSize));

  const getData = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/approve")
      .then((res) => {
        setApprover(res.data.approver);
        setRecords(res.data.approver.slice(from, to));
        setLoading(false);
      });
  };

  const handleDeleteSubmit =async(blogs,data)=>{
    await axios
      .delete(import.meta.env.VITE_API_KEY + "/api/approve-delete/"+blogs.id,data)
      .then((res) => {
        console.log(res.data.approver)
        Swal.fire({
          icon: "error",
          title: "Your approver has been deleted",
          showConfirmButton: false,
          timer: 2000,
        });
        getData()
      });
  }

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
                <h1 className="m-0">Approver All</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item active">Approver All</li>
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
                        <div className="float-right mb-2">
                          <Link
                            to={"/admin/approver/create"}
                            className="btn btn-success"
                          >
                            <i className="fas fa-plus"></i> Create
                          </Link>
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
                          accessor: "dept",
                          title: "dept",
                          textAlignment: "center",
                        },
                        {
                          accessor: "agency",
                          title: "agency",
                          textAlignment: "center",
                        },
                        {
                          accessor: "division",
                          title: "division",
                          textAlignment: "center",
                        },

                        // {
                        //   accessor: "app_name_1",
                        //   title: "app_name_1",
                        //   textAlignment: "center",
                        // },

                        {
                          accessor: "app_name_2",
                          title: "app_name_2",
                          textAlignment: "center",
                        },

                        {
                          accessor: "app_name_3",
                          title: "app_name_3",
                          textAlignment: "center",
                        },

                        
                        {
                            accessor: "app_name_4",
                            title: "app_name_4",
                            textAlignment: "center",
                          },

                        {
                          accessor: "updated_at",
                          title: "วันที่จัดทำ",
                          textAlignment: "center",
                          render: ({ updated_at }) =>
                            dayjs(updated_at).format("DD-MM-YYYY"),
                        },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "ดำเนินการ",
                          render: (blogs) => (
                            <>
                              <Link
                                to={"/admin/approver/update/" + blogs.id}
                                className="btn btn-primary"
                              >
                                <i className="far fa-edit"></i>
                              </Link>{" "}
                              <button
                                onClick={()=>handleDeleteSubmit(blogs)}
                               
                                className="btn btn-danger"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </>
                          ),
                        },
                      ]}
                      records={records}
                      minHeight={200}
                      totalRecords={approver.length}
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

export default Approver;
