import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignIn, useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
//import Preloader from "../../components/Preloader";
import Swal from "sweetalert2";
import axios from "axios";
import logo from "/assets/imgs/logo.png";

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signIn = useSignIn();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const REACT_APP_API = import.meta.env.VITE_API_KEY + "/api/auth/login";

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.post(REACT_APP_API, data).then((res) => {
        const token = res.data.access_token;

        if (token != null) {
          if (
            signIn({
              token: res.data.access_token,
              authState: res.data.user,
              expiresIn: 60,
              tokenType: "Bearer",
            })
          ) {
            navigate("/");
          }
        } else {
          console.log("เกิดข้อผิดพลาด!!!");
        }
      });
    } catch (error) {
      console.log(error.response);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
      reset({
        email: "",
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };

  // if(loading === true) {
  //   return(
  //     <Preloader/>
  //   )
  // }

  //loading with css
  if (loading === true) {
    return (
      <>
        <div className="loading-state">
          <div className="loading"></div>
        </div>
      </>
    );
  }

  return (
    <body>
      <div
        className="hold-transition login-page"
        //เพิ่มภาพพื้นหลัง + overlay
        // style={{
        //   backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/dist/img/factory_car.jpg')`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   height: "100vh",
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        // }}
      >
        <div className="login-box">
          <div className="login-logo">
            <a href="#">
              {/* <b>OT-</b>REQUEST */}
              <img src={logo} width="40%" alt="" />
            </a>
          </div>
          <div id="auth_bg" className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Sign in to Access the OT SYSTEM</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group mb-3">
                  <input
                    className="form-control"
                    type="name"
                    {...register("email", { required: true })}
                    placeholder="Username"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                </div>
                {errors.email && (
                  <p className="text-danger">This username field is required</p>
                )}
                <div className="input-group mb-3">
                  <input
                    className="form-control"
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Password"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-danger">This password field is required</p>
                )}
                <div className="row">
                  <div className="col-8"></div>
                  <div className="col-4">
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}
