import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import jsPDF from "jspdf";
import "jspdf-autotable";

// นำเข้าฟอนต์ไทยสำหรับ PDF
import { KanitNomal } from "../../assets/fonts/Kanit-nomal";
import { KanitBold } from "../../assets/fonts/Kanit-bold";

const viewAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  dayjs.extend(duration);
  const [overtimes, setOvertimes] = useState({});
  const [members, setMemebers] = useState([]);
  const [empcount, setEmpcount] = useState(0);

  const getData = async () => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest/" + id, {
        timeout: 5000,
      })
      .then((res) => {
        setOvertimes(res.data.data);
        setMemebers(res.data.data.employees);
        setEmpcount(res.data.data.employees.length);

        //คำนวนเวลาทั้งหมด * จำนวนพนักงาน
        const overtime = res.data.data.total_date; // เวลาล่วงเวลาในรูปแบบ 'ชั่วโมง:นาที'
        const count = res.data.data.employees.length;

        const calculateOvertime = () => {
          // แยกชั่วโมงและนาทีจาก overtime
          const [hours, minutes] = overtime.split(".").map(Number);

          // คำนวณเวลาล่วงเวลาทั้งหมด
          const totalMinutes = (hours * 60 + minutes) * count; // แปลงทั้งหมดเป็นนาที
          const totalHours = Math.floor(totalMinutes / 60); // คำนวณชั่วโมง
          const remainingMinutes = totalMinutes % 60; // คำนวณนาทีที่เหลือ

          // แสดงผลลัพธ์เป็นรูปแบบ 'ชั่วโมง:นาที'
          return `${totalHours}:${
            remainingMinutes < 10 ? "0" : ""
          }${remainingMinutes}`;
        };

        setResult(calculateOvertime);
      });
  };

  const [result, setResult] = useState("");

  const [timeRecord, setTimeRecord] = useState([]);

  const getTimeRecord = () => {
    axios
      .get(
        "http://129.200.6.52/laravel_oracle11g_hrcompu_api/public/api/time-records"
      )
      .then((res) => {
        const time = res.data.time_records;
        setTimeRecord(time);
      });
  };

  useEffect(() => {
    getData();
    getTimeRecord();
  }, []);

  // ฟังก์ชันสำหรับสร้าง PDF
  const generatePDF = () => {
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
    
    // เพิ่มข้อความหัวเอกสาร
    doc.setFontSize(17);
    doc.text("เอกสารการขออนุมัติ OT", 14, 15);
    
    // ข้อมูลส่วนหัว
    doc.setFontSize(12);
    doc.text(`เลขที่คำร้อง: ${overtimes.ot_member_id || '-'}`, 14, 25);
    doc.text(`ผู้จัดการฝ่าย: ${overtimes.name_app_3 || '-'}`, 80, 25);
    doc.text(`ผู้ควบคุมงาน: ${overtimes.create_name || '-'}`, 150, 25);
    doc.text(`หน่วยงาน: ${overtimes.department || '-'}`, 220, 25);
    
    doc.text(`วันที่ทำงาน: ${overtimes.ot_date ? dayjs(overtimes.ot_date).format("DD-MM-YYYY") : '-'}`, 14, 32);
    doc.text(`เวลาที่ทำ OT: ${overtimes.start_date ? overtimes.start_date + ' น.' : '-'}`, 80, 32);
    doc.text(`เวลารวม: ${overtimes.total_date || '-'}`, 150, 32);
    doc.text(`พนักงาน: ${empcount} คน`, 200, 32);
    doc.text(`รวมทั้งหมด: ${result} ชม.`, 240, 32);
    
    // สร้างตารางพนักงาน
    const tableColumn = [
      "#", "รหัส", "ชื่อพนักงาน", "ประเภทค่าแรง", "ชนิดของงาน", 
      "เป้าหมาย", "ทำได้จริง", "ข้อมูลสแกนนิ้ว", "เวลาเลิกงาน", 
      "รวมเวลา", "รถรับส่ง", "ค่าเดินทาง", "หมายเหตุ"
    ];
    
    // สร้างข้อมูลแถวสำหรับตาราง
    const tableRows = [];
    
    members.forEach((member, index) => {
      const start = dayjs("01-01-2024 " + (member.ot_in_time || "00:00"));
      const end = dayjs("01-01-2024 " + (member.out_time || "00:00"));
      
      let diff = dayjs.duration(end.diff(start));
      
      // ตรวจสอบว่า overtimes.start_date เป็นช่วงที่ต้องหัก 60 นาทีหรือไม่
      if (
        overtimes.start_date === "8:00 - 17:10" &&
        member.out_time > "12:00"
      ) {
        diff = dayjs.duration(diff.asMinutes() - 70, "minutes");
      }
      
      if (overtimes.start_date === "21:45 - 6:45") {
        diff = dayjs.duration(diff.asMinutes() + 1380, "minutes");
      }
      
      const hours = Math.floor(diff.asHours());
      const minutes = diff.minutes();
      
      // ข้อมูลสแกนนิ้ว
      let scanInfo = "ไม่มีข้อมูล...";
      const scanData = timeRecord.filter(
        (r) => r.dl_date && r.dl_date.startsWith(overtimes.ot_date) && r.em_code === member.code
      );
      
      if (scanData.length > 0) {
        const scan = scanData[0];
        if (scan.dl_sacttime !== null && scan.dl_eacttime !== null) {
          scanInfo = `${scan.dl_sacttime.substring(11, 16)} - ${scan.dl_eacttime.substring(11, 16)}`;
        }
      }
      
      const totalTime = member.out_time === null 
        ? "-" 
        : `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      
      const tableRow = [
        index + 1,
        member.code || "-",
        member.emp_name || "-",
        member.cost_type || "-",
        member.job_type || "-",
        member.target || "-",
        member.objective || "-",
        scanInfo,
        member.out_time || "-",
        totalTime,
        member.bus_stations || "-",
        member.bus_price || "-",
        member.remark || "-"
      ];
      
      tableRows.push(tableRow);
    });
    
    // สร้างตาราง
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      startY: 40,
      styles: {
        cellPadding: 1,
        fontSize: 10, 
        font: "Kanit"
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        halign: "center",
        fontSize: 10,
        lineWidth: 0.1,
      },
     
    //   didDrawPage: function(data) {
    //     // แสดงหมายเลขหน้า
    //     doc.text(
    //       'หน้า ' + doc.getNumberOfPages(),
    //       data.settings.margin.left,
    //       doc.internal.pageSize.height - 10
    //     );
    //   }
    });
    
// เพิ่มข้อมูลผู้อนุมัติ
const finalY = doc.lastAutoTable.finalY + 15;
const leftMargin = 14; // กำหนดย่อหน้าเริ่มต้น

// คำนวณความกว้างของหน้าเอกสารและระยะห่างระหว่างคอลัมน์
const pageWidth = doc.internal.pageSize.width;
const usableWidth = pageWidth - (leftMargin * 2); // พื้นที่ใช้งานได้หลังหักระยะขอบ
const numColumns = 4; // จำนวนคอลัมน์
const columnWidth = usableWidth / numColumns; // ความกว้างของแต่ละคอลัมน์

// คำนวณตำแหน่งกึ่งกลางของแต่ละคอลัมน์
const col1 = leftMargin + (columnWidth / 2);
const col2 = col1 + columnWidth;
const col3 = col2 + columnWidth;
const col4 = col3 + columnWidth;

// ตั้งค่าตัวหนาสำหรับตำแหน่ง
doc.setFont(undefined, 'bold');

// หัวหน้าหน่วย/ผู้จัดทำ - ตัวหนา และจัดกึ่งกลาง
doc.text(`ผู้จัดทำ`, col1, finalY, { align: 'center' });
// กลับไปเป็นตัวปกติสำหรับชื่อ
doc.setFont(undefined, 'normal');
doc.text(`${overtimes.name_app_1 || '-'}`, col1, finalY + 7, { align: 'center' });

// หัวหน้าส่วน - ตัวหนา และจัดกึ่งกลาง
doc.setFont(undefined, 'bold');
doc.text(`หัวหน้าส่วน`, col2, finalY, { align: 'center' });
// กลับไปเป็นตัวปกติสำหรับชื่อ
doc.setFont(undefined, 'normal');
doc.text(`${overtimes.name_app_2 || '-'}`, col2, finalY + 7, { align: 'center' });

// ผู้จัดการฝ่าย - ตัวหนา และจัดกึ่งกลาง
doc.setFont(undefined, 'bold');
doc.text(`ผู้จัดการฝ่าย`, col3, finalY, { align: 'center' });
// กลับไปเป็นตัวปกติสำหรับชื่อ
doc.setFont(undefined, 'normal');
doc.text(`${overtimes.name_app_3 || '-'}`, col3, finalY + 7, { align: 'center' });

// ผู้จัดการอาวุโส - ตัวหนา และจัดกึ่งกลาง
doc.setFont(undefined, 'bold');
doc.text(`ผู้จัดการอาวุโส`, col4, finalY, { align: 'center' });
// กลับไปเป็นตัวปกติสำหรับชื่อ
doc.setFont(undefined, 'normal');
doc.text(`${overtimes.name_app_4 || '-'}`, col4, finalY + 7, { align: 'center' });

// วันที่จัดทำ - จัดให้อยู่ตรงกลางหน้ากระดาษ
const pageCenter = pageWidth / 2;
doc.text(`วัน/เวลาที่จัดทำ: ${overtimes.created_at ? dayjs(overtimes.created_at).format('DD-MMM-YYYY, HH:mm:ss') : '-'}`, pageCenter, finalY + 20, { align: 'center' });

    // บันทึกไฟล์ PDF
    // const filename = `OT-Request-${overtimes.ot_member_id || id}-${dayjs().format('YYYYMMDD_HHmmss')}.pdf`;
    // doc.save(filename);
    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl, "_blank");
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">ข้อมูลการขออนุมัติ OT</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to={"/"}>หน้าหลัก</Link>
                  </li>
                  <li className="breadcrumb-item">การขออนุมัติ</li>
                  <li className="breadcrumb-item active">ข้อมูลการขออนุมัติ</li>
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
                        <div className="col-md-12">
                          <table className="table table-borderless mt-3">
                            <thead>
                              <tr>
                                <td>
                                  <b>เลขที่คำร้อง</b> : {overtimes.ot_member_id}
                                </td>
                                <td>
                                  <b>ผู้จัดการฝ่าย</b> : {overtimes.name_app_3}
                                </td>
                                <td>
                                  <b>ผู้ควบคุมงาน</b> : {overtimes.create_name}
                                </td>
                                <td>
                                  <b>หน่วยงาน</b> : {overtimes.department}
                                </td>
                                <td>
                                  <b>ประเภทงาน</b> : {overtimes.work_type}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>วันที่ทำงาน</b> :{" "}
                                  {dayjs(overtimes.ot_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td>
                                  <b>เวลาที่ทำ OT</b> : {overtimes.start_date}{" "}
                                  น.
                                </td>
                                <td>
                                  <b>เวลารวม</b> : {overtimes.total_date}
                                </td>
                                <td>
                                  <b>พนักงาน</b> : {empcount} คน{" "}
                                </td>
                                <td>
                                  <b>รวมทั้งหมด</b> : {result} ชม.
                                </td>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        <div className="col-md-12">
                          <table className="table table-bordered mt-3">
                            <thead>
                              <tr align={"center"}>
                                <th>#</th>
                                <th>รหัส</th>
                                <th>ชื่อพนักงาน</th>
                                <th>ประเภทค่าแรง</th>
                                <th>ชนิดของงาน</th>
                                <th>เป้าหมาย</th>
                                <th>ทำได้จริง</th>
                                <th>ข้อมูลสแกนนิ้ว</th>
                                <th>เวลาเลิกงาน</th>
                                <th>รวมเวลา</th>
                                <th>รถรับส่ง</th>
                                <th>ค่าเดินทาง</th>
                                <th>หมายเหตุ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {members.map((member, index) => {
                                const start = dayjs(
                                  "01-01-2024 " + member.ot_in_time
                                );
                                const end = dayjs(
                                  "01-01-2024 " + member.out_time
                                );

                                let diff = dayjs.duration(end.diff(start));

                                // ตรวจสอบว่า overtimes.start_date เป็นช่วงที่ต้องหัก 60 นาทีหรือไม่
                                if (
                                  overtimes.start_date === "8:00 - 17:10" &&
                                  member.out_time > "12:00"
                                ) {
                                  diff = dayjs.duration(
                                    diff.asMinutes() - 70,
                                    "minutes"
                                  );
                                }

                                if (overtimes.start_date === "21:45 - 6:45") {
                                  diff = dayjs.duration(
                                    diff.asMinutes() + 1380,
                                    "minutes"
                                  );
                                }

                                const hours = Math.floor(diff.asHours());
                                const minutes = diff.minutes();
                                return (
                                  <tr align="center" key={member.id}>
                                    <td>{index + 1}</td>
                                    <td>{member.code}</td>
                                    <td>{member.emp_name}</td>
                                    <td>{member.cost_type}</td>
                                    <td>{member.job_type}</td>
                                    <td>{member.target}</td>
                                    <td className="text-secondary">
                                      {member.objective === null ? (
                                        <i className="fas fa-pencil-alt"></i>
                                      ) : (
                                        member.objective
                                      )}
                                    </td>
                                    <td>
                                    {timeRecord.filter(
                                        (r) =>
                                          r.dl_date.startsWith(
                                            overtimes.ot_date
                                          ) && r.em_code === member.code
                                      ).length === 0 ? (
                                        <div className="text-muted">
                                          ไม่มีข้อมูล...
                                        </div>
                                      ) : (
                                        timeRecord
                                          .filter(
                                            (r) =>
                                              r.dl_date.startsWith(
                                                overtimes.ot_date
                                              ) && r.em_code === member.code
                                          )
                                          .map((s, index) => (
                                            <div key={index} className="text-muted">
                                              {s.dl_sacttime === null || s.dl_eacttime === null
                                                ? "ไม่มีข้อมูล..."
                                                : `${s.dl_sacttime.substring(
                                                    11,
                                                    16
                                                  )} - ${s.dl_eacttime.substring(
                                                    11,
                                                    16
                                                  )}`}
                                            </div>
                                          ))
                                      )}
                                    </td>
                                    <td className="text-secondary">
                                      {member.out_time === null ? (
                                        <i className="fas fa-pencil-alt"></i>
                                      ) : (
                                        member.out_time
                                      )}
                                    </td>
                                    <td className="text-secondary">
                                      {member.out_time === null ? (
                                        <i className="fas fa-pencil-alt"></i>
                                      ) : (
                                        `${hours
                                          .toString()
                                          .padStart(2, "0")}:${minutes
                                          .toString()
                                          .padStart(2, "0")}`
                                      )}
                                    </td>
                                    <td>{member.bus_stations}</td>
                                    <td>{member.bus_price}</td>
                                    <td className="text-secondary">
                                      {member.remark === null ? (
                                        <i className="fas fa-pencil-alt"></i>
                                      ) : (
                                        member.remark
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-12">
                          <table className="table table-borderless mt-5">
                            <thead>
                              <tr align="center">
                                <td>
                                  <b>หัวหน้าหน่วย/ผู้จัดทำ</b> :{" "}
                                  {overtimes.name_app_1}<br/>
                                  <b>วัน/เวลาที่จัดทำ</b> :{" "}{dayjs(overtimes.created_at).format('DD-MMM-YYYY, HH:mm:ss')}
                                </td>
                                <td>
                                  <b>หัวหน้าส่วน</b> : {overtimes.name_app_2}
                                </td>
                                <td>
                                  <b>ผู้จัดการฝ่าย</b> : {overtimes.name_app_3}
                                </td>
                                <td>
                                  <b>ผู้จัดการอาวุโส</b> :{" "}
                                  {overtimes.name_app_4}
                                </td>
                              </tr>
                            </thead>
                          </table>
                        </div>
                        <div className="col-md-12 mt-3">
                          <div className="float-right">
                            <button
                              onClick={generatePDF}
                              className="btn btn-success"
                            >
                              <i className="fas fa-download"></i>{" "}
                              EXPORT
                            </button>{" "}
                            <button
                              onClick={() => navigate(-1)}
                              className="btn btn-danger"
                            >
                              <i className="fas fa-arrow-circle-left"></i>{" "}
                              ย้อนกลับ
                            </button>
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
      </div>
    </>
  );
};

export default viewAdmin;