import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { useAuthUser } from "react-auth-kit";
import Swal from "sweetalert2";

import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const TimeScan = () => {
  //user login
  const userDatail = useAuthUser();

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [timescan, setTimeScan] = useState([]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState(timescan.slice(0, pageSize));

  const getData = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        import.meta.env.VITE_API_KEY +
          "/api/time-scan"
      )
      .then((res) => {
        setTimeScan(res.data.scan);
        setRecords(res.data.scan.slice(from, to));
        setLoading(false);
      });
  };

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

      formData.append("csvFile", selectFile);

      await axios
        .post(
          import.meta.env.VITE_API_KEY +
            "/api/time-scan-import",
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
                <h1 className="m-0">Time Scan Record</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item active">Time scan record</li>
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
                          <div
                            className="file btn btn-primary mr-1"
                            style={{ position: "relative", overflow: "hidden" }}
                          >
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
                              accept=".txt"
                              onChange={changeHandler}
                            />
                          </div>
                          <button
                            onClick={handleSubmitImportFile}
                            className="btn btn-success float-right"
                          >
                            <i className="fas fa-file-upload"></i> อัพโหลด
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
                      idAccessor="id"
                      columns={[
                        {
                          accessor: "",
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
                          accessor: "date_scan",
                          title: "วันที่สแกน",
                          textAlignment: "center",
                          render: ({ date_scan }) =>
                            dayjs(date_scan).format("DD-MMM-YYYY"),
                        },

                        {
                          accessor: "time_scan",
                          title: "เวลาสแกน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "status",
                          title: "สถานะ",
                          textAlignment: "center",
                        },
                        {
                          accessor: "created_at",
                          title: "Created at",
                          textAlignment: "center",
                          render: ({ created_at }) =>
                            dayjs(created_at).format("DD-MMM-YYYY"),
                        },
                      ]}
                      records={records}
                      minHeight={200}
                      totalRecords={timescan.length}
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

export default TimeScan;
