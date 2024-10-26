"use client";
// pages/Weights.js
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { useRouter } from "next/navigation";

const InwardReport = () => {
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
  }, [router]);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/poForm/poForm"
        );

        // Flatten the materials array
        const flattenedWeights = response.data.flatMap(po => 
          po.materials.map(material => ({
            _id: po._id,
            formatNo: po.formatNo,
            expectedDate: material.expectedDate,
            partyName: po.partyName, // assuming you have this field in your PO
            materialName: material.materialName,
            qty: material.qty,
            previousAmt: material.previousAmt,
            currentAmt: material.currentAmt,
          }))
        );

        setWeights(flattenedWeights);
      } catch (error) {
        console.error("Error fetching weights:", error);
      }
    };
    fetchWeights();
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);
    setStartDate(formattedCurrentDate);
    setEndDate(formattedCurrentDate);
  }, []);

  useEffect(() => {
    const results = weights.filter((weight) => {
      const weightDate = new Date(weight.expectedDate);
      const isWithinSelectedDate =
        weightDate >= new Date(startDate) && weightDate <= new Date(endDate);
      const isMatchingSearchTerm =
        weight.formatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        weight.materialName.toLowerCase().includes(searchTerm.toLowerCase());

      return isWithinSelectedDate && isMatchingSearchTerm;
    });
    setSearchResults(results);
  }, [searchTerm, weights, startDate, endDate]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  };

  const handleDetailedPrint = () => {
    const detailedPrintContent = searchResults.map((weight, index) => ({
      srNumber: index + 1,
      formatNo: weight.formatNo,
      date: new Date(weight.expectedDate).toLocaleDateString("en-GB"),
      partyName: weight.partyName,
      materialName: weight.materialName,
      qty: weight.qty,
      previousAmt: weight.previousAmt,
      currentAmt: weight.currentAmt,
    }));

    // Create print content
    let printContent = `
      <html>
        <head>
          <title>Inward Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ddd; text-align: center; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Inward Report</h2>
          <table>
            <thead>
              <tr>
                <th>SR No</th>
                <th>P.O No</th>
                <th>Date</th>
                <th>Party Name</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Previous Amt</th>
                <th>Current Amt</th>
              </tr>
            </thead>
            <tbody>`;

    detailedPrintContent.forEach(weight => {
      printContent += `
        <tr>
          <td>${weight.srNumber}</td>
          <td>${weight.formatNo}</td>
          <td>${weight.date}</td>
          <td>${weight.partyName}</td>
          <td>${weight.materialName}</td>
          <td>${weight.qty}</td>
          <td>${weight.previousAmt}</td>
          <td>${weight.currentAmt}</td>
        </tr>`;
    });

    printContent += `
            </tbody>
          </table>
        </body>
      </html>`;

    const detailedPrintWindow = window.open("", "_blank");
    detailedPrintWindow.document.write(printContent);
    detailedPrintWindow.document.close();
    detailedPrintWindow.focus();
    detailedPrintWindow.print();
    detailedPrintWindow.close();
  };

  return (
    <div>
      <Sidebar />
      <div className="p-2 lg:pl-72 lg:w-full md:pl-72 md:w-full  text-black">
        <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">Inward Report</h3>
            </div>
            <div className="mb-4 lg:flex gap-5 p-4 flex flex-wrap items-center ">
              <input
                type="text"
                placeholder="Search by RSTNo"
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
              <div className="flex flex-wrap">
                <button
                  onClick={handleDetailedPrint}
                  className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-violet-600 text-white hover:text-white"
                >
                  Print
                </button>
              </div>
            </div>
            <div className="table-container text-sm custom-scrollbars">
              <div className="overflow-y-auto" style={{ height: "30rem" }}>
                <table className="min-w-full bg-white border border-gray-300 text-left align-middle">
                  <thead className="text-base bg-violet-100 text-violet-500">
                    <tr>
                      <th className="px-4 py-2 whitespace-nowrap">SR No</th>
                      <th className="px-4 py-2 whitespace-nowrap">P.O No</th>
                      <th className="px-4 py-2 whitespace-nowrap">Date</th>
                      <th className="px-4 py-2 whitespace-nowrap">Party Name</th>
                      <th className="px-4 py-2 whitespace-nowrap">Item</th>
                      <th className="px-4 py-2 whitespace-nowrap">Qty</th>
                      <th className="px-4 py-2 whitespace-nowrap">Previous amt</th>
                      <th className="px-4 py-2 whitespace-nowrap">Current Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((weight, index) => (
                      <tr className="text-center text-base" key={weight._id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{weight.formatNo}</td>
                        <td className="border px-4 py-2">{new Date(weight.expectedDate).toLocaleDateString("en-IN")}</td>
                        <td className="border px-4 py-2">{weight.partyName}</td>
                        <td className="border px-4 py-2">{weight.materialName}</td>
                        <td className="border px-4 py-2">{weight.qty}</td>
                        <td className="border px-4 py-2">{weight.previousAmt}</td>
                        <td className="border px-4 py-2">{weight.currentAmt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InwardReport;
