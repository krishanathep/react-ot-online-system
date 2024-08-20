import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { useAuthUser } from "react-auth-kit";
import {Link} from 'react-router-dom'
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
      .get(import.meta.env.VITE_API_KEY+"/api/employees")
      .then((res) => {
        setEmployees(res.data.employees);
        setRecords(res.data.employees.slice(from, to));
        setLoading(false);
      });
  };

  // filter by employees id
  

  const [selectFile, setSelectFile] = useState("");

  const changeHandler = (event) => {
    setSelectFile(event.target.files[0]);
  };

  const handleSubmitImportFile = async () => {
    if (!selectFile) {
      Swal.fire({
        icon: "info",
        title: "Pease select file for upload",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("importFile", selectFile);

      await axios
        .post(
          import.meta.env.VITE_API_KEY +
            "/api/employees-import",
          formData
        )
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Your file upload has been success",
            showConfirmButton: false,
            timer: 2000,
          });
          getData();
          setLoading(false);
        });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong !",
        showConfirmButton: false,
        timer: 2000,
      });
      setLoading(false);
    }
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
                        <div className="float-right mb-2">
                          <div className="file btn btn-primary mr-1" style={{position:"relative",overflow:"hidden"}}>
                            <i className="fas fa-folder-plus"></i> เลือกไฟล์
                            <input
                              style={{
                                position: "absolute",
                                fontSize: 50,
                                opacity: 0,
                                right: 0,
                                top: 0,
                              }}
                              type="file"
                              name="file"
                              accept=".csv"
                              onChange={changeHandler}
                            />
                          </div>
                          <button
                            onClick={handleSubmitImportFile}
                            className="btn btn-secondary mr-1" 
                          >
                            <i className="fas fa-file-upload"></i> อัพโหลด
                          </button>
                          <Link to={'/admin/employees/create'} className="btn btn-success"><i className="fas fa-plus"></i> Create</Link>
                        </div>
                      </div>
                      {/* <div className="col-md-12">
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-3">
                                <label htmlFor="">รหัสพนักงาน</label>
                                <input 
                                type="text" 
                                className="form-control" 
                                placeholder="กรุณากรอกข้อมูล" 
                                onChange={(e)=>setSearch(e.target.value)}
                                />
                              </div>
                              <div className="col-md-3">
                                <label htmlFor="">ชื่อพนักงาน</label>
                                <input type="text" className="form-control" placeholder="กรุณากรอกข้อมูล" />
                              </div>
                              <div className="col-md-3">
                                <label htmlFor="">กลุ่มงาน</label>
                                <input type="text" className="form-control" placeholder="กรุณากรอกข้อมูล" />
                              </div>
                              <div className="col-md-3">
                                <label htmlFor="">แผนก</label>
                                <input type="text" className="form-control" placeholder="กรุณากรอกข้อมูล" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
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
                          accessor: "emp_id",
                          title: "รหัสพนักงาน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "emp_name",
                          title: "ชื่อพนักงาน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "bus_group",
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
                          title: "หน่วยงาน",
                          textAlignment: "center",
                          render: ({ department }) => (
                            <>
                              {department === null ? (
                                 <h5><blade className="badge bg-info"><span>ไม่ระบุข้อมูล</span></blade></h5>
                              ) : (
                                <span>{department}</span>
                              )}
                            </>
                          ),
                        },
                        {
                          accessor: "agency",
                          title: "ส่วนงาน",
                          textAlignment: "center",
                          render: ({ agency }) => (
                            <>
                              {agency === null ? (
                                 <h5><blade className="badge bg-info"><span>ไม่ระบุข้อมูล</span></blade></h5>
                              ) : (
                                <span>{agency}</span>
                              )}
                            </>
                          ),
                        },
                        {
                          accessor: "dept",
                          title: "แผนก",
                          textAlignment: "center",
                        },
                        {
                          accessor: "work_exp",
                          title: "อายุงาน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "created_at",
                          title: "วันที่จัดทำ",
                          textAlignment: "center",
                          render: ({ created_at }) =>
                            dayjs(created_at).format("DD-MM-YYYY"),
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
