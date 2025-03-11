import React, { useState, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";
import axios from "axios";

export default function Home() {
  //user login
  const userDatail = useAuthUser();

  const [overtimes, setOvertimes] = useState(0);
  const [inprogress1, setInprogress1] = useState(0);
  const [approved1, setApproved1] = useState(0);
  const [rejected, setRejected] = useState(0);

  const getAll = async () => {
    if (userDatail().role === "admin") {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          const counter1 = res.data.data.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = res.data.data.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = res.data.data.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(res.data.data.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (userDatail().role === "user") {
      await axios
        .get(
          import.meta.env.VITE_API_KEY +
            "/api/otrequests-agency?data=" +
            userDatail().agency
        )
        .then((res) => {
          const counter1 = res.data.otrequests.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = res.data.otrequests.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = res.data.otrequests.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(res.data.otrequests.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "AFD_GROUP_1"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) => ot.department === "FED" || ot.department === "หน่วย E3"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "PLD_GROUP_1"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) =>
              ot.department === "กลุ่มงานวางแผนการผลิต-โรงประกอบ" ||
              ot.department === "กลุ่มงานวางแผนการผลิต-โรงผลิตชิ้นส่วน" ||
              ot.department === "หน่วย ควบคุมวัตถุดิบ(MC)"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "PLD_GROUP_2"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) =>
              ot.department === "หน่วย Logistic 1 - Machinery" ||
              ot.department === "หน่วย Logistic 2 - OEM" ||
              ot.department === "หน่วย คลังสินค้าโรงผลิตชิ้นส่วน(SP)" ||
              ot.department === "หน่วย คลังสินค้าโรงประกอบ 1" ||
              ot.department === "หน่วย คลังสินค้าโรงประกอบ 2"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "QAD_GROUP_1"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) =>
              ot.department === "หน่วย QC" || ot.department === "หน่วย PQC"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "PRD_GROUP_1"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) => ot.department === "หน่วย M2" || ot.department === "หน่วย M3"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "PRD_GROUP_2"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) =>
              ot.department === "ส่วนสี" ||
              ot.department === "หน่วย I" ||
              ot.department === "หน่วย K2" ||
              ot.department === "หน่วย J2" ||
              ot.department === "หน่วย V2 (07-63)" ||
              ot.department === "หน่วย J1 (07-63)"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "PRD_GROUP_3"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) =>
              ot.department === "หน่วย ติดตั้งอุปกรณ์" ||
              ot.department === "หน่วย ติดตั้งอุปกรณ์ CAB (07-67)"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "AFD_GROUP_1"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) => ot.department === "FED" || ot.department === "หน่วย E3"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "PED_GROUP_1"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) =>
              ot.department === "ส่วนพัฒนาระบบการผลิตชิ้นส่วน" ||
              ot.department === "หน่วย ซ่อมสร้าง"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "AED_GROUP_1"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) =>
              ot.department === "ส่วนโครงการใหม่งานประกอบและผลิตรถยนต์" ||
              ot.department === "ส่วนประกันคุณภาพงานโครงการใหม่ (10-67)"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_1" &&
      userDatail().agency === "PPD_GROUP_1"
    ) {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) =>
              ot.department === "หน่วย บี1" ||
              ot.department === "หน่วย ซี4" ||
              ot.department === "หน่วย เอฟ" ||
              ot.department === "หน่วย บี2" ||
              ot.department === "หน่วย ซ่อมบำรุงแม่พิมพ์และขึ้นรูปฯ"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (userDatail().role === "approver_1") {
      await axios
        .get(
          import.meta.env.VITE_API_KEY +
            "/api/otrequests-agency?data=" +
            userDatail().agency
        )
        .then((res) => {
          const counter1 = res.data.otrequests.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = res.data.otrequests.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = res.data.otrequests.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(res.data.otrequests.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_2" &&
      userDatail().agency === "PED_AED"
    ) {
      console.log(userDatail().role);
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) => ot.dept === "PED" || ot.dept === "AED"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_3" &&
      userDatail().agency === "MD_GROUP_1"
    ) {
      console.log(userDatail().role);
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) =>
              ot.dept === "PLD" ||
              ot.dept === "FED" ||
              ot.dept === "QAD" ||
              ot.dept === "PRD" ||
              ot.dept === "PPD"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else if (
      userDatail().role === "approver_3" &&
      userDatail().agency === "MD_GROUP_2"
    ) {
      console.log(userDatail().role);
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
        .then((res) => {
          // Filter for PLD and FED departments
          const filteredData = res.data.data.filter(
            (ot) => ot.dept === "RDD" || ot.dept === "PED" || ot.dept === "AED"
          );

          const counter1 = filteredData.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = filteredData.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = filteredData.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(filteredData.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    } else {
      await axios
        .get(
          import.meta.env.VITE_API_KEY +
            "/api/otrequests-dept?data=" +
            userDatail().dept
        )
        .then((res) => {
          const counter1 = res.data.otrequests.filter(
            (ot) =>
              ot.status === "รอการอนุมัติ 1" ||
              ot.status === "รอการอนุมัติ 2" ||
              ot.status === "รอการอนุมัติ 3"
          );
          const counter3 = res.data.otrequests.filter(
            (ot) => ot.status === "ผ่านการอนุมัติ"
          );
          const counter5 = res.data.otrequests.filter(
            (ot) => ot.status === "ไม่ผ่านการอนุมัติ"
          );

          setOvertimes(res.data.otrequests.length);
          setInprogress1(counter1.length);
          setApproved1(counter3.length);
          setRejected(counter5.length);
        });
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">หน้าหลัก</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a className="breadcrumb-item active">หน้าหลัก</a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <div className="small-box bg-primary">
                <div className="inner">
                  <h3>{overtimes}</h3>
                  <p>ขออนุมัติทำ OT</p>
                </div>
                <div className="icon">
                  <i className="fas fa-calendar-plus"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3 className="text-white">{inprogress1}</h3>
                  <p className="text-white">รอการอนุมัติ</p>
                </div>
                <div className="icon">
                  <i className="fas fa-clock"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>{approved1}</h3>
                  <p>ผ่านการอนุมัติ</p>
                </div>
                <div className="icon">
                  <i className="fas fa-user-check"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{rejected}</h3>
                  <p>ไม่ผ่านการอนุมัติ</p>
                </div>
                <div className="icon">
                  <i className="fas fa-user-times"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
