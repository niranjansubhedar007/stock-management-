"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { useRouter } from "next/navigation";

const InwardData = () => {
  const [weights, setWeights] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("AdminAuthToken");
    if (!authToken) {
      router.push("/adminLogin");
    }
  }, []);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/poForm/merged-data"
        );
        setWeights(response.data);
        setFinalData(response.data);
      } catch (error) {
        console.error("Error fetching weights:", error);
      }
    };
    fetchWeights();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredData = weights.filter((item) =>
      item.materialName.toLowerCase().includes(query)
    );
    setFinalData(filteredData);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    filterData(e.target.value, endDate);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    filterData(startDate, e.target.value);
  };

  const filterData = (start, end) => {
    const filteredData = weights.filter((item) => {
      const itemDate = new Date(item.expectedDate).toISOString().split("T")[0];
      const startDateOnly = new Date(start).toISOString().split("T")[0];
      const endDateOnly = new Date(end).toISOString().split("T")[0];

      return itemDate >= startDateOnly && itemDate <= endDateOnly;
    });
    setFinalData(filteredData);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_self");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Data Entries</title>
          <style>
             @media print {
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
            .gt{float:right}
             .header { text-align: center; }
            .address { margin-top: -17px; }

              @page { margin: 0; }
              body { margin: 20px; }
              header, footer { display: none; }
            }
          </style>
        </head>
        <body>
        <div class="header">
            <h2>KHATAV STEEL PVT LTD</h2>
            <p class="address">PLOT NO. L09 ADDITIONAL MIDC SATARA</p>
            <p class="pin">PIN. 415004</p>
          </div>
          <p><strong>Start Date:</strong> ${new Date(
            startDate
          ).toLocaleDateString("en-GB")}</p>
          <p><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString(
            "en-GB"
          )}</p>
          <table>
            <thead>
              <tr>
                <th>SR No</th>
                <th>Date</th>
                <th>Material name</th>
                <th>Previous Amt</th>
                <th>Current Amt</th>
                <th>Material stock</th>
                <th>Material stock alert</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${finalData
                .map(
                  (weight, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${
                    weight.expectedDate
                      ? new Date(weight.expectedDate).toLocaleDateString(
                          "en-GB"
                        )
                      : "N/A"
                  }</td>
                  <td>${weight.materialName}</td>
                  <td>${weight.previousAmt}</td>
                  <td>${weight.currentAmt}</td>
                  <td>${weight.materialQty}</td>
                  <td>${weight.stockAlert}</td>
                  <td>${weight.currentAmt * weight.materialQty}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <h3 class="gt">Grand Total: ${finalData.reduce(
            (acc, weight) => acc + weight.currentAmt * weight.materialQty,
            0
          )}</h3>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const grandTotal = finalData.reduce(
    (acc, weight) => acc + weight.currentAmt * weight.materialQty,
    0
  );

  return (
    <div>
      <Sidebar />
      <div className="p-2 overflow-hidden lg:pl-72 lg:w-full md:pl-72 md:w-full min-h-screen text-black">
        <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-2 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Inward data entries
              </h3>
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by Material Name"
                  className="p-2 border rounded-md mr-2"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="p-2 border rounded-md mr-2"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="p-2 border rounded-md mr-2"
                />
                <button
                  onClick={handlePrint}
                  className="p-2 bg-blue-500 text-white rounded-md"
                >
                  Print
                </button>
              </div>
            </div>

            <div className="table-container  text-sm custom-scrollbars">
              <div className="overflow-y-auto " style={{ height: "30rem" }}>
                <table className="min-w-full bg-white border border-gray-300 text-center align-middle">
                  <thead className="text-base bg-violet-100 text-violet-500">
                    <tr>
                      <th className="px-4 py-2 whitespace-nowrap">SR No</th>
                      <th className="px-4 py-2 whitespace-nowrap">Date</th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Material name
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Previous Amt
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Current Amt
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Material stock
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Material stock alert
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">Checked</th>
                      <th className="px-4 py-2 whitespace-nowrap">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalData.map((weight, index) => (
                      <tr
                        className={`text-center text-base ${
                          weight.materialQty <= weight.stockAlert
                            ? "bg-red-200"
                            : "bg-green-200"
                        }`}
                        key={weight._id}
                      >
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">
                          {weight.expectedDate
                            ? new Date(weight.expectedDate).toLocaleDateString(
                                "en-GB"
                              )
                            : "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.materialName}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.previousAmt}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.currentAmt}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.materialQty}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.stockAlert}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.isChecked ? "✔" : "✘"}
                        </td>
                        <td className="border px-4 py-2">
                          {weight.currentAmt * weight.materialQty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 className="text-lg font-semibold mt-4 float-right">
                Grand Total: {grandTotal}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InwardData;
