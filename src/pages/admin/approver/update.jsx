import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";

const ApproverUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const getApprover = async () => {
    try {
      await axios
        .get(import.meta.env.VITE_API_KEY + "/api/approve/" + id)
        .then((res) => {
          reset({
            dept: res.data.approver.dept,
            agency: res.data.approver.agency,
            division: res.data.approver.division,
            app_id_1: res.data.approver.app_id_1,
            app_name_1: res.data.approver.app_name_1,
            app_email_1: res.data.approver.app_email_1,
            app_id_2: res.data.approver.app_id_2,
            app_name_2: res.data.approver.app_name_2,
            app_email_2: res.data.approver.app_email_2,
            app_id_3: res.data.approver.app_id_3,
            app_name_3: res.data.approver.app_name_3,
            app_email_3: res.data.approver.app_email_3,
            app_id_4: res.data.approver.app_id_4,
            app_name_4: res.data.approver.app_name_4,
            app_email_4: res.data.approver.app_email_4,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateSubmit = async (data) => {
    try {
      await axios
        .put(import.meta.env.VITE_API_KEY + "/api/approve-update/"+id , data)
        .then((res) => {
          console.log(res);
          Swal.fire({
            icon: "success",
            title: "Your approver has been updated",
            showConfirmButton: false,
            timer: 2000,
          });
          navigate("/admin/approver");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApprover();
  },[]);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">แก้ไขสายการอนุมัติ</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">Approver All</li>
                  <li className="breadcrumb-item active">Approver Update</li>
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
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">dept</label>
                          <select
                            className="form-control"
                            type="text"
                            {...register("dept", { required: true })}
                          >
                            <option value="">Please Select</option>
                            <option value="RDD">RDD</option>
                            <option value="ADD">ADD</option>
                            <option value="PED">PED</option>
                            <option value="FED">FED</option>
                            <option value="QAD">QAD</option>
                            <option value="PLD">PLD</option>
                            <option value="PPD">PPD</option>
                            <option value="PRD">PRD</option>
                            <option value="HRD">HRD</option>
                          </select>
                          {errors.dept && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">agency</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            type="text"
                            {...register("agency", { required: true })}
                          />

                          {errors.agency && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">division</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            type="text"
                            {...register("division", { required: true })}
                          />
                          {errors.division && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_id_1</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_id_1", {
                              required: true,
                            })}
                          />
                          {errors.app_id_1 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_name_1</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_name_1", {
                              required: true,
                            })}
                          />
                          {errors.app_name_1 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_email_1</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_email_1", {
                              required: true,
                            })}
                          />
                          {errors.app_email_1 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_id_2</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_id_2", {
                              required: true,
                            })}
                          />
                          {errors.app_id_2 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_name_2</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_name_2", {
                              required: true,
                            })}
                          />
                          {errors.app_name_2 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_email_2</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_email_2", {
                              required: true,
                            })}
                          />
                          {errors.app_email_2 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_id_3</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_id_3", {
                              required: true,
                            })}
                          />
                          {errors.app_id_3 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_name_3</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_name_3", {
                              required: true,
                            })}
                          />
                          {errors.app_name_3 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_email_3</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_email_3", {
                              required: true,
                            })}
                          />
                          {errors.app_email_3 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_id_4</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_id_4", {
                              required: true,
                            })}
                          />
                          {errors.app_id_4 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_name_4</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_name_4", {
                              required: true,
                            })}
                          />
                          {errors.app_name_4 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">app_email_4</label>
                          <input
                            placeholder="Please Enter"
                            className="form-control"
                            {...register("app_email_4", {
                              required: true,
                            })}
                          />
                          {errors.app_email_4 && (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                        </div>
                        <div className="float-right">
                          <button
                            type="submit"
                            onClick={handleSubmit(handleUpdateSubmit)}
                            className="btn btn-primary mr-1"
                          >
                            Submit
                          </button>
                          <Link
                            className="btn btn-danger"
                            to={"/admin/approver"}
                          >
                            Canccel
                          </Link>
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

export default ApproverUpdate;
