import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";

const manageCar = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      test: [{}],
    },
  });

  const [employees, setEmployees] = useState([]);

  const getData = async () => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest-employees")
      .then((res) => {
        reset({
          test: res.data.employees.map((employee) => ({
            id: employee.id,
          })),
      })
        setEmployees(
          res.data.employees.filter(e=>e.ot_create_date==='2024-09-05')
        );
      });
  };

  const handleUpdate = async (data) => {
    //alert(JSON.stringify(data))
    await axios
      .put(import.meta.env.VITE_API_KEY + "/api/otrequest-employees-update", data)
      .then((res) => {
        console.log(res)
      });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">จัดการรถรับส่งพนักงาน</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item">รถรับส่งพนักงาน</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content-wraper">
          <div className="container-fluid">
            <div className="col-lg-12">
              <div className="card card-outline card-primary">
                <div className="card-body">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Created</th>
                        <th>End Time</th>
                        <th>Bus Point</th>
                        <th>Bus Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((e, index) => (
                        <tr key={e.id}>
                          <td>{index + 1}</td>
                          <td>{e.id}
                          </td>
                          <td>{e.code}</td>
                          <td>{e.emp_name}</td>
                          <td>{e.ot_create_date}</td>
                          <td>{e.out_time}{' '}น.</td>
                          <td>{e.bus_stations}</td>
                          <td width={100} align="center">
                            <input
                              size={1}
                              className="form-control"
                              type="text"
                              {...register(
                                `test.${index}.bus_price`,
                                {
                                  required: false,
                                }
                              )}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button 
                  className="btn btn-primary mt-2 float-right"
                  onClick={handleSubmit(handleUpdate)}
                  >
                    UPDATE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default manageCar;
