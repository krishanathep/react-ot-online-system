import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import jsPDF from "jspdf";
//import "jspdf-autotable";
import axios from "axios";
import dayjs from "dayjs";

// นำเข้าฟอนต์ไทยสำหรับ PDF
//import { KanitNomal } from "../../../assets/fonts/Kanit-nomal.jsx";
//import { KanitBold } from "../../../assets/fonts/Kanit-bold.jsx";

const PAGE_SIZES = [10, 20, 30];

const Report = () => {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState(employees.slice(0, pageSize));

  const getData = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest-employees")
      .then((res) => {
        setEmployees(res.data.employees);
        setRecords(res.data.employees.slice(from, to));
        setLoading(false);
        console.log(res);
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
      "วันที่จัดทำ",
      "เลขที่บัญชี",
      "เลขที่เอกสาร",
      "จ่ายเงินให้",
      "ฝ่าย",
      "Account",
      "Costcenter",
      "Project",
      "Product",
      "จำนวนเงิน",
      "ค่าเดินทาง",
      "ค่าทางด่วน",
      "ค่าเบี้ยเลี้ยง",
      "ค่าปรับ",
      "ค่ารับรอง",
      "วัสดุสิ้นเปลือง",
      "ค่าโทรศัพท์",
      "ค่าอื่นๆ",
    ];

    const tableRows = records.map((record, index) => {
      const payListByType = (type) =>
        record.pay_list
          .filter((pay) => pay.pay_type === type)
          .map((pay) => pay.amount)
          .join(", ");

      return [
        index + 1,
        dayjs(record.created_at).format("DD-MMM-YYYY"),
        record.afd_id,
        record.petty_cash_id,
        record.pay_to,
        record.dept,
        record.pay_list.map((pay) => pay.acc_id.substring(7, 14)).join(", "),
        record.pay_list.map((pay) => pay.acc_id.substring(15, 22)).join(", "),
        record.pay_list.map((pay) => pay.acc_id.substring(23, 35)).join(", "),
        record.pay_list.map((pay) => pay.acc_id.substring(36, 40)).join(", "),
        record.total,
        payListByType("ค่าเดินทาง"),
        payListByType("ค่าทางด่วน"),
        payListByType("ค่าเบี้ยเลี้ยง"),
        payListByType("ค่าปรับ"),
        payListByType("ค่ารับรอง"),
        payListByType("วัสดุสิ้นเปลือง"),
        payListByType("ค่าโทรศัพท์"),
        payListByType("เบ็ดเตล็ด"),
      ];
    });

    // คำนวณผลรวมของจำนวนเงินทั้งหมด
    const totalAmount = records.reduce((sum, record) => sum + record.total, 0);

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
      totalAmount.toFixed(2), // แสดงผลรวมสองตำแหน่งทศนิยม
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
    doc.text("รายงานการสั่งจ่ายเงินสดย่อย", 14, 25);

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
  }, [page, pageSize]);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">All OT REPORT</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item active">REPORT</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <dir className="col-md-3">
                                <label htmlFor="">รหัสพนักงาน:</label>
                                <input type="text" className="form-control" />
                              </dir>
                              <dir className="col-md-3">
                                <label htmlFor="">รหัสพนักงาน:</label>
                                <input type="text" className="form-control" />
                              </dir>
                              <dir className="col-md-3">
                                <label htmlFor="">รหัสพนักงาน:</label>
                                <input type="text" className="form-control" />
                              </dir>
                              <dir className="col-md-3">
                                <label htmlFor="">รหัสพนักงาน:</label>
                                <input type="text" className="form-control" />
                              </dir>
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
                              width: 50,
                              render: (record) => records.indexOf(record) + 1,
                            },
                            {
                              accessor: "code",
                              title: "รหัส",
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
                              title: "ชนิดงาน",
                              textAlignment: "center",
                            },
                            {
                              accessor: "target",
                              title: "เป้าหมาย",
                              textAlignment: "center",
                            },
                            {
                              accessor: "ot_create_date",
                              title: "วันที่ทำ OT",
                              textAlignment: "center",
                              render: ({ ot_create_date }) =>
                                dayjs(ot_create_date).format("DD-MM-YYYY"),
                            },
                            {
                              accessor: "created_at",
                              title: "วันที่ขอ OT",
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
        </div>
      </div>
    </>
  );
};

export default Report;
