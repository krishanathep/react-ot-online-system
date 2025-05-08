import React, { useState, useEffect, useMemo } from "react";
import { DataTable } from "mantine-datatable";
import { TextInput, MultiSelect, Button, Stack } from "@mantine/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDebouncedValue, useSetState } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useAuthUser } from "react-auth-kit";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import duration from "dayjs/plugin/duration";

// นำเข้าฟอนต์ไทยสำหรับ PDF
import { KanitNomal } from "../../assets/fonts/Kanit-nomal";
import { KanitBold } from "../../assets/fonts/Kanit-bold";

const PAGE_SIZES = [20, 30, 40];

const Report = () => {
  //user login
    const userDatail = useAuthUser();
  dayjs.extend(isSameOrAfter);
  dayjs.extend(duration);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [employees, setEmployees] = useState([]);
  const [otrequest, setOtrequest] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Search and filter states
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedCostTypes, setSelectedCostTypes] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectDepartment, setSelectDepartment] = useState([])
  const [selectStartTime, setSelectStartTime] = useState([])
  const [selectEndTime, setSelectEndTime] = useState([])
  const [dateRange, setDateRange] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null)
  
  // Get unique values for filters
  const depts = useMemo(() => {
    if (!otrequest.length) return [];
    const uniqueDepts = [...new Set(otrequest.map(req => req.dept).filter(dept => dept))];
    return uniqueDepts;
  }, [otrequest]);

  // Get unique values for filters
  const department = useMemo(() => {
    if (!otrequest.length) return [];
    const uniqueDepartments = [...new Set(otrequest.map(req => req.department).filter(department => department))];
    return uniqueDepartments;
  }, [otrequest]);
  
  const costTypes = useMemo(() => {
    if (!employees.length) return [];
    const uniqueCostTypes = [...new Set(employees.map(emp => emp.cost_type).filter(type => type))];
    return uniqueCostTypes;
  }, [employees]);
  
  const jobTypes = useMemo(() => {
    if (!employees.length) return [];
    const uniqueJobTypes = [...new Set(employees.map(emp => emp.job_type).filter(type => type))];
    return uniqueJobTypes;
  }, [employees]);

  const startTime = useMemo(() => {
    if (!employees.length) return [];
    const uniqueStartTime = [...new Set(employees.map(emp => emp.ot_in_time).filter(type => type))];
    return uniqueStartTime;
  }, [employees]);

  const endTime = useMemo(() => {
    if (!employees.length) return [];
    const uniqueEndTime = [...new Set(employees.map(emp => emp.out_time).filter(type => type))];
    return uniqueEndTime;
  }, [employees]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const getData = async () => {
    setLoading(true);
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequest-employees")
      .then((res) => {
        const filteredEmployees = res.data.employees.filter(
          (employee) => employee.status === 1
        );
        setEmployees(filteredEmployees);
        setFilteredData(filteredEmployees);
        setRecords(
          filteredEmployees.slice((page - 1) * pageSize, page * pageSize)
        );
        setLoading(false);
      });
  };

  const getOtrequest = async () => {
    await axios
      .get(import.meta.env.VITE_API_KEY + "/api/otrequests")
      .then((res) => {
        setOtrequest(res.data.data);
      });
  };
  
  // Function to calculate total time
  const calculateTotalTime = (record) => {
    // ตรวจสอบว่ามี ot_in_time และ out_time หรือไม่
    if (!record.ot_in_time || !record.out_time) {
      return "-";
    }

    const start = dayjs("01-01-2024 " + record.ot_in_time);
    const end = dayjs("01-01-2024 " + record.out_time);

    let diff = dayjs.duration(end.diff(start));

    const hours = Math.floor(diff.asHours());
    const minutes = diff.minutes();

    // แสดงเวลาในรูปแบบ ชั่วโมง:นาที
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Function to format scan data
  const formatScanData = (scan_data) => {
    return scan_data === null
      ? "-"
      : scan_data.substring(13, 18) + " - " + scan_data.substring(32, 37);
  };

  // Function to get department
  const getDocumentNumber = (ot_emp_id) => {
    const matchedOtRequest = otrequest.find(
      (request) => request.ot_emp === ot_emp_id
    );
    return matchedOtRequest ? matchedOtRequest.dept : <p className="text-primary">loading...</p>;
  };

   // Function to get department
   const getDepartMent = (ot_emp_id) => {
    const matchedOtRequest = otrequest.find(
      (request) => request.ot_emp === ot_emp_id
    );
    return matchedOtRequest ? matchedOtRequest.department : <p className="text-primary">loading...</p>;
  };

  // Apply filters
  useEffect(() => {
    let filtered = employees;
    
    // Filter by name/code
    if (debouncedQuery) {
      filtered = filtered.filter(emp => 
        emp.emp_name.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
        emp.code.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
    
    // Filter by departments
    if (selectedDepts.length > 0) {
      filtered = filtered.filter(emp => {
        const dept = getDocumentNumber(emp.ot_emp_id);
        return selectedDepts.includes(dept);
      });
    }

    // Filter by departments
    // if (selectDepartment.length > 0) {
    //   filtered = filtered.filter(emp => {
    //     const department = getDepartMent(emp.ot_emp_id);
    //     return selectDepartment.includes(department);
    //   });
    // }

     // Filter by departments
    filtered = filtered.filter(emp => {
      const department = getDepartMent(emp.ot_emp_id);
      return department === userDatail().agency;
    });

      // Filter by start time
      if (selectStartTime.length > 0) {
        filtered = filtered.filter(emp => 
          selectStartTime.includes(emp.ot_in_time)
        );
      }

      // Filter by end time
      if (selectEndTime.length > 0) {
        filtered = filtered.filter(emp => 
          selectEndTime.includes(emp.out_time)
        );
      }
    
    // Filter by cost type
    if (selectedCostTypes.length > 0) {
      filtered = filtered.filter(emp => 
        selectedCostTypes.includes(emp.cost_type)
      );
    }
    
    // Filter by job type
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter(emp => 
        selectedJobTypes.includes(emp.job_type)
      );
    }
    
    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dayjs(dateRange[0]);
      const endDate = dayjs(dateRange[1]);
      
      filtered = filtered.filter(emp => {
        const otDate = dayjs(emp.ot_create_date);
        //return otDate.isAfter(startDate) && otDate.isBefore(endDate.add(1, 'day'));
        return otDate.isSameOrAfter(startDate, 'day') && otDate.isBefore(endDate.add(1, 'day'));
      });
      
      setStartDate(dateRange[0]);
      setEndDate(dateRange[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
    
    setFilteredData(filtered);
    setRecords(filtered.slice(0, pageSize));
    setPage(1);
    
  }, [debouncedQuery, selectedDepts, selectDepartment, selectStartTime, selectEndTime, selectedCostTypes, selectedJobTypes, dateRange, employees, otrequest]);

  // Update records when page changes
  useEffect(() => {
    if (filteredData.length > 0) {
      setRecords(filteredData.slice((page - 1) * pageSize, page * pageSize));
    }
  }, [page, pageSize, filteredData]);

   // ฟังก์ชันสำหรับสร้าง PDF
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // เพิ่มฟอนต์ไทยให้กับ PDF
    doc.addFileToVFS("Kanit-Regular.ttf", KanitNomal);
    doc.addFileToVFS("Kanit-Bold.ttf", KanitBold);
    doc.addFont("Kanit-Regular.ttf", "Kanit", "normal");
    doc.addFont("Kanit-Bold.ttf", "Kanit", "bold");

    // ตั้งค่าฟอนต์เริ่มต้น
    doc.setFont("Kanit", "normal");
    doc.setFontSize(14);

    const tableColumns = [
      "#",
      "รหัสพนักงาน",
      "ชื่อพนักงาน",
      "ฝ่าย",
      "ประเภทค่าแรง",
      "ชนิดของาน",
      "วันที่ทำ OT",
      "เวลาเริ่มทำ",
      "เวลาสิ้นสุด",
      "สแกนนิ้ว",
      "เวลารวม",
    ];

    const tableRows = filteredData.map((record, index) => {
      return [
        index + 1,
        record.code,
        record.emp_name,
        getDocumentNumber(record.ot_emp_id),
        record.cost_type,
        record.job_type,
        dayjs(record.ot_create_date).format("DD-MM-YYYY"),
        record.ot_in_time || "-",
        record.out_time || "-",
        formatScanData(record.scan_data),
        calculateTotalTime(record),
      ];
    });

    doc.text("บริษัท ไทยรุ่งยูเนี่ยนคาร์ จำกัด(มหาชน)", 14, 15);

    doc.setFontSize(13);
    doc.text("รายงานการทำงานล่วงเวลา", 14, 25);

    // Add date information if filter is applied
if (startDate && endDate) {
  doc.text(`วันที่: ${dayjs(startDate).format("DD-MM-YYYY")} ถึง ${dayjs(endDate).format("DD-MM-YYYY")}`, 14, 35);
} else if (startDate) {
  doc.text(`วันที่: ${dayjs(startDate).format("DD-MM-YYYY")}`, 14, 35);
}

    doc.autoTable({
      startY: startDate ? 40 : 30,
      head: [tableColumns],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10, font: "Kanit" },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        halign: "center",
        fontSize: 10,
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250], // สีพื้นหลังของแถวที่สลับกัน
      },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "center" },
        7: { halign: "center" },
        8: { halign: "center" },
        9: { halign: "center" },
        10: { halign: "center" },
        11: { halign: "center" },
      },
    });

    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl, "_blank");
  };

  useEffect(() => {
    getOtrequest();
    getData();
  }, []);

  const columns = [
    {
      accessor: "index",
      title: "#",
      textAlignment: "center",
      width: 50,
      render: (record) => records.indexOf(record) + 1,
    },
    {
      accessor: "code",
      title: "รหัสพนักงาน",
      textAlignment: "center",
      filter: (
        <TextInput
          label="ค้นหาพนักงาน"
          description="ค้นหาจากรหัสหรือชื่อพนักงาน"
          placeholder="พิมพ์ข้อความค้นหา..."
          icon={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      ),
      filtering: query !== '',
    },
    {
      accessor: "emp_name",
      title: "ชื่อพนักงาน",
      textAlignment: "center",
    },
    {
      accessor: "cost_type",
      title: "ประเภทค่าแรง",
      textAlignment: "center",
      filter: (
        <MultiSelect
          label="ประเภทค่าแรง"
          description="เลือกประเภทค่าแรงที่ต้องการแสดง"
          data={costTypes}
          value={selectedCostTypes}
          placeholder="เลือกประเภทค่าแรง..."
          onChange={setSelectedCostTypes}
          icon={<IconSearch size={16} />}
          clearable
          searchable
        />
      ),
      filtering: selectedCostTypes.length > 0,
    },
    {
      accessor: "job_type",
      title: "ชนิดของงาน",
      textAlignment: "center",
      filter: (
        <MultiSelect
          label="ชนิดของงาน"
          description="เลือกชนิดของงานที่ต้องการแสดง"
          data={jobTypes}
          value={selectedJobTypes}
          placeholder="เลือกชนิดของงาน..."
          onChange={setSelectedJobTypes}
          icon={<IconSearch size={16} />}
          clearable
          searchable
        />
      ),
      filtering: selectedJobTypes.length > 0,
    },
    {
      accessor: "target",
      title: "เป้าหมาย",
      textAlignment: "center",
    },
    {
      accessor: "department",
      title: "หน่วยงาน",
      textAlignment: "center",
      render: ({ ot_emp_id }) => getDepartMent(ot_emp_id),
    },
    {
      accessor: "dept",
      title: "ฝ่ายงาน",
      textAlignment: "center",
      render: ({ ot_emp_id }) => getDocumentNumber(ot_emp_id),
    },
    {
      accessor: "ot_create_date",
      title: "วันที่ทำ OT",
      textAlignment: "center",
      render: ({ ot_create_date }) => dayjs(ot_create_date).format("DD-MM-YYYY"),
      filter: ({ close }) => (
        <Stack>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">ช่วงวันที่</label>
            <DatePicker
              selectsRange={true}
              startDate={dateRange?.[0]}
              endDate={dateRange?.[1]}
              onChange={(update) => {
                setDateRange(update);
              }}
              dateFormat="dd-MM-yyyy"
              placeholderText="เลือกช่วงวันที่"
              className="border rounded p-2 w-full"
              isClearable={true}
            />
            <p className="text-xs text-gray-500 mt-1">เลือกช่วงวันที่ต้องการแสดง</p>
          </div>
          <Button
            disabled={!dateRange || (!dateRange[0] && !dateRange[1])}
            color="red"
            onClick={() => {
              setDateRange(null);
              close();
            }}
          >
            ล้างข้อมูล
          </Button>
        </Stack>
      ),
      filtering: Boolean(dateRange && (dateRange[0] || dateRange[1])),
    },
    {
      accessor: "ot_in_time",
      title: "เวลาเริ่ม",
      textAlignment: "center",
      filter: (
        <MultiSelect
          label="ชนิดของงาน"
          description="เลือกชนิดของงานที่ต้องการแสดง"
          data={startTime}
          value={selectStartTime}
          placeholder="เลือกชนิดของงาน..."
          onChange={setSelectStartTime}
          icon={<IconSearch size={16} />}
          clearable
          searchable
        />
      ),
      filtering: selectStartTime.length > 0,
    },
    {
      accessor: "out_time",
      title: "เวลาสิ้นสุด",
      textAlignment: "center",
      filter: (
        <MultiSelect
          label="ชนิดของงาน"
          description="เลือกชนิดของงานที่ต้องการแสดง"
          data={endTime}
          value={selectEndTime}
          placeholder="เลือกชนิดของงาน..."
          onChange={setSelectEndTime}
          icon={<IconSearch size={16} />}
          clearable
          searchable
        />
      ),
      filtering: selectEndTime.length > 0,
    },
    {
      accessor: "scan_data",
      title: "สแกนนิ้ว",
      textAlignment: "center",
      render: ({ scan_data }) => formatScanData(scan_data),
    },
    {
      accessor: "total_time",
      title: "เวลารวม",
      textAlignment: "center",
      render: (record) => calculateTotalTime(record),
    },
  ];

  return (
    <>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">รายงานโอที</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">หน้าหลัก</a>
                  </li>
                  <li className="breadcrumb-item active">รายงานโอที</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="float-right">
                          <button className="btn btn-success" onClick={handleExportPDF}>
                          <i className="fas fa-download"></i> EXPORT
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <DataTable
                        style={{
                          fontFamily: "Prompt",
                        }}
                        striped
                        withBorder
                        highlightOnHover
                        fontSize={"md"}
                        verticalSpacing="md"
                        paginationSize="md"
                        withColumnBorders
                        fetching={loading}
                        idAccessor="id"
                        columns={columns}
                        records={records}
                        minHeight={500}
                        totalRecords={filteredData.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                      />
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

export default Report;