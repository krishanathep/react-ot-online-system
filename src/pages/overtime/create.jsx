import React from 'react'
import { Link } from 'react-router-dom'
import { useForm, useFieldArray, Controller } from "react-hook-form";

const create = () => {
  const { register, control, handleSubmit, reset, trigger, setError } = useForm(
    {
      // defaultValues: {}; you can populate the fields by this attribute
      defaultValues: {
        test: [
          {
            firstName: "",
            lastName: "",
          },
        ],
      },
    }
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });

  return (
    <>
         <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Overtime create</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Create</li>
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
                      <div className="card shadow-none border">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">เลขที่ใบคำร้อง</label>
                                  <select class="form-control" id="sel1">
                                  <option>Please Select</option>
                                  <option>เลขที่ใบคำร้อง 1</option>
                                  <option>เลขที่ใบคำร้อง 2</option>
                                  <option>เลขที่ใบคำร้อง 3</option>
                                  <option>เลขที่ใบคำร้อง 4</option>
                                </select>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">ผู้ควบคุมงาน</label>
                                  <select class="form-control" id="sel1">
                                  <option>Please Select</option>
                                  <option>ผู้ควบคุมงาน 1</option>
                                  <option>ผู้ควบคุมงาน 2</option>
                                  <option>ผู้ควบคุมงาน 3</option>
                                  <option>ผู้ควบคุมงาน 4</option>
                                </select>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">สถานะการอนุมัติ</label>
                                  <select class="form-control" id="sel1">
                                  <option>Please Select</option>
                                  <option>สถานะการอนุมัติ 1</option>
                                  <option>สถานะการอนุมัติ 2</option>
                                  <option>สถานะการอนุมัติ 3</option>
                                  <option>สถานะการอนุมัติ 4</option>
                                </select>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">วันที่เริ่มต้น</label>
                                  <select class="form-control" id="sel1">
                                  <option>Please Select</option>
                                  <option>วันที่เริ่มต้น 1</option>
                                  <option>วันที่เริ่มต้น 2</option>
                                  <option>วันที่เริ่มต้น 3</option>
                                  <option>วันที่เริ่มต้น 4</option>
                                </select>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">วันที่สิ้นสุด</label>
                                  <select class="form-control" id="sel1">
                                  <option>Please Select</option>
                                  <option>วันที่สิ้นสุด 1</option>
                                  <option>วันที่สิ้นสุด 2</option>
                                  <option>วันที่สิ้นสุด 3</option>
                                  <option>วันที่สิ้นสุด 4</option>
                                </select>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group">
                                  <label htmlFor="">วันที่จัดทำ</label>
                                  <select class="form-control" id="sel1">
                                  <option>Please Select</option>
                                  <option>วันที่จัดทำ 1</option>
                                  <option>วันที่จัดทำ 2</option>
                                  <option>วันที่จัดทำ 3</option>
                                  <option>วันที่จัดทำ 4</option>
                                </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      <form
                          onSubmit={handleSubmit((data) =>
                            alert(JSON.stringify(data))
                          )}
                        >
                          {fields.map((item, index) => (
                            <div
                              className="card shadow-none border"
                              key={item.index}
                            >
                              <div className="card-body">
                                <div className="col-md-12">
                                <div className="form-group">
                                  <label htmlFor="">ข้อมูลพนักงาน :</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    {...register(`test.${index}.firstName`)}
                                    placeholder="Please Enter Employee"
                                  />
                                </div>
                                </div>
                                <div className="col-md-12">
                                <div className="form-group">
                                  <label htmlFor="">ประเภทค่าแรง :</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    {...register(`test.${index}.lastName`)}
                                    placeholder="Please Enter Cost Type"
                                  />
                                </div>
                                </div>
                               <div className="col-md-12">
                               <div className="form-group">
                                  <label htmlFor="">ประเภทงาน :</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    {...register(`test.${index}.lastName`)}
                                    placeholder="Please Enter Job Type"
                                  />
                                </div>
                               </div>
                               <div className="col-md-12">
                                <div className="float-right mt-2">
                                <button
                                  className="btn btn-secondary btn-sm"
                                  type="button"
                                  onClick={() =>
                                    append({ firstName: "", lastName: "" })
                                  }
                                >
                                  <i className="fas fa-plus"></i>
                                </button> {' '}
                                <button
                                  className="btn btn-secondary btn-sm"
                                  type="button"
                                  onClick={() => remove(index)}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                </div>
                               </div>
                              </div>
                            </div>
                          ))}
                          <div className="col-md-12">
                            <div className="float-right">
                              <input
                                className="btn btn-primary"
                                type="submit"
                                value={"SUBMIT"}
                              />{' '}
                              <Link to={'/overtime'} className="btn btn-danger">CANCEL</Link>
                            </div>
                          </div>
                        </form>
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
  )
}

export default create