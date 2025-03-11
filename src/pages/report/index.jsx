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
//import { KanitNomal } from "../../../assets/fonts/Kanit-nomal.jsx";
//import { KanitBold } from "../../../assets/fonts/Kanit-bold.jsx";
import { KanitNomal } from '../../assets/fonts/Kanit-nomal'
import { KanitBold } from '../../assets/fonts/Kanit-bold'

const PAGE_SIZES = [10, 20, 30];

const Report = () => {
  dayjs.extend(duration);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [employees, setEmployees] = useState([]);
  const [otrequest, setOtrequest] = useState([]);
  const [startDate, setStartDate] = useState("");

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
  const dateFilter = async (key) => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest-employees")
      .then((res) => {
        const filteredEmployees = res.data.employees.filter(
          (employee) => employee.status === 1 && employee.ot_create_date === key
        );
        setEmployees(filteredEmployees);
        setRecords(
          filteredEmployees.slice((page - 1) * pageSize, page * pageSize)
        );
        setLoading(false);
      });
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

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a3",
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
      "ประเภทค่าแรง",
      "ชนิดของาน",
      "เป้าหมาย",
      "เลขที่เอกสาร",
      "วันที่ทำ OT",
      "เวลาเริ่มทำ",
      "เวลาสิ้นสุด",
      "เวลารวม",
      "สแกนนิ้ว",
    ];

    const tableRows = records.map((record, index) => {
      const empListByType = (type) =>
        record.pay_list
          .filter((pay) => pay.pay_type === type)
          .map((pay) => pay.amount)
          .join(", ");

      return [
        index + 1,
        record.code,
        record.emp_name,
        record.cost_type,
        record.job_type,
      ];
    });

    // เพิ่มแถวรวมยอดไปที่ tableRows
    tableRows.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "รวมทั้งหมด",
      //totalAmount.toFixed(2), // แสดงผลรวมสองตำแหน่งทศนิยม
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    doc.text("บริษัท ไทยรุ่งยูเนี่ยนคาร์ จำกัด(มหาชน)", 14, 15);

    doc.setFontSize(13);
    doc.text("รายงานการทำงานล่วงเวลา(OT)", 14, 25);

    doc.autoTable({
      startY: 30,
      head: [tableColumns],
      body: tableRows,
      theme: "grid",
      styles: { font: "courier", fontSize: 10, font: "Kanit" },
      headStyles: {
        fillColor: [71, 71, 71],
        font: "Kanit",
        textColor: [0, 0, 0], // สีดำ
        halign: "center",
        fontSize: 10,
        fillColor: [220, 220, 220],
        lineWidth: 0.1, // ความหนาของเส้นขอบ
      },
    });

    //doc.save("petty_cash_report.pdf");
    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl, "_blank");
  };

  useEffect(() => {
    getData();
    getOtrequest();
  }, [page, pageSize]);

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
                      <div className="col-md-12">
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
                                  <option value="Indirect (s)">
                                    Indirect (s)
                                  </option>
                                </select>
                              </div>
                              <div className="col-md-3">
                                <label htmlFor="">วันที่ทำ OT:</label>
                                <br />
                                <DatePicker
                                  //showIcon
                                  //icon="fa fa-calendar"
                                  style={{ width: "100%" }} // กำหนดความกว้างตรงๆ
                                  wrapperClassName="w-100" // ใช้ class ควบคุม wrapper
                                  className="form-control"
                                  //isClearable
                                  placeholderText="กรุณาเลือกวันที่"
                                  selected={startDate}
                                  onChange={(date) => {
                                    setStartDate(date);
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
                                accessor: "ot_document",
                                title: "เลขที่เอกสาร",
                                textAlignment: "center",
                                render: ({ ot_emp_id }) => {
                                  // ค้นหาข้อมูล otrequest ที่มี ot_emp_id ตรงกับ code ของพนักงาน
                                  const matchedOtRequest = otrequest.find(
                                    (request) => request.ot_emp === ot_emp_id
                                  );

                                  // ถ้าพบข้อมูล ให้แสดง ot_member_id ถ้าไม่พบให้แสดงเครื่องหมาย -
                                  return matchedOtRequest
                                    ? matchedOtRequest.ot_member_id
                                    : "-";
                                },
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
                                accessor: "total_time",
                                title: "เวลารวม",
                                textAlignment: "center",
                                render: (record) => {
                                  // ตรวจสอบว่ามี ot_in_time และ out_time หรือไม่
                                  if (!record.ot_in_time || !record.out_time) {
                                    return "-";
                                  }

                                  const start = dayjs(
                                    "01-01-2024 " + record.ot_in_time
                                  );
                                  const end = dayjs(
                                    "01-01-2024 " + record.out_time
                                  );

                                  let diff = dayjs.duration(end.diff(start));

                                  // ตรวจสอบว่า overtimes.start_date เป็นช่วงที่ต้องหัก 60 นาทีหรือไม่
                                  // if (
                                  //   overtimes &&
                                  //   overtimes.start_date === "8:00 - 17:10" &&
                                  //   record.out_time > "12:00"
                                  // ) {
                                  //   diff = dayjs.duration(diff.asMinutes() - 70, "minutes");
                                  // }

                                  // if (
                                  //   overtimes &&
                                  //   overtimes.start_date === "21:45 - 6:45"
                                  // ) {
                                  //   diff = dayjs.duration(diff.asMinutes() + 1380, "minutes");
                                  // }

                                  const hours = Math.floor(diff.asHours());
                                  const minutes = diff.minutes();

                                  // แสดงเวลาในรูปแบบ ชั่วโมง:นาที
                                  return `${hours
                                    .toString()
                                    .padStart(2, "0")}:${minutes
                                    .toString()
                                    .padStart(2, "0")}`;
                                },
                              },
                              {
                                accessor: "scan_data",
                                title: "สแกนนิ้ว",
                                textAlignment: "center",
                                render: ({ scan_data }) =>
                                  scan_data === null ? (
                                    <span>-</span>
                                  ) : (
                                    scan_data.substring(13, 18) +
                                    " - " +
                                    scan_data.substring(32, 37)
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
                  <div className="card-footer">
                  <div className="float-right">
                      <button
                        className="btn btn-secondary"
                        onClick={handleExportPDF}
                      >
                        <i className="fas fa-download"></i> EXPORT
                      </button>
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
