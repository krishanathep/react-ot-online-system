import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

// นำเข้าฟอนต์ไทยสำหรับ PDF
import { KanitNomal } from "../../assets/fonts/Kanit-nomal";
import { KanitBold } from "../../assets/fonts/Kanit-bold";

const PAGE_SIZES = [20, 30, 40];

const Report = () => {
  dayjs.extend(duration);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [employees, setEmployees] = useState([]);
  const [otrequest, setOtrequest] = useState([]);
  
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState(employees.slice(0, pageSize));

  const getData = async () => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest-employees")
      .then((res) => {
        const filteredEmployees = res.data.employees.filter(
          (employee) => employee.status === 1
        );
        setEmployees(filteredEmployees);
        setRecords(
          filteredEmployees.slice((page - 1) * pageSize, page * pageSize)
        );
        setLoading(false);
      });
  };

  const getOtrequest = async () => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        setOtrequest(res.data.data);
      });
  };

  //filter function by date
  const dateFilter = async () => {
    if (!startDate || !endDate) return;
  
    try {
      setLoading(true); // เริ่มโหลดข้อมูล
  
      const response = await axios.get(`${import.meta.env.VITE_API_KEY}/api/otrequest-employees`);
      
      if (response.data && response.data.employees) {
        const filteredEmployees = response.data.employees.filter((employee) => {
          const employeeDate = new Date(employee.ot_create_date);
          return employee.status === 1 && employeeDate >= new Date(startDate) && employeeDate <= new Date(endDate);
        });
  
        setEmployees(filteredEmployees);
        setRecords(filteredEmployees.slice((page - 1) * pageSize, page * pageSize));
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false); // ปิดสถานะโหลดเมื่อเสร็จสิ้น
    }
  };

  //filter function by date
  const typeFilter = async (key) => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest-employees")
      .then((res) => {
        const filteredEmployees = res.data.employees.filter(
          (employee) => employee.status === 1 && employee.cost_type === key
        );
        setEmployees(filteredEmployees);
        setRecords(
          filteredEmployees.slice((page - 1) * pageSize, page * pageSize)
        );
        setLoading(false);
      });
  };

  //filter function by date
  const codeFilter = async (key) => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest-employees")
      .then((res) => {
        const filteredEmployees = res.data.employees.filter(
          (employee) => employee.status === 1 && employee.code.includes(key)
        );
        setEmployees(filteredEmployees);
        setRecords(
          filteredEmployees.slice((page - 1) * pageSize, page * pageSize)
        );
        setLoading(false);
      });
  };

  //filter function by date
  const nameFilter = async (key) => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest-employees")
      .then((res) => {
        const filteredEmployees = res.data.employees.filter(
          (employee) => employee.status === 1 && employee.emp_name.includes(key)
        );
        setEmployees(filteredEmployees);
        setRecords(
          filteredEmployees.slice((page - 1) * pageSize, page * pageSize)
        );
        setLoading(false);
      });
  };

  // Function to calculate total time
  const calculateTotalTime = (record) => {
    // ตรวจสอบว่ามี ot_in_time และ out_time หรือไม่
    if (!record.ot_in_time || !record.out_time) {
      return "-";
    }

    const start = dayjs("01-01-2024 " + record.ot_in_time);
    const end = dayjs("01-01-2024 " + record.out_time);

    let diff = dayjs.duration(end.diff(start));

    const hours = Math.floor(diff.asHours());
    const minutes = diff.minutes();

    // แสดงเวลาในรูปแบบ ชั่วโมง:นาที
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Function to format scan data
  const formatScanData = (scan_data) => {
    return scan_data === null
      ? "-"
      : scan_data.substring(13, 18) + " - " + scan_data.substring(32, 37);
  };

  // Function to get document number
  const getDocumentNumber = (ot_emp_id) => {
    // ค้นหาข้อมูล otrequest ที่มี ot_emp_id ตรงกับ code ของพนักงาน
    const matchedOtRequest = otrequest.find(
      (request) => request.ot_emp === ot_emp_id
    );

    // ถ้าพบข้อมูล ให้แสดง ot_member_id ถ้าไม่พบให้แสดงเครื่องหมาย -
    return matchedOtRequest ? matchedOtRequest.dept : "-";
  };

   // Function to get document number
   const getDepartMent = (ot_emp_id) => {
    // ค้นหาข้อมูล otrequest ที่มี ot_emp_id ตรงกับ code ของพนักงาน
    const matchedOtRequest = otrequest.find(
      (request) => request.ot_emp === ot_emp_id
    );

    // ถ้าพบข้อมูล ให้แสดง ot_member_id ถ้าไม่พบให้แสดงเครื่องหมาย -
    return matchedOtRequest ? matchedOtRequest.department : "-";
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // เพิ่มฟอนต์ไทยให้กับ PDF
    doc.addFileToVFS("Kanit-Regular.ttf", KanitNomal);
    doc.addFileToVFS("Kanit-Bold.ttf", KanitBold);
    doc.addFont("Kanit-Regular.ttf", "Kanit", "normal");
    doc.addFont("Kanit-Bold.ttf", "Kanit", "bold");

    // ตั้งค่าฟอนต์เริ่มต้น
    doc.setFont("Kanit", "normal");
    doc.setFontSize(14);

    const tableColumns = [
      "#",
      "รหัสพนักงาน",
      "ชื่อพนักงาน",
      "ฝ่าย",
      "ประเภทค่าแรง",
      "ชนิดของาน",
      // "เป้าหมาย",
      "วันที่ทำ OT",
      "เวลาเริ่มทำ",
      "เวลาสิ้นสุด",
      "สแกนนิ้ว",
      "เวลารวม",
    ];

    const tableRows = records.map((record, index) => {
      return [
        index + 1,
        record.code,
        record.emp_name,
        getDocumentNumber(record.ot_emp_id),
        record.cost_type,
        record.job_type,
        // record.target || "-",
        dayjs(record.ot_create_date).format("DD-MM-YYYY"),
        record.ot_in_time || "-",
        record.out_time || "-",
        formatScanData(record.scan_data),
        calculateTotalTime(record),
      ];
    });

    // เพิ่มแถวรวมยอดไปที่ tableRows
    // tableRows.push([
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "",
    //   "รวมทั้งหมด",
    //   `${records.length} รายการ`,
    // ]);

    doc.text("บริษัท ไทยรุ่งยูเนี่ยนคาร์ จำกัด(มหาชน)", 14, 15);

    doc.setFontSize(13);
    doc.text("รายงานการทำงานล่วงเวลา", 14, 25);

    // Add date information if filter is applied
    if (startDate) {
      doc.text(`วันที่: ${dayjs(startDate).format("DD-MM-YYYY")}`, 14, 35);
    }

    doc.autoTable({
      startY: startDate ? 40 : 30,
      head: [tableColumns],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10, font: "Kanit" },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        halign: "center",
        fontSize: 10,
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250], // สีพื้นหลังของแถวที่สลับกัน
      },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "center" },
        7: { halign: "center" },
        8: { halign: "center" },
        9: { halign: "center" },
        10: { halign: "center" },
        11: { halign: "center" },
      },
    });

    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl, "_blank");
  };

  useEffect(() => {
    getOtrequest();
    getData();
    if (startDate && endDate) {
      dateFilter();
    }
  }, [startDate, endDate, page, pageSize]);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">รายงานโอที</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item active">รายงานโอที</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="float-right">
                              <button className="btn btn-success mb-2 ml-1" onClick={handleExportPDF}>
                              <i className="fas fa-download"></i> EXPORT
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-3">
                                <label htmlFor="">รหัสพนักงาน:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Please Enter"
                                  onChange={(event) =>
                                    codeFilter(event.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-3">
                                <label htmlFor="">ชื่อพนักงาน:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Please Enter"
                                  onChange={(event) =>
                                    nameFilter(event.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-3">
                                <label htmlFor="">ประเภทค่าแรง:</label>
                                <select
                                  className="form-control"
                                  id="sel1"
                                  onChange={(event) =>
                                  typeFilter(event.target.value)
                                  }
                                >
                                  <option defaultValue="">Please Select</option>
                                  <option value="Direct">Direct</option>
                                  <option value={"Indirect"}>Indirect</option>
                                  <option value="Indirect (s)">
                                    Indirect (s)
                                  </option>
                                </select>
                              </div>
                              <div className="col-md-3">
                                <label htmlFor="">หน่วยงาน:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Please Enter"
                                  onChange={(event) =>
                                    codeFilter(event.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-3 mt-1">
                                <label htmlFor="">ฝ่ายงาน:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Please Enter"
                                  onChange={(event) =>
                                    codeFilter(event.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-3 mt-1">
                                <label htmlFor="">เวลาเริ่ม:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Please Enter"
                                  onChange={(event) =>
                                    codeFilter(event.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-3 mt-1">
                                <label htmlFor="">เวลาสิ้นสุด:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Please Enter"
                                  onChange={(event) =>
                                    codeFilter(event.target.value)
                                  }
                                />
                              </div>
                              <div className="col-md-3 mt-1">
                                <label htmlFor="">วันที่ทำ OT:</label>
                                <br />
                                <DatePicker
                                  style={{ width: "100%" }}
                                  wrapperClassName="w-100"
                                  className="form-control"
                                  placeholderText="กรุณาเลือกช่วงวันที่"
                                  selectsRange={true}
                                  startDate={startDate}
                                  endDate={endDate}
                                  onChange={(date) => {
                                    setDateRange(date);
                                    dateFilter(
                                      dayjs(date).format("YYYY-MM-DD")
                                    );
                                  }}
                                  dateFormat="dd-MM-yyyy"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <DataTable
                            style={{
                              fontFamily: "Prompt",
                            }}
                            striped
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
                                width: 50,
                                render: (record) => records.indexOf(record) + 1,
                              },
                              {
                                accessor: "code",
                                title: "รหัสพนักงาน",
                                textAlignment: "center",
                              },
                              {
                                accessor: "emp_name",
                                title: "ชื่อพนักงาน",
                                textAlignment: "center",
                              },
                              {
                                accessor: "cost_type",
                                title: "ประเภทค่าแรง",
                                textAlignment: "center",
                              },
                              {
                                accessor: "job_type",
                                title: "ชนิดของงาน",
                                textAlignment: "center",
                              },
                              {
                                accessor: "target",
                                title: "เป้าหมาย",
                                textAlignment: "center",
                              },
                              {
                                accessor: "department",
                                title: "หน่วยงาน",
                                textAlignment: "center",
                                render: ({ ot_emp_id }) =>
                                  getDepartMent(ot_emp_id),
                              },
                              {
                                accessor: "dept",
                                title: "ฝ่ายงาน",
                                textAlignment: "center",
                                render: ({ ot_emp_id }) =>
                                  getDocumentNumber(ot_emp_id),
                              },
                              
                              {
                                accessor: "ot_create_date",
                                title: "วันที่ทำ OT",
                                textAlignment: "center",
                                render: ({ ot_create_date }) =>
                                  dayjs(ot_create_date).format("DD-MM-YYYY"),
                              },
                              {
                                accessor: "ot_in_time",
                                title: "เวลาเริ่ม",
                                textAlignment: "center",
                              },
                              {
                                accessor: "out_time",
                                title: "เวลาสิ้นสุด",
                                textAlignment: "center",
                              },
                              {
                                accessor: "scan_data",
                                title: "สแกนนิ้ว",
                                textAlignment: "center",
                                render: ({ scan_data }) =>
                                  formatScanData(scan_data),
                              },
                              {
                                accessor: "total_time",
                                title: "เวลารวม",
                                textAlignment: "center",
                                render: (record) => calculateTotalTime(record),
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
