import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Badge } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const OfficeCar = () => {
  //user login
  const userDatail = useAuthUser();

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [overtimes, setOvertimes] = useState([]);
  const [empcount, setEmpCount] = useState([])

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
        import.meta.env.VITE_API_KEY+"/api/otrequests"
      )
      .then((res) => {
        //Change api name
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
      import.meta.env.VITE_API_KEY+"/api/otrequests-filter-all-date?data="+key
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
                <h1 className="m-0">รถรับส่งพนักงาน OT</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item active">รถรับส่งพนักงาน</li>
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
                        <div className="row">
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="">วันที่จัดทำ OT</label>
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
                          accessor: "department",
                          title: "หน่วยงาน",
                          textAlignment: "center",
                        },
                        // {
                        //   accessor: "status",
                        //   title: "สถานะ",
                        //   textAlignment: "center",
                        //   render: ({ status }) => (
                        //     <>
                        //       <h5>
                        //         {status === "รอการอนุมัติ 2" ? (
                        //           <Badge bg="secondary">{ status }</Badge>
                        //         ) : status === "รอการอนุมัติ 3" ? (
                        //           <Badge bg="info">{ status }</Badge>
                        //         ) : status === "รอการอนุมัติ 4" ? (
                        //           <Badge bg="primary">{ status }</Badge>
                        //         ) : status === "ผ่านการอนุมัติ" ? (
                        //           <Badge bg="success">{ status }</Badge>
                        //         ) : (
                        //           <Badge bg="danger">ไม่ผ่านการอนุมัติ</Badge>
                        //         ) 
                        //         }
                        //       </h5>
                        //     </>
                        //   ),
                        // },
                        {
                          accessor: "created_at",
                          title: "วันที่จัดทำ",
                          textAlignment: "center",
                          render: ({ created_at }) =>
                            dayjs(created_at).format("DD-MM-YYYY"),
                        },
                        {
                          accessor: "end_date",
                          title: "เวลาสิ้นสุด",
                          textAlignment: "center",
                          render: ({ end_date }) => (end_date)+" น."
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
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "ดำเนินการ",
                          render: (blogs) => (
                            <>
                              <Link
                                to={"/officecar/edit/" + blogs.id}
                                className="btn btn-primary"
                              >
                              <i className="fas fa-bars"></i>
                              </Link>
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

export default OfficeCar;
