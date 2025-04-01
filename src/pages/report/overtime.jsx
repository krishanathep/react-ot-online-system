import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { useAuthUser } from "react-auth-kit";
import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { TextInput, Select } from "@mantine/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IconSearch, IconCalendar } from "@tabler/icons-react";

import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const OverTimeReport = () => {
  //user login
  const userDatail = useAuthUser();

  // โหลดค่า pageSize และ page จาก localStorage หรือใช้ค่าเริ่มต้น
  const getStoredState = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [pageSize, setPageSize] = useState(
    getStoredState("ot_pageSize", PAGE_SIZES[0])
  );
  const [page, setPage] = useState(getStoredState("ot_page", 1));

  const [overtimes, setOvertimes] = useState([]);
  const [approver, setApprover] = useState("");
  const [empcount, setEmpcount] = useState(0);
  const [emptotal, setEmptotal] = useState(0);

  // Filter states
  const [filteredRecords, setFilteredRecords] = useState([]);
  // โหลด filters จาก localStorage หรือใช้ค่าเริ่มต้น
  const getStoredFilters = () => {
    const storedFilters = localStorage.getItem("ot_filters");
    return storedFilters
      ? JSON.parse(storedFilters)
      : {
          ot_member_id: "",
          create_name: "",
          department: "",
          dept: "",
          status: "",
          result: "",
          ot_date: null,
        };
  };

  const [filters, setFilters] = useState(getStoredFilters());

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  // บันทึกค่า pageSize และ page ไปยัง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("ot_pageSize", JSON.stringify(pageSize));
  }, [pageSize]);

  useEffect(() => {
    localStorage.setItem("ot_page", JSON.stringify(page));
  }, [page]);

  // บันทึก filters ไปยัง localStorage
  useEffect(() => {
    localStorage.setItem("ot_filters", JSON.stringify(filters));
  }, [filters]);

  // โหลดข้อมูลเมื่อ component โหลดครั้งแรก
  useEffect(() => {
    getData();
    getApprover();
  }, []);

  const getData = async () => {
    // get ot request data from dept by user login
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        // Filter data to show only where result is "ปิดการรายงาน"
        const filteredData = res.data.data.filter(otrequest => otrequest.result === "ปิดการรายงาน");
  
        // Set state with filtered data
        setOvertimes(filteredData);
        setFilteredRecords(filteredData);
        updatePaginatedRecords(filteredData);
        setLoading(false);
  
        // Calculate the number of employees for each ot_member_id
        const employeeCounts = filteredData.reduce((acc, otrequest) => {
          acc[otrequest.ot_member_id] = otrequest.employees.length;
          return acc;
        }, {});
  
        // Calculate the total number of employees
        const totalEmployees = filteredData.reduce(
          (acc, otrequest) => acc + otrequest.employees.length,
          0
        );
        setEmpcount(employeeCounts);
        setEmptotal(totalEmployees);
      });
  };
  
  const updatePaginatedRecords = (data) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords(data.slice(from, to));
  };

  // ใช้ filters ในการกรองข้อมูล
  useEffect(() => {
    if (overtimes.length > 0) {
      const filtered = overtimes.filter((record) => {
        return (
          (filters.ot_member_id === "" ||
            record.ot_member_id
              .toLowerCase()
              .includes(filters.ot_member_id.toLowerCase())) &&
          (filters.create_name === "" ||
            record.create_name
              .toLowerCase()
              .includes(filters.create_name.toLowerCase())) &&
          (filters.department === "" ||
            record.department
              .toLowerCase()
              .includes(filters.department.toLowerCase())) &&
          (filters.dept === "" ||
            record.dept.toLowerCase().includes(filters.dept.toLowerCase())) &&
          (filters.status === "" || record.status === filters.status) &&
          (filters.result === "" || record.result === filters.result) &&
          (filters.ot_date === null ||
            dayjs(record.ot_date).format("YYYY-MM-DD") ===
              dayjs(filters.ot_date).format("YYYY-MM-DD"))
        );
      });

      setFilteredRecords(filtered);
      updatePaginatedRecords(filtered);
    }
  }, [filters, overtimes, page, pageSize]);

  // Update paginated records when page or pageSize changes
  useEffect(() => {
    updatePaginatedRecords(filteredRecords);
  }, [page, pageSize, filteredRecords]);

  useEffect(() => {
    getData();
    getApprover();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  // Get unique values for select filters
  const getUniqueSelectOptions = (key) => {
    const uniqueValues = [...new Set(overtimes.map((item) => item[key]))];
    return uniqueValues.map((value) => ({ value, label: value }));
  };

  // Approver 2 update status
  const handleApproverSubmit2 = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการอนุมัติ OT",
      text: "คุณต้องการอนุมัติคำร้อง OT ใช่ไหม",
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
          title: "ระบบได้ทำการอนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        setLoading(true);
        axios
          .put(
            import.meta.env.VITE_API_KEY +
              "/api/otrequest-approve2/" +
              blogs.id,
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

  // Approver 3 update status
  const handleApproverSubmit3 = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการอนุมัติ OT",
      text: "คุณต้องการอนุมัติคำร้อง OT ใช่ไหม",
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
          title: "ระบบได้ทำการอนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        setLoading(true);
        axios
          .put(
            import.meta.env.VITE_API_KEY +
              "/api/otrequest-approve3/" +
              blogs.id,
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
  // Approver 4 update status
  const handleApproverSubmit4 = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการอนุมัติ OT",
      text: "คุณต้องการอนุมัติคำร้อง OT ใช่ไหม",
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
          title: "ระบบได้ทำการอนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        setLoading(true);
        axios
          .put(
            import.meta.env.VITE_API_KEY +
              "/api/otrequest-approve4/" +
              blogs.id,
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

  // Approver 5 update status
  const handleApproverSubmit5 = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการอนุมัติ OT",
      text: "คุณต้องการอนุมัติคำร้อง OT ใช่ไหม",
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
          title: "ระบบได้ทำการอนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        axios
          .put(
            import.meta.env.VITE_API_KEY +
              "/api/otrequest-approve5/" +
              blogs.id,
            data
          )
          .then((res) => {
            console.log(res);
            getData();
            Swal.fire({
              icon: "success",
              title: "Your OT request has been status update",
              showConfirmButton: false,
              timer: 2000,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  // Approver 6 update status
  const handleApproverSubmit6 = (blogs, data) => {
    Swal.fire({
      title: "ยืนยันการอนุมัติ OT",
      text: "คุณต้องการอนุมัติคำร้อง OT ใช่ไหม",
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
          title: "ระบบได้ทำการอนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        axios
          .put(
            import.meta.env.VITE_API_KEY +
              "/api/otrequest-approve6/" +
              blogs.id,
            data
          )
          .then((res) => {
            console.log(res);
            getData();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const handleRejectSubmit = async (blogs, data) => {
    await Swal.fire({
      title: "ยืนยันการไม่อนุมัติ OT",
      text: "คุณไม่ต้องการอนุมัติคำร้อง OT ใช่ไหม",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "error",
          title: "ระบบได้ทำการไม่อนุมัติ OT เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
        axios
          .put(
            import.meta.env.VITE_API_KEY + "/api/otrequest-reject/" + blogs.id,
            data
          )
          .then((res) => {
            console.log(res);
            getData();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = "_" + month + "_" + date + "_" + year;
  const [selectDate, setSelectDate] = useState("");

  // text export function
  const textExport = async () => {
    // Assuming you have already included dayjs in your project
    const currentDate = dayjs().format("DD_MM_YYYY");

    try {
      const response = await axios.get(
        import.meta.env.VITE_API_KEY +
          "/api/otrequest-text-export?data=" +
          selectDate,
        { responseType: "blob" }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "text/plain" });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ot_request_" + currentDate + ".txt");
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      //alert('Failed to export data. Please try again.');
    }
  };

  const getApprover = async () => {
    await axios
      .get(
        import.meta.env.VITE_API_KEY +
          "/api/approve-role?data=" +
          userDatail().dept
      )
      .then((res) => {
        setApprover(res.data.approver);
      });
  };

  const clearFilters = () => {
    setFilters({
      ot_member_id: "",
      create_name: "",
      department: "",
      dept: "",
      status: "",
      result: "",
      ot_date: null,
    });
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
                    <div className="row mb-3">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="float-right">
                              {/* <button
                                className="btn btn-success"
                                onClick={clearFilters}
                              >
                               <i className="fas fa-download"></i> EXPORT
                              </button> */}
                              <button
                                className="btn btn-secondary"
                                onClick={clearFilters}
                              >
                               <i className="fas fa-undo"></i> ล้างตัวกรอง
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="row mb-3">
                      <div className="col-md-10">
                        <div className="d-flex flex-wrap gap-2">
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={clearFilters}
                            style={{ marginRight: '10px' }}
                          >
                            ล้างตัวกรอง
                          </button>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ minWidth: '150px' }}>
                              {filteredRecords.length} รายการจาก {overtimes.length} รายการ
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
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
                          render: (record) =>
                            records.indexOf(record) + 1 + (page - 1) * pageSize,
                        },
                        {
                          accessor: "ot_member_id",
                          title: "เลขที่คำร้อง",
                          textAlignment: "center",
                          filtering: true,
                          filter: (
                            <TextInput
                              label="กรองด้วยเลขที่คำร้อง"
                              description="ค้นหาเลขที่คำร้อง"
                              placeholder="ค้นหา..."
                              icon={<IconSearch size={16} />}
                              value={filters.ot_member_id}
                              onChange={(e) =>
                                handleFilterChange(
                                  "ot_member_id",
                                  e.currentTarget.value
                                )
                              }
                            />
                          ),
                        },
                        {
                          accessor: "create_name",
                          title: "ผู้ควบคุมงาน",
                          textAlignment: "center",
                          filtering: true,
                          // filter: (
                          //   <TextInput
                          //     label="กรองด้วยชื่อผู้ควบคุมงาน"
                          //     description="ค้นหาผู้ควบคุมงาน"
                          //     placeholder="ค้นหา..."
                          //     icon={<IconSearch size={16} />}
                          //     value={filters.create_name}
                          //     onChange={(e) => handleFilterChange('create_name', e.currentTarget.value)}
                          //   />
                          // ),
                        },
                        {
                          accessor: "department",
                          title: "หน่วยงาน",
                          textAlignment: "center",
                          filtering: true,
                          filter: (
                            <TextInput
                              label="กรองด้วยหน่วยงาน"
                              description="ค้นหาหน่วยงาน"
                              placeholder="ค้นหา..."
                              icon={<IconSearch size={16} />}
                              value={filters.department}
                              onChange={(e) =>
                                handleFilterChange(
                                  "department",
                                  e.currentTarget.value
                                )
                              }
                            />
                          ),
                        },
                        {
                          accessor: "dept",
                          title: "ฝ่ายงาน",
                          textAlignment: "center",
                          filtering: true,
                          filter: (
                            <TextInput
                              label="กรองด้วยฝ่ายงาน"
                              description="ค้นหาฝ่ายงาน"
                              placeholder="ค้นหา..."
                              icon={<IconSearch size={16} />}
                              value={filters.dept}
                              onChange={(e) =>
                                handleFilterChange(
                                  "dept",
                                  e.currentTarget.value
                                )
                              }
                            />
                          ),
                        },
                        {
                          accessor: "status",
                          title: "สถานะการอนุมัติ",
                          textAlignment: "center",
                          filtering: true,
                        //   filter: (
                        //     <Select
                        //       label="กรองด้วยสถานะการอนุมัติ"
                        //       description="เลือกสถานะการอนุมัติ"
                        //       placeholder="เลือกสถานะ"
                        //       clearable
                        //       data={[
                        //         { value: "", label: "ทั้งหมด" },
                        //         ...getUniqueSelectOptions("status"),
                        //       ]}
                        //       value={filters.status}
                        //       onChange={(value) =>
                        //         handleFilterChange("status", value || "")
                        //       }
                        //     />
                        //   ),
                          render: ({ status }) => (
                            <>
                            {status}
                              {/* <h5>
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
                              </h5> */}
                            </>
                          ),
                        },
                        {
                          accessor: "result",
                          title: "สถานะรายงาน",
                          textAlignment: "center",
                        //   filtering: true,
                        //   filter: (
                        //     <Select
                        //       label="กรองด้วยสถานะรายงาน"
                        //       description="เลือกสถานะรายงาน"
                        //       placeholder="เลือกสถานะ"
                        //       clearable
                        //       data={[
                        //         { value: "", label: "ทั้งหมด" },
                        //         ...getUniqueSelectOptions("result"),
                        //       ]}
                        //       value={filters.result}
                        //       onChange={(value) =>
                        //         handleFilterChange("result", value || "")
                        //       }
                        //     />
                        //   ),
                          render: ({ result }) => (
                            <>
                            {result}
                              {/* <h5>
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
                              </h5> */}
                            </>
                          ),
                        },
                        {
                          accessor: "start_date",
                          title: "เวลาที่ทำ OT",
                          textAlignment: "center",
                        },
                        {
                          accessor: "ot_date",
                          title: "วันที่ทำ OT",
                          textAlignment: "center",
                          filtering: true,
                          filter: (
                            <div>
                              <label className="block text-sm font-medium mb-1">กรองด้วยวันที่ทำ OT</label>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                  <IconCalendar size={16} />
                                </div>
                                <DatePicker
                                  selected={filters.ot_date}
                                  onChange={(date) => handleFilterChange("ot_date", date)}
                                  dateFormat="dd-MM-yyyy"
                                  placeholderText="เลือกวันที่"
                                  className="pl-10 pr-3 py-2 border rounded w-full"
                                  isClearable
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">เลือกวันที่ทำ OT</p>
                            </div>
                          ),
                          render: ({ ot_date }) => dayjs(ot_date).format("DD-MM-YYYY"),
                        },
                        {
                          accessor: "employee_count",
                          title: "จำนวน(คน)",
                          textAlignment: "center",
                          render: (row) => (
                            <span>{empcount[row.ot_member_id]}</span>
                          ),
                        },
                        {
                          accessor: "otrequests",
                          title: "จุดรถรับส่ง",
                          textAlignment: "center",
                          render: (otrequests) => {
                            const firstEmployee = otrequests.employees[0]; // ดึงพนักงานคนแรก
                            if (!firstEmployee) return "ไม่จัดรถ"; // ถ้าไม่มีพนักงานเลย

                            const busPoints = [
                              firstEmployee.bus_point_1,
                              firstEmployee.bus_point_2,
                              firstEmployee.bus_point_3,
                              firstEmployee.bus_point_4,
                            ];

                            // ตรวจสอบว่าทุกค่าของ bus_point เป็น null
                            const allNull = busPoints.every(
                              (point) => point === null
                            );
                            if (allNull) return <p>ไม่ได้จัดรถ</p>;

                            // แสดงค่าที่มีข้อมูล (ตัด null หรือค่าว่างออก)
                            const filteredPoints = busPoints
                              .filter((point) => point !== null && point !== "")
                              .join(" : ");

                            return filteredPoints;
                          },
                        },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "ดำเนินการ",
                          render: (blogs) => (
                            <>
                              <Link
                                to={"/ot/overtime/view/" + blogs.id}
                                className="btn btn-primary"
                              >
                                <i className="fas fa-bars"></i>
                              </Link>{" "}
                              <div hidden>
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleApproverSubmit2(blogs)}
                                  disabled={
                                    blogs.status === "รอการอนุมัติ 1"
                                      ? false
                                      : true
                                  }
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleApproverSubmit3(blogs)}
                                  disabled={
                                    blogs.status === "รอการอนุมัติ 2"
                                      ? false
                                      : true
                                  }
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleApproverSubmit4(blogs)}
                                  disabled={
                                    blogs.status === "รอการอนุมัติ 3"
                                      ? false
                                      : true
                                  }
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-warning text-white"
                                  onClick={() => handleApproverSubmit5(blogs)}
                                  disabled={
                                    blogs.result === "รอการปิด (ส่วน)"
                                      ? false
                                      : true
                                  }
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-warning text-white"
                                  onClick={() => handleApproverSubmit6(blogs)}
                                  disabled={
                                    blogs.result === "รอการปิด (ผจก)"
                                      ? false
                                      : true
                                  }
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>{" "}
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleRejectSubmit(blogs)}
                                >
                                  <i className="fas fa-times-circle"></i>{" "}
                                </button>
                              </div>
                            </>
                          ),
                        },
                      ]}
                      records={records}
                      minHeight={200}
                      totalRecords={filteredRecords.length}
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

export default OverTimeReport;
