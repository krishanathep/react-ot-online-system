import React, { useState, useEffect } from "react";
import { DataTable } from "mantine-datatable";
import { Modal, Button, Col, Form, Row, Badge } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useAuthUser } from "react-auth-kit";

import Swal from "sweetalert2";
import dayjs from "dayjs";
import axios from "axios";

const PAGE_SIZES = [10, 20, 30];

const Approver = () => {
  //approver popup
  const [approverShow, setApproverShow] = useState(false);
  const ApproverClose = () => setApproverShow(false);

  //reject popup
  const [rejectShow, setRejectShow] = useState(false);
  const RejectClose = () => setRejectShow(false);

  //view popup
  const [viewShow, setViewShow] = useState(false);

  //id for edit
  const [editid, setEditId] = useState("");

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState(blogs.slice(0, pageSize));

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //KSS state
  const [title, setTitle] = useState("");
  const [created, setCreated] = useState("");
  const [objective, setobjective] = useState("");
  const [suggest, setsuggest] = useState("");
  const [suggest_type, setsuggest_type] = useState("");
  const [current, setcurrent] = useState("");
  const [improve, setimprove] = useState("");
  const [results, setresults] = useState("");
  const [status, setStatus] = useState("");
  const [cost, setcost] = useState("");
  const [date, setdate] = useState("");
  const [work_result, setWorkResult] = useState("");
  const [status_result, setStatusResult] = useState("");

  const getData = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;

    await axios
      .get(
        "https://full-stack-app.com/laravel_auth_jwt_api/public/api/ksssystems"
      )
      .then((res) => {
        setBlogs(res.data.ksssystems);
        setRecords(res.data.ksssystems.slice(from, to));
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, [page, pageSize]);

  const handleViewShow = async (blogs) => {
    setViewShow(true);

    await axios
      .get(
        "https://full-stack-app.com/laravel_auth_jwt_api/public/api/ksssystem/" +
          blogs.id
      )
      .then((res) => {
        console.log(res);
        setTitle(res.data.ksssystem.title);
        setobjective(res.data.ksssystem.objective);
        setsuggest(res.data.ksssystem.suggest);
        setsuggest_type(res.data.ksssystem.suggest_type);
        setcurrent(res.data.ksssystem.current);
        setimprove(res.data.ksssystem.improve);
        setresults(res.data.ksssystem.results);
        setcost(res.data.ksssystem.cost);
        setStatus(res.data.ksssystem.status);
        setdate(res.data.ksssystem.date);
        setCreated(res.data.ksssystem.created_at);
        setWorkResult(res.data.ksssystem.work_result);
        setStatusResult(res.data.ksssystem.status_result);
      });
  };

  const ViewClose = () => {
    reset({
      image: "",
      title: "",
      content: "",
      category: "",
      department: "",
    });
    setViewShow(false);
  };

  const handlApproverShow = async (blogs) => {
    setApproverShow(true);
    await axios
      .get(
        "https://full-stack-app.com/laravel_auth_jwt_api/public/api/ksssystem/" +
          blogs.id
      )
      .then((res) => {
        setEditId(res.data.ksssystem.id);
      });
  };

  const handlRejectShow = async (blogs) => {
    setRejectShow(true);
    await axios
      .get(
        "https://full-stack-app.com/laravel_auth_jwt_api/public/api/ksssystem/" +
          blogs.id
      )
      .then((res) => {
        setEditId(res.data.ksssystem.id);
      });
  };

  const handleApproverSubmit = async (data) => {
    const formData = new FormData();

    formData.append("_method", "put");
    formData.append("status", data.status);
    formData.append("status_result", data.status_result);

    await axios
      .post(
        "https://full-stack-app.com/laravel_auth_jwt_api/public/api/ksssystem-approved/" +
          editid,
        formData
      )
      .then((res) => {
        console.log(res.data);
        getData();
        setApproverShow(false);
        setRejectShow(false);
        Swal.fire({
          icon: "success",
          title: "Your KSS has been status update",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">ข้อเสนอแนะทั้งหมด</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าแรก</a>
                  </li>
                  <li className="breadcrumb-item active">ข้อเสนอแนะ</li>
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
                      idAccessor="_id"
                      columns={[
                        {
                          accessor: "index",
                          title: "#",
                          textAlignment: "center",
                          width: 80,
                          render: (record) => records.indexOf(record) + 1,
                        },
                        {
                          accessor: "title",
                          title: "หัวข้อเรื่อง",
                        },
                        { accessor: "objective", title: "วัตถุประสงค์" },
                        { accessor: "suggest_type", title: "ประเภทข้อเสนอแนะ" },
                        {
                          accessor: "status",
                          title: "สถานะการอนุมัติ",
                          textAlignment: "center",
                          render: ({ status }) => {
                            return (
                              <>
                                <h5>
                                  {status === "Approved" ? (
                                    <Badge bg="success">{status}</Badge>
                                  ) : status === "Rejected" ? (
                                    <Badge bg="danger">{status}</Badge>
                                  ) : (
                                    <Badge bg="primary">{status}</Badge>
                                  )}
                                </h5>
                              </>
                            );
                          },
                        },
                        {
                          accessor: "created_at",
                          title: "วันที่จัดทำ",
                          textAlignment: "center",
                          render: ({ created_at }) =>
                            dayjs(created_at).format("DD-MMM-YYYY"),
                        },
                        {
                          accessor: "actions",
                          textAlignment: "center",
                          title: "Actions",
                          width: 300,
                          render: (blogs) => (
                            <>
                              <Button
                                variant="primary"
                                onClick={() => handleViewShow(blogs)}
                              >
                                View
                              </Button>{" "}
                              <Button
                                variant="info"
                                onClick={() => handlApproverShow(blogs)}
                                //disbled button then status = In progress
                                disabled={
                                  blogs.status === "In progress" ? false : true
                                }
                              >
                                Approve
                              </Button>{" "}
                              <Button
                                variant="danger"
                                onClick={() => handlRejectShow(blogs)}
                                //disbled button then status = In progress
                                disabled={
                                  blogs.status === "In progress" ? false : true
                                }
                              >
                                Reject
                              </Button>
                            </>
                          ),
                        },
                      ]}
                      records={records}
                      minHeight={200}
                      totalRecords={blogs.length}
                      recordsPerPage={pageSize}
                      page={page}
                      onPageChange={(p) => setPage(p)}
                      recordsPerPageOptions={PAGE_SIZES}
                      onRecordsPerPageChange={setPageSize}
                    />

                    {/* Approver KSS Madal */}
                    <Modal centered show={approverShow}>
                      <Modal.Header>
                        <Modal.Title>อนุมัติเอกสาร</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          <Row>
                            <Form.Group as={Col} md="12">
                              {/* <Form.Label>สถานะการอนุมัติ</Form.Label> */}
                              <Form.Control
                                hidden
                                value={"Approved"}
                                readOnly
                                {...register("status", { required: false })}
                              />
                              {errors.status && (
                                <span className="text-danger">
                                  This field is required
                                </span>
                              )}
                            </Form.Group>
                            <Form.Group as={Col} md="12">
                              <Form.Label>เหตุผลที่อนุมัติ</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter your result"
                                {...register("status_result", {
                                  required: false,
                                })}
                              />
                              {errors.status_result && (
                                <span className="text-danger">
                                  This field is required
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="primary"
                          onClick={handleSubmit(handleApproverSubmit)}
                        >
                          Submit
                        </Button>
                        <Button variant="secondary" onClick={ApproverClose}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    {/* Reject KSS Madal */}
                    <Modal centered show={rejectShow}>
                      <Modal.Header>
                        <Modal.Title>ไม่อนุมัติเอกสาร</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          <Row>
                            <Form.Group as={Col} md="12">
                              {/* <Form.Label>สถานะการอนุมัติ</Form.Label> */}
                              <Form.Control
                                hidden
                                value={"Rejected"}
                                readOnly
                                {...register("status", { required: false })}
                              />
                              {errors.status && (
                                <span className="text-danger">
                                  This field is required
                                </span>
                              )}
                            </Form.Group>
                            <Form.Group as={Col} md="12">
                              <Form.Label>เหตุผลที่ไม่อนุมัติ</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter your result"
                                {...register("status_result", {
                                  required: false,
                                })}
                              />
                              {errors.status_result && (
                                <span className="text-danger">
                                  This field is required
                                </span>
                              )}
                            </Form.Group>
                          </Row>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="primary"
                          onClick={handleSubmit(handleApproverSubmit)}
                        >
                          Submit
                        </Button>
                        <Button variant="secondary" onClick={RejectClose}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    {/* View Blog Madal */}
                    <Modal centered show={viewShow}>
                      <Modal.Header>
                        <Modal.Title>รายละเอียดข้อเสนอแนะ</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form.Group>
                          <Form.Label>หัวข้อเรื่อง</Form.Label> : {title}
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>วัตถุประสงค์</Form.Label> : {objective}
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>ผู้เสนอแนะ</Form.Label> : {suggest}
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>ประเภทข้อเสนอแนะ</Form.Label> :{" "}
                          {suggest_type}
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>สภาพปัจุบัน</Form.Label> : {current}
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>แนวทางการปรับปรุง</Form.Label> : {improve}
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>ผลที่คาดว่าจะได้รับ</Form.Label> :{" "}
                          {results}
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>ค่าใช้จ่าย/การลงทุน</Form.Label> : {cost}
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>สถานะการอนุมัติ</Form.Label> :{" "}
                          <>
                            <Badge bg="primary">{status}</Badge>
                          </>
                        </Form.Group>
                        {status_result ? (
                          <Form.Group>
                            <Form.Label>เหตุผลอนุมัติ/ไม่อนุมัติ</Form.Label> :{" "}
                            {status_result}
                          </Form.Group>
                        ) : (
                          ""
                        )}
                        <Form.Group>
                          <Form.Label>กำหนดเสร็จ</Form.Label> :{" "}
                          {dayjs(date).format("DD-MMM-YYYY")}
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>วันที่จัดทำ</Form.Label> :{" "}
                          {dayjs(created).format("DD-MMM-YYYY")}
                        </Form.Group>
                        {work_result ? (
                          <Form.Group>
                            <Form.Label>ผลการนำไปปฎิติงาน</Form.Label> :{" "}
                            {work_result}
                          </Form.Group>
                        ) : (
                          ""
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={ViewClose}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
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
