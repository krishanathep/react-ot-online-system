import React from "react";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom'
import logo from '/assets/imgs/logo.png'
import Swal from "sweetalert2";
import axios from 'axios'

export default function Signup() {
  const navigate = useNavigate()
  const { register, handleSubmit,  formState: { errors } } = useForm();

  const REACT_APP_API = import.meta.env.VITE_API_KEY+'/laravel_auth_jwt_api/public/api/auth/register'

  const onSubmit = async data => {
    //alert(JSON.stringify(data))
    try {
      await axios.post(REACT_APP_API, data)
      .then((res)=>{
        console.log(res)
        navigate('/auth/signin')
      })
    } catch(error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data,
      })
    }     
  }

  return (
    <div className="hold-transition register-page">
    <div className="register-box">
      <div className="register-logo">
        <a href="#">
          {/* <b>Admin</b>LTE */}
          <img src={logo} width='40%' alt="" />
        </a>
      </div>
      <div className="card">
        <div className="card-body register-card-body">
          <p className="login-box-msg">Register a new membership</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group mb-3">
            <input className="form-control" type="text" {...register("name", { required: true })} placeholder="Full name" />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-user" />
                </div>
              </div>
            </div>
            {errors.name && <p className="text-danger">This field is required</p>}
            <div className="input-group mb-3">
            <input className="form-control" type="email" {...register("email", { required: true })} placeholder="Email" />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope" />
                </div>
              </div>
            </div>
            {errors.email && <p className="text-danger">This field is required</p>}

            <div className="input-group mb-3">
            <select className="form-control" type="text" {...register("role", { required: true })} placeholder="Rules">
            <option value="">Please Select</option>
              <option value="admin">System Admmin</option>
              <option value="owner">System Owner</option>
              <option value="user">System User</option>
              <option value="approver_1">Approver 1</option>
              <option value="approver_2">Approver 2</option>
              <option value="approver_3">Approver 3</option>
              <option value="approver_4">Approver 4</option>
            </select>
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-cog" />
                </div>
              </div>
            </div>
            {errors.role && <p className="text-danger">This field is required</p>}

            <div className="input-group mb-3">
            <select className="form-control" type="text" {...register("dept", { required: true })} placeholder="Departments">
              <option value="">Please Select</option>
              <option value="RDD">RDD</option>
              <option value="ADD">ADD</option>
              <option value="PED">PED</option>
              <option value="FED">FED</option>
              <option value="QAD">QAD</option>
              <option value="PLD">PLD</option>
              <option value="PPD">PPD</option>
              <option value="PRD">PRD</option>
            </select>
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-id-card-alt" />
                </div>
              </div>
            </div>
            {errors.dept && <p className="text-danger">This field is required</p>}

            <div className="input-group mb-3">
            <input className="form-control" type="password" {...register("password", { required: true })} placeholder="Password" />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock" />
                </div>
              </div>
            </div>
            {errors.password && <p className="text-danger">This field is required</p>}
            <div className="input-group mb-3">
            <input className="form-control" type="password" {...register("password_confirmation", { required: true })} placeholder="Retype password"/>
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock" />
                </div>
              </div>
            </div>
            {errors.password_confirmation && <p className="text-danger">This field is required</p>}
            <div className="row">
              <div className="col-8">
              </div>
              <div className="col-4">
                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
              </div>
            </div>
          </form>
          <div className="mt-2">
          <Link to={'/auth/signin'} className="text-center">
            I already have a membership
          </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

