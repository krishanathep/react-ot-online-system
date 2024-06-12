import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Home() {

  const data = [
    {
      name: "PRD",
      Target: 157,
      Actual: 155,
    },
    {
      name: "PLD",
      Target: 62,
      Actual: 60,
    }, {
      name: "QAD",
      Target: 50,
      Actual: 48,
    },{
      name: "PED",
      Target: 12,
      Actual: 12,
    }, {
      name: "RDD",
      Target: 27,
      Actual: 20,
    }, {
      name: "PPD",
      Target: 116,
      Actual: 128,
    }, {
      name: "FED",
      Target: 22,
      Actual: 22,
    }, {
      name: "AED",
      Target: 10,
      Actual: 8,
    }, 
  ];

  const data_2 = [
    {
      name: "PRD",
      Target: 52,
      Actual: 50,
    },
    {
      name: "PLD",
      Target: 20,
      Actual: 18,
    }, {
      name: "QAD",
      Target: 28,
      Actual: 25,
    },{
      name: "PED",
      Target: 14,
      Actual: 14,
    }, {
      name: "RDD",
      Target: 10,
      Actual: 19,
    }, {
      name: "PPD",
      Target: 40,
      Actual: 41,
    }, {
      name: "FED",
      Target: 16,
      Actual: 15,
    }, {
      name: "AED",
      Target: 12,
      Actual: 11,
    }, 
  ];


  const [succestion, setSuggestion] = useState(0);

  const getAll = async () => {
    await axios
      .get(
        "https://full-stack-app.com/laravel_auth_jwt_api/public/api/ksssystems"
      )
      .then((res) => {
        setSuggestion(res.data.ksssystems.length);
      });
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
              <h1 className="m-0">หน้าแรก</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <li className="breadcrumb-item active">หน้าแรก</li>
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
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{succestion}</h3>
                  <p>All Suggestion</p>
                </div>
                <div className="icon">
                <i className="fas fa-chalkboard-teacher"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="small-box bg-primary">
                <div className="inner">
                  <h3>7</h3>
                  <p>In Progress</p>
                </div>
                <div className="icon">
                <i className="far fa-clock"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>8</h3>
                  <p>Approved</p>
                </div>
                <div className="icon">
                <i className="far fa-check-circle"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>5</h3>
                  <p>Rejected</p>
                </div>
                <div className="icon">
                <i className="far fa-times-circle"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mt-5">
                <div className="card card-outline card-primary">
                  <div className="card-body">
                    <h5>จำนวนเรื่องที่เขียน</h5>
                    <ResponsiveContainer width={"100%"} height={300}>
                    <BarChart
                      width={600}
                      height={300}
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Target" fill="#8884d8" />
                      <Bar dataKey="Actual" fill="#82ca9d" />
                    </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-5">
                <div className="card card-outline card-primary">
                  <div className="card-body">
                    <h5>จำนวนเรื่องที่มีคุณค่า</h5>
                    <ResponsiveContainer width={"100%"} height={300}>
                    <BarChart
                      width={600}
                      height={300}
                      data={data_2}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Target" fill="#8884d8" />
                      <Bar dataKey="Actual" fill="#82ca9d" />
                    </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
