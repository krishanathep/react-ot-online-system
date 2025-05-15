import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { useAuthUser } from "react-auth-kit";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Badge from "react-bootstrap/Badge";
import Swal from "sweetalert2";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];
const STORAGE_KEY = "ot-filter-state";

const Overtime = () => {
  //user login
  const userDatail = useAuthUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Get stored filter state or initialize from URL/defaults
  const getInitialState = (key, urlParam, defaultValue) => {
    // Check localStorage first
    const storedFilters = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    if (storedFilters[key] !== undefined) {
      return storedFilters[key];
    }

    // Then check URL
    const urlValue = searchParams.get(urlParam);
    if (urlValue !== null) {
      return urlValue;
    }

    // Default value as fallback
    return defaultValue;
  };

  // Initialize state with stored values or URL params if they exist
  const [pageSize, setPageSize] = useState(() => {
    return Number(getInitialState("pageSize", "pageSize", PAGE_SIZES[0]));
  });

  const [page, setPage] = useState(() => {
    return Number(getInitialState("page", "page", 1));
  });

  const [overtimes, setOvertimes] = useState([]);

  const [startDate, setStartDate] = useState(() => {
    const dateStr = getInitialState("date", "date", "");
    return dateStr ? new Date(dateStr) : "";
  });

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  // Filter states
  const [codeFilterValue, setCodeFilterValue] = useState(() => {
    return getInitialState("code", "code", "");
  });

  const [nameFilterValue, setNameFilterValue] = useState(() => {
    return getInitialState("name", "name", "");
  });

  const [statusFilterValue, setStatusFilterValue] = useState(() => {
    return getInitialState("status", "status", "");
  });

  // Update URL params and localStorage whenever filter, page, or pageSize changes
  const updateURLParams = () => {
    const params = {};
    const storageState = {};

    // Update URL parameters
    if (page !== 1) params.page = page;
    if (pageSize !== PAGE_SIZES[0]) params.pageSize = pageSize;
    if (codeFilterValue) params.code = codeFilterValue;
    if (nameFilterValue) params.name = nameFilterValue;
    if (statusFilterValue) params.status = statusFilterValue;
    if (startDate) params.date = dayjs(startDate).format("YYYY-MM-DD");

    // Update storage state (always store all values)
    storageState.page = page;
    storageState.pageSize = pageSize;
    storageState.code = codeFilterValue;
    storageState.name = nameFilterValue;
    storageState.status = statusFilterValue;
    storageState.date = startDate ? dayjs(startDate).format("YYYY-MM-DD") : "";

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageState));

    // Update URL
    setSearchParams(params);
  };

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

  // Apply all filters based on stored state or URL params when component mounts or path changes
  useEffect(() => {
    const applyFiltersFromStoredState = async () => {
      // Get data from storage
      const storedFilters = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      );

      // Check which filter to apply (only apply one, in priority order)
      if (codeFilterValue) {
        await codeFilter(codeFilterValue, false); // Pass false to prevent recursion
      } else if (nameFilterValue) {
        await nameFilter(nameFilterValue, false);
      } else if (statusFilterValue) {
        await statusFilter(statusFilterValue, false);
      } else if (startDate) {
        await dateFilter(dayjs(startDate).format("YYYY-MM-DD"), false);
      } else {
        await getData();
      }
    };

    applyFiltersFromStoredState();
  }, [location.pathname]); // Re-run when path changes (user navigates back to this page)

  // Update data when page or pageSize changes
  useEffect(() => {
    // Only update records pagination if we have data
    if (overtimes.length > 0) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      setRecords(overtimes.slice(from, to));
    }

    updateURLParams();
  }, [page, pageSize]);

  //filter function by ot code
  const codeFilter = async (key, updateState = true) => {
    if (updateState) {
      setCodeFilterValue(key);
      setNameFilterValue(""); // Reset other filters
      setStatusFilterValue("");
      setStartDate("");
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    if (!key) {
      getData();
      return;
    }

    setLoading(true);
    await axios
      .get(
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-code?dept=${
          userDatail().dept
        }&data=${key}`
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
        if (updateState) updateURLParams();
      });
  };

  //filter function by department name
  const nameFilter = async (key, updateState = true) => {
    if (updateState) {
      setNameFilterValue(key);
      setCodeFilterValue(""); // Reset other filters
      setStatusFilterValue("");
      setStartDate("");
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    if (!key) {
      getData();
      return;
    }

    setLoading(true);
    await axios
      .get(
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-name?dept=${
          userDatail().dept
        }&data=${key}`
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
        if (updateState) updateURLParams();
      });
  };

  //filter function by status
  const statusFilter = async (key, updateState = true) => {
    if (updateState) {
      setStatusFilterValue(key);
      setCodeFilterValue(""); // Reset other filters
      setNameFilterValue("");
      setStartDate("");
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    if (!key || key === "กรุณาเลือกข้อมูล") {
      getData();
      return;
    }

    setLoading(true);
    await axios
      .get(
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-status?dept=${
          userDatail().dept
        }&data=${key}`
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
        if (updateState) updateURLParams();
      });
  };

  //filter function by date
  const dateFilter = async (key, updateState = true) => {
    if (updateState) {
      setCodeFilterValue(""); // Reset other filters
      setNameFilterValue("");
      setStatusFilterValue("");
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    if (!key) {
      getData();
      return;
    }

    setLoading(true);
    await axios
      .get(
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-date?dept=${
          userDatail().dept
        }&data=${key}`
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
        if (updateState) updateURLParams();
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
        setLoading(true);
        axios
          .delete(
            import.meta.env.VITE_API_KEY + "/api/otrequest-delete/" + blogs.id,
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateURLParams();
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
    updateURLParams();
  };

  // Clear all filters and localStorage when user clicks reset button
  const handleResetFilters = () => {
    setCodeFilterValue("");
    setNameFilterValue("");
    setStatusFilterValue("");
    setStartDate("");
    setPage(1);
    setPageSize(PAGE_SIZES[0]);

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);

    // Clear URL params
    setSearchParams({});

    // Get fresh data
    getData();
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
                    <Link to={"/"}>หน้าหลัก</Link>
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
                          <button
                            className="btn btn-secondary mb-2 mr-1"
                            onClick={handleResetFilters}
                          >
                            <i className="fas fa-undo-alt mr-1"></i>{" "}
                            รีเซ็ตตัวกรอง
                          </button>

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
                        <div className="card ">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">เลขที่คำร้อง</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="กรุณากรอกข้อมูล"
                                    value={codeFilterValue}
                                    onChange={(event) => {
                                      codeFilter(event.target.value);
                                    }}
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
                                    value={nameFilterValue}
                                    onChange={(event) => {
                                      nameFilter(event.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">สถานะการอนุมัติ</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    value={statusFilterValue}
                                    onChange={(event) => {
                                      statusFilter(event.target.value);
                                    }}
                                  >
                                    <option value="">กรุณาเลือกข้อมูล</option>
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
                                  <br />
                                  <DatePicker
                                    style={{ width: "100%" }}
                                    wrapperClassName="w-100"
                                    className="form-control"
                                    placeholderText="กรุณาเลือกวันที่"
                                    selected={startDate}
                                    onChange={(date) => {
                                      setStartDate(date);
                                      if (date) {
                                        dateFilter(
                                          dayjs(date).format("YYYY-MM-DD")
                                        );
                                      } else {
                                        getData();
                                      }
                                    }}
                                    dateFormat="dd-MM-yyyy"
                                    isClearable
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
                          accessor: "department",
                          title: "หน่วยงาน",
                          textAlignment: "center",
                        },
                        {
                          accessor: "dept",
                          title: "ฝ่ายงาน",
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
                              {blogs.status === "ผ่านการอนุมัติ" &&
                              blogs.result === "รอการรายงาน" ? (
                                <>
                                  <Link
                                    to={"/overtime/edit/" + blogs.id}
                                    className="btn btn-info"
                                  >
                                    <i className="far fa-edit"></i>
                                  </Link>
                                </>
                              ) : (
                                <>
                                  <button disabled className="btn btn-info">
                                    <i className="far fa-edit"></i>
                                  </button>
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
                      onPageChange={handlePageChange}
                      recordsPerPageOptions={PAGE_SIZES}
                      onRecordsPerPageChange={handlePageSizeChange}
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
