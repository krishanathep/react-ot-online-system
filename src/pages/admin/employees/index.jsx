import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const Employees = () => {
  //user login
  const userDatail = useAuthUser();

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    setPage(1);
    setEmployees;
  }, [pageSize]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState(employees.slice(0, pageSize));

  const getData = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get("http://localhost/laravel_auth_jwt_api/public/api/employees")
      .then((res) => {
        setEmployees(res.data.employees);
        setRecords(res.data.employees.slice(from, to));
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
                <h1 className="m-0">พนักงานทั้งหมด</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item active">จัดการพนักงาน</li>
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
                        <Link to={'/employees/create'} className="btn btn-success mb-3 ml-1 float-right">เพิ่มพนักงาน</Link>
                        <button className="btn btn-secondary mb-3 float-right">อัพโหลดไฟล์</button>
                      </div>
                      <div className="col-md-12">
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-2">
                                <label htmlFor="">รหัสพนักงาน</label>
                                <input type="text" className="form-control" />
                              </div>
                              <div className="col-md-2">
                                <label htmlFor="">ชื่อพนักงาน</label>
                                <input type="text" className="form-control" />
                              </div>
                              <div className="col-md-2">
                                <label htmlFor="">กลุ่มงาน</label>
                                <input type="text" className="form-control" />
                              </div>
                              <div className="col-md-2">
                                <label htmlFor="">ตำแหน่ง</label>
                                <input type="text" className="form-control" />
                              </div>
                              <div className="col-md-2">
                                <label htmlFor="">แผนก</label>
                                <input type="text" className="form-control" />
                              </div>
                              <div className="col-md-2">
                                <label htmlFor="">บริษัท</label>
                                <input type="text" className="form-control" />
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
                          accessor: "code",
                          title: "รหัสพนักงาน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "full_name",
                          title: "ชื่อพนักงาน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "business_group",
                          title: "กลุ่มงาน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "position",
                          title: "ตำแหน่ง",
                          textAlignment: "center",
                        },
                        {
                          accessor: "department",
                          title: "แผนก",
                          textAlignment: "center",
                        },
                        {
                          accessor: "company",
                          title: "บริษัท",
                          textAlignment: "center",
                        },
                        {
                          accessor: "created_at",
                          title: "วันที่จัดทำ",
                          textAlignment: "center",
                          render: ({ created_at }) =>
                            dayjs(created_at).format("DD-MM-YYYY"),
                        },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "ดำเนินการ",
                          render: (blogs) => (
                            <>
                              <Link to={'/employees/view/'+blogs.id} className="btn btn-info">View</Link>{" "}
                              <Link to={'/employees/edit/'+blogs.id} className="btn btn-primary">Edit</Link>{" "}
                              <button className="btn btn-danger">Delete</button>
                            </>
                          ),
                        },
                      ]}
                      records={records}
                      minHeight={200}
                      totalRecords={employees.length}
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

export default Employees;
