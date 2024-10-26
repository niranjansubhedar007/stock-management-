


"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { useRouter } from "next/navigation";

const OutwardReport = () => {
  const [weights, setWeights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const router = useRouter();
  
  useEffect(() => {
    const authToken = localStorage.getItem("AdminAuthToken");
    if (!authToken) {
      router.push("/adminLogin");
    }
  }, []);

  // Set the current date in the 'YYYY-MM-DD' format
  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // Get YYYY-MM-DD format

    setStartDate(formattedDate);  // Set default start date
    setEndDate(formattedDate);    // Set default end date
  }, []);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/outward/outward");
        setWeights(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching weights:", error);
      }
    };
    fetchWeights();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  useEffect(() => {
    const results = weights.filter((weight) => {
      const weightDate = new Date(weight.expectedDate);
      const isWithinSelectedDate =
        weightDate >= new Date(startDate) && weightDate <= new Date(endDate);
      const isMatchingSearchTerm =
        weight.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        weight.materialName.toLowerCase().includes(searchTerm.toLowerCase());

      return isWithinSelectedDate && isMatchingSearchTerm;
    });
    setSearchResults(results);
  }, [searchTerm, weights, startDate, endDate]);

  
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const printReport = () => {
    const printWindow = window.open("", "_self");
    const reportContent = `
      <html>
        <head>
          <title>Outward Report</title>
          <style>
             @page { margin: 2mm; }
            body { font-family: Arial, sans-serif;  }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
              .header { text-align: center; }
            .address { margin-top: -17px; }
            .otr{
            text-align: center;
            }
          </style>
        </head>
        <body>
             <div class="header">
            <h2>KHATAV STEEL PVT LTD</h2>
            <p class="address">PLOT NO. L09 ADDITIONAL MIDC SATARA</p>
            <p class="pin">PIN. 415004</p>
          </div>
          <h2 class="otr">Outward Report</h2>
      <h3>Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}</h3>
          <table>
            <thead>
              <tr>
                <th>SR No</th>
                <th>Date</th>
                <th>Worker Name</th>
                <th>Item</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              ${searchResults.map((weight, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${new Date(weight.expectedDate).toLocaleDateString("en-IN")}</td>
                  <td>${weight.workerName}</td>
                  <td>${weight.materialName}</td>
                  <td>${weight.qty}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <>
        <Sidebar />
        <div className="p-2 lg:pl-72 lg:w-full md:pl-72 md:w-full text-black">
          <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Outward Report
                </h3>
                <button 
                  onClick={printReport}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Print Report
                </button>
              </div>
              <div className="mb-4 lg:flex gap-5 p-4 flex flex-wrap items-center">
                <input
                  type="text"
                  placeholder="Search by Material Name or Worker Name"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="px-4 py-2 border border-gray-400 rounded-full w-full lg:w-60 md:w-60"
                />
                <div>
                  <label className="mr-2 text-gray-600">Start Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="px-4 py-2 border border-gray-400 rounded-lg"
                  />
                </div>
                <div>
                  <label className="mr-2 text-gray-600">End Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="px-4 py-2 border border-gray-400 rounded-lg"
                  />
                </div>
              </div>
              <div className="table-container text-sm custom-scrollbars">
                <div className="overflow-y-auto" style={{ height: "30rem" }}>
                  <table className="min-w-full bg-white border border-gray-300 text-left align-middle">
                    <thead className="text-base bg-violet-100 text-violet-500">
                      <tr>
                        <th className="px-4 py-2 whitespace-nowrap">SR No</th>
                        <th className="px-4 py-2 whitespace-nowrap">Date</th>
                        <th className="px-4 py-2 whitespace-nowrap">
                          Worker Name
                        </th>
                        <th className="px-4 py-2 whitespace-nowrap">Item</th>
                        <th className="px-4 py-2 whitespace-nowrap">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((weight, index) => (
                        <tr className="text-center text-base" key={weight._id}>
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">
                            {new Date(weight.expectedDate).toLocaleDateString("en-IN")}
                          </td>
                          <td className="border px-4 py-2">{weight.workerName}</td>
                          <td className="border px-4 py-2">{weight.materialName}</td>
                          <td className="border px-4 py-2">{weight.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default OutwardReport;




