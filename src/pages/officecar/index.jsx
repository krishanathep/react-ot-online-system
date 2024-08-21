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
  const [empcount, setEmpCount] = useState([]);

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
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        //Change api name
        setOvertimes(res.data.data);
        setRecords(res.data.data.slice(from, to));
        setLoading(false);
      });
  };

  //filter function by date
  const dateFilter = async () => {
    await axios
      .get(
        import.meta.env.VITE_API_KEY +
          "/api/otrequests"
      )
      .then((res) => {
        setOvertimes(res.data.otrequest);
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
              <div className="col-md-12">
                <div className="card card-outline card-primary">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="">วันที่จัดทำ OT</label>
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
                        <table className="table table-bordered">
                          <thead>
                            <tr align={"center"}>
                              <th>#</th>
                              <th>รหัสพนักงาน</th>
                              <th>ชื่อพนักงาน</th>
                              <th>หน่วยงาน</th>
                              <th>รถรับส่ง จุดที่ 1</th>
                              <th>รถรับส่ง จุดที่ 2</th>
                              <th>รถรับส่ง จุดที่ 3</th>
                              <th>รถรับส่ง จุดที่ 4</th>
                              <th>ค่าเดินทาง</th>
                            </tr>
                          </thead>
                          <tbody>
             
                          </tbody>
                        </table>
                        {/* <table className="table table-bordered">
                          <thead>
                            <tr align={"center"}>
                              <th>#</th>
                              <th>รหัสพนักงาน</th>
                              <th>ชื่อพนักงาน</th>
                              <th>หน่วยงาน</th>
                              <th>รถรับส่ง จุดที่ 1</th>
                              <th>รถรับส่ง จุดที่ 2</th>
                              <th>รถรับส่ง จุดที่ 3</th>
                              <th>รถรับส่ง จุดที่ 4</th>s
                              <th>ค่าเดินทาง</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table> */}
                        <span>
                          <b>จุดรถรับ-ส่ง</b> 1. สายศาลายา 2. สายนครชัยศรี 3.
                          สายหนองแขม 4. สายวงเวียนใหญ่
                        </span>
                        <div className="float-right">
                          <button className="btn btn-primary">SUBMIT</button>{" "}
                          <Link className="btn btn-danger">CANCEL</Link>
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

export default OfficeCar;
