import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { useAuthUser } from "react-auth-kit";
import Badge from 'react-bootstrap/Badge';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link,useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const Approver = () => {
  //user login
  const userDatail = useAuthUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [overtimes, setOvertimes] = useState([]);
  const [approver, setApprover] = useState([]);
  const [startDate, setStartDate] = useState("");

  const [selectedRecords, setSelectedRecords] = useState([]);

  // useEffect(() => {
  //   setPage(1);
  // }, [pageSize]);

  useEffect(() => {
        const savedPage = searchParams.get("page");
        const savedPageSize = searchParams.get("pageSize");
      
        if (savedPage) setPage(Number(savedPage)); // โหลดค่าจาก URL
        if (savedPageSize) setPageSize(Number(savedPageSize));
      }, []);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState(overtimes.slice(0, pageSize));

  const getData = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    const userRole = userDatail().role; // Assuming userDatail() returns the user details
    const userAgency = userDatail().agency;

    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        let filteredData = res.data.data;

        //กรณี approver 1 ดูแลหลายหน่วยงาน
        if (userRole === "approver_1") {
          if (userAgency === "AFD_GROUP_1") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "หน่วย E3" || item.department === "FED"
            );
          } else if (userAgency === "PLD_GROUP_1") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "กลุ่มงานวางแผนการผลิต-โรงประกอบ" ||
                item.department === "กลุ่มงานวางแผนการผลิต-โรงผลิตชิ้นส่วน" ||
                item.department === "หน่วย ควบคุมวัตถุดิบ(MC)"
            );
          } else if (userAgency === "PLD_GROUP_2") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "หน่วย Logistic 1 - Machinery" ||
                item.department === "หน่วย Logistic 2 - OEM" ||
                item.department === "หน่วย คลังสินค้าโรงผลิตชิ้นส่วน(SP)" ||
                item.department === "หน่วย คลังสินค้าโรงประกอบ 1" ||
                item.department === "หน่วย คลังสินค้าโรงประกอบ 2"
            );
          } else if (userAgency === "QAD_GROUP_1") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "หน่วย PQC" ||
                item.department === "หน่วย QC"
            );
          } else if (userAgency === "PRD_GROUP_1") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "หน่วย M2" || item.department === "หน่วย M3"
            );
          } else if (userAgency === "PRD_GROUP_2") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "ส่วนสี" ||
                item.department === "หน่วย I" ||
                item.department === "หน่วย K2" ||
                item.department === "หน่วย J2" ||
                item.department === "หน่วย V2 (07-63)" ||
                item.department === "หน่วย J1 (07-63)"
            );
          } else if (userAgency === "PRD_GROUP_3") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "หน่วย ติดตั้งอุปกรณ์" ||
                item.department === "หน่วย ติดตั้งอุปกรณ์ CAB (07-67)"
            );
          } else if (userAgency === "PED_GROUP_1") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "ส่วนพัฒนาระบบการผลิตชิ้นส่วน" ||
                item.department === "หน่วย ซ่อมสร้าง"
            );
          } else if (userAgency === "AED_GROUP_1") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "ส่วนโครงการใหม่งานประกอบและผลิตรถยนต์" ||
                item.department === "ส่วนประกันคุณภาพงานโครงการใหม่ (10-67)"
            );
          } else if (userAgency === "TED_GROUP_1") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "ฝ่ายวิศวกรรมแม่พิมพ์และจิ๊ก" || 
              item.department === "ส่วนวิศวกรรมแม่พิมพ์และจิ๊ก" || 
              item.department === "กลุ่มงานต้นทุน (07-63)"
            );
          } else if (userAgency === "PPD_GROUP_1") {
            filteredData = filteredData.filter(
              (item) =>
                item.department === "หน่วย บี1" ||
                item.department === "หน่วย ซี4" ||
                item.department === "หน่วย เอฟ" ||
                item.department === "หน่วย บี2" ||
                item.department === "หน่วย ซ่อมบำรุงแม่พิมพ์และขึ้นรูปฯ"
            );
          } else {
            filteredData = filteredData.filter(
              (item) => item.department === userAgency
            );
          }
        } else if (userAgency === "QAD_GROUP_1") {
          filteredData = filteredData.filter(
            (item) =>
              item.department === "หน่วย PQC" || item.department === "หน่วย QC"
          );
        } else if (userRole === "approver_2") {
          if (userAgency === "PED_AED") {
            filteredData = filteredData.filter(
              (item) => item.dept === "PED" || item.dept === "AED"
            );
          } else {
            filteredData = filteredData.filter(
              (item) => item.dept === userDatail().dept
            );
          }
        } else if (userRole === "approver_3" && userAgency === "MD_GROUP_1") {
          filteredData = filteredData.filter(
            (item) =>
              item.dept === "PLD" ||
              item.dept === "FED" ||
              item.dept === "QAD" ||
              item.dept === "PPD" ||
              item.dept === "PRD"
          );
        } else if (userRole === "approver_3" && userAgency === "MD_GROUP_2") {
          filteredData = filteredData.filter(
            (item) =>
              item.dept === "AED" ||
              item.dept === "PED" ||
              item.dept === "RDD"
          );
        } else if (userRole === "approver_3" && userAgency === "MD_GROUP_3") {
          filteredData = filteredData.filter(
            (item) =>
              item.dept === "DMD" ||
              item.dept === "TED"
          );
        }

        setOvertimes(filteredData);
        setRecords(filteredData.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by ot code
  const codeFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        // First filter by department
        const deptFiltered = res.data.data.filter(
          (item) => item.dept === userDatail().dept
        );

        // Then filter by key if it exists
        const keyFiltered = key
          ? deptFiltered.filter((item) =>
              Object.values(item).some(
                (value) =>
                  value &&
                  value.toString().toLowerCase().includes(key.toLowerCase())
              )
            )
          : deptFiltered;

        setOvertimes(keyFiltered);
        console.log(keyFiltered);
        setRecords(keyFiltered.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by department name
  const nameFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        // First filter by department
        const deptFiltered = res.data.data.filter(
          (item) => item.dept === userDatail().dept
        );

        // Then filter by key if it exists
        const keyFiltered = key
          ? deptFiltered.filter((item) =>
              Object.values(item).some(
                (value) =>
                  value &&
                  value.toString().toLowerCase().includes(key.toLowerCase())
              )
            )
          : deptFiltered;

        setOvertimes(keyFiltered);
        console.log(keyFiltered);
        setRecords(keyFiltered.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by status
  const statusFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-status?dept=${
          userDatail().dept
        }&data=${key}`
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        console.log(overtimes);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by date
  const dateFilter = async (key) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        `${import.meta.env.VITE_API_KEY}/api/otrequests-filter-date?dept=${
          userDatail().dept
        }&data=${key}`
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
        console.log(overtimes);
        setRecords(res.data.otrequest.slice(from, to));
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   getData();
  //   getApprover();
  // }, [page, pageSize, selectedRecords]);

    useEffect(() => {
       getData();
       setSearchParams({ page, pageSize }); // อัปเดตค่าใน URL
     }, [page, pageSize, selectedRecords, setSearchParams]);

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
      title: "ยืนยันการอนุมัติ",
      text: "คุณต้องการอนุมัติการรายงานผลใช่ไหม",
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
      title: "ยืนยันการอนุมัติ",
      text: "คุณต้องการอนุมัติการรายงานผลใช่ไหม test",
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

  const handleRejectSubmit = async (blogs) => {
    await Swal.fire({
      title: "ยืนยันการไม่อนุมัติ OT",
      text: "กรุณากรอกเหตุผล หากท่านไม่ต้องการอนุมัติ ",
      icon: "error",
      // input: "text",
      // inputValidator: (value) => {
      //   if (!value) {
      //     return 'You need to write something!';
      //   }
      // },
      //inputPlaceholder: "Enter your text here",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "error",
          title: "ระบบได้ทำการไม่อนุมัติ OT เรียบร้อยแล้ว ",
          showConfirmButton: false,
          timer: 2000,
        });
        setLoading(true);
        axios
          .put(
            import.meta.env.VITE_API_KEY + "/api/otrequest-reject/" + blogs.id
            // data, {text:value}
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

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = "_" + month + "_" + date + "_" + year;

  // Text export function
  const textExport = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_KEY + "/api/otrequest-export",
        { responseType: "blob" }
      );
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "text/plain" });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ot_request_export" + currentDate + ".txt");
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

  const handleApproveAll = async () => {
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
          .put(import.meta.env.VITE_API_KEY + "/api/otrequest-approve-all", {
            items: selectedRecords,
          })
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

  const handleApproveAll_2 = async () => {
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
          .put(import.meta.env.VITE_API_KEY + "/api/otrequest-approve-all-2", {
            items: selectedRecords,
          })
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

  const handleApproveAll_3 = async () => {
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
          .put(import.meta.env.VITE_API_KEY + "/api/otrequest-approve-all-3", {
            items: selectedRecords,
          })
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
                      <div className="col-lg-12">
                        <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12">
                                {/* approv all for approver 3 */}
                                <button
                                  onClick={handleApproveAll}
                                  disabled={selectedRecords.length === 0}
                                  className="btn btn-success float-right"
                                  hidden={
                                    userDatail().role !== "approver_3"
                                      ? true
                                      : false
                                  }
                                >
                                  <i className="fas fa-check-circle"></i> All
                                </button>{" "}
                                {/* approv all for approver 2 */}
                                <button
                                  onClick={handleApproveAll_3}
                                  disabled={
                                    selectedRecords.length === 0 ||
                                    !selectedRecords.every(
                                      (record) =>
                                        record.result === "รอการปิด (ผจก)"
                                    )
                                  }
                                  className="btn btn-warning text-white float-right"
                                  hidden={
                                    userDatail().role !== "approver_2"
                                      ? true
                                      : false
                                  }
                                >
                                  <i className="fas fa-check-circle"></i> All
                                </button>
                                <button
                                  onClick={handleApproveAll_2}
                                  disabled={
                                    selectedRecords.length === 0 ||
                                    selectedRecords.every(
                                      (record) =>
                                        record.result === "รอการปิด (ผจก)"
                                    )
                                  }
                                  className="btn btn-success float-right mr-1"
                                  hidden={
                                    userDatail().role !== "approver_2"
                                      ? true
                                      : false
                                  }
                                >
                                  <i className="fas fa-check-circle"></i> All
                                </button>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">เลขที่คำร้อง</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="กรุณากรอกข้อมูล"
                                    onChange={(event) =>
                                      codeFilter(event.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">ผู้ควบคุมงาน</label>
                                  <input
                                    placeholder="กรุณากรอกข้อมูล"
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                      nameFilter(event.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-md-3">
                                <div className="form-group">
                                  <label htmlFor="">สถานะการอนุมัติ</label>
                                  <select
                                    className="form-control"
                                    id="sel1"
                                    onChange={(event) =>
                                      statusFilter(event.target.value)
                                    }
                                  >
                                    <option defaultValue="">
                                      กรุณาเลือกข้อมูล
                                    </option>
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
                              {/* <div className="col-md-12">
                                <button
                                  onClick={handleApproveAll}
                                  disabled={selectedRecords.length === 0}
                                  className="btn btn-info float-right"
                                >
                                  <i className="fas fa-check-circle"></i>{" "}All
                                </button>
                              </div> */}
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
                          title: "สถานะรายงาน",
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

                        // {
                        //   accessor: "start_date",
                        //   title: "เวลาเริ่มต้น",
                        //   textAlignment: "center",
                        //   render: ({ start_date }) => start_date + " น.",
                        // },
                        // {
                        //   accessor: "end_date",
                        //   title: "เวลาสิ้นสุด",
                        //   textAlignment: "center",
                        //   render: ({ end_date }) => end_date + " น.",
                        // },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "ดำเนินการ",
                          render: (blogs) => (
                            <>
                              <Link
                                to={"/approver/view/" + blogs.id}
                                className="btn btn-primary"
                              >
                                <i className="fas fa-bars"></i>
                              </Link>{" "}
                              {blogs.result != "รอการปิด (ส่วน)" ? (
                                <>
                                  <button
                                    disabled
                                    className="btn btn-info"
                                    hidden={userDatail().role !== "approver_1"}
                                  >
                                    <i className="far fa-edit"></i>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <Link
                                    to={"/approver/edit/" + blogs.id}
                                    className="btn btn-info"
                                    hidden={userDatail().role !== "approver_1"}
                                  >
                                    <i className="far fa-edit"></i>
                                  </Link>
                                </>
                              )}{" "}
                              <button
                                className="btn btn-success"
                                onClick={() => handleApproverSubmit2(blogs)}
                                hidden={
                                  userDatail().role === "approver_1"
                                    ? false
                                    : true
                                }
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
                                hidden={
                                  userDatail().role === "approver_2"
                                    ? false
                                    : true
                                }
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
                                hidden={
                                  userDatail().role === "approver_3"
                                    ? false
                                    : true
                                }
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
                                hidden={
                                  userDatail().role === "approver_1"
                                    ? false
                                    : true
                                }
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
                                hidden={
                                  userDatail().role === "approver_2"
                                    ? false
                                    : true
                                }
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
                                disabled={
                                  blogs.status !== "ผ่านการอนุมัติ"
                                    ? false
                                    : true
                                }
                              >
                                <i className="fas fa-times-circle"></i>{" "}
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
                      onPageChange={(p) => setPage(p)}
                      recordsPerPageOptions={PAGE_SIZES}
                      onRecordsPerPageChange={setPageSize}
                      selectedRecords={selectedRecords}
                      onSelectedRecordsChange={setSelectedRecords}
                      isRecordSelectable={(record) =>
                        (record.status === "รอการอนุมัติ 3" &&
                          userDatail().role === "approver_3") ||
                        (record.status === "รอการอนุมัติ 2" &&
                          userDatail().role === "approver_2") ||
                        (record.status === "ผ่านการอนุมัติ" &&
                          record.result === "รอการปิด (ผจก)")
                      }
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

export default Approver;
