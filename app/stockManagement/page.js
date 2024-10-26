// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../Components/Sidebar";
// import { useRouter } from "next/navigation";

// const StockManagement = () => {
//   const [weights, setWeights] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // Add search term state

//   const [selectedMaterial, setSelectedMaterial] = useState(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [latestFormatNo, setLatestFormatNo] = useState(0);

//   const [formData, setFormData] = useState({
//     materialName: "",
//     formatNo: "",
//     partyName: "",
//     expectedDate: "",
//     remark: "",
//     issue: "",
//     qty: "",
//     unit: "",
//     isChecked: false,
//     isTemporary: false,
//   });
//   const [savedMaterials, setSavedMaterials] = useState([]); // State to track saved materials
//   const router = useRouter();

//   useEffect(() => {
//     const authToken = localStorage.getItem("AdminAuthToken");
//     if (!authToken) {
//       router.push("/adminLogin");
//     }
//   }, []);

//   useEffect(() => {
//     const fetchWeights = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/material/materials"
//         );

//         setWeights(response.data);
//       } catch (error) {
//         console.error("Error fetching weights:", error);
//       }
//     };
//     fetchWeights();
//   }, []);

//   useEffect(() => {
//     const fetchWeights = async () => {
//       try {
//         const responses = await axios.get(
//           "http://localhost:5000/api/indentForm/latestFormatNo"
//         );
//         setLatestFormatNo(responses.data.latestFormatNo || 0 );

//         console.log(responses.data);
//       } catch (error) {
//         console.error("Error fetching weights:", error);
//       }
//     };
//     fetchWeights();
//   }, []);

//   useEffect(() => {
//     // Retrieve saved materials from localStorage
//     const saved = JSON.parse(localStorage.getItem("savedMaterials")) || [];
//     setSavedMaterials(saved);
//   }, []);

//   const handleProcessClick = (material) => {
//     setSelectedMaterial(material);
//     const currentDate = new Date().toISOString().split("T")[0];
//     setFormData({
//       ...formData,
//       materialName: material.materialName,
//       expectedDate: currentDate,
//       formatNo: latestFormatNo === 0 ? "1" : (parseInt(latestFormatNo) + 1).toString(),

//     });
//     setIsPopupOpen(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//     setSelectedMaterial(null);
//     setFormData({
//       materialName: "",
//       expectedDate: "",
//       formatNo: "",
//       remark: "",
//       partyName: "",
//       issue: "",
//       qty: "",
//       unit: "",
//       isChecked: false,
//       isTemporary: false,
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleMaterialChange = (e) => {
//     const selectedMaterialName = e.target.value;
//     setFormData({
//       ...formData,
//       materialName: selectedMaterialName,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.post(
//         "http://localhost:5000/api/indentForm/indentForm",
//         formData
//       );

//       // Prepare form data for printing
//       const printData = [
//         {
//           materialName: formData.materialName,
//           formatNo: formData.formatNo,
//           partyName: formData.partyName,
//           remark: formData.remark,
//           issue: formData.issue,
//           qty: formData.qty,
//           unit: formData.unit,
//         },
//         // Add more objects if you have multiple entries
//       ];

//       // Generate the print preview using the form data
//       const printWindow = window.open("", "_self");
//       printWindow.document.open();
//       printWindow.document.write(`
//         <html>
//         <head>
//           <title>Indent Form Print Preview</title>
//           <style>
//             @page { margin: 2mm; }
//             body { font-family: sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: black; }
//             .container { margin: 0 auto; padding: 10px; background-color: #fff; box-shadow: 0 0 10px black; }
//             .header { text-align: center; }
//             .address { margin-top: -17px; }
//             .weights { border-bottom: 1px dotted black; }
//             .both_side { display: flex; justify-content: space-between; }
//             .signature { margin-top: 20px; }
//             p { margin: 5px 0; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
//             th { background-color: #f2f2f2; }
//             .signatures {display:flex}
//             .marginL{ margin-left: 5px; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h2>KHATAV STEEL PVT LTD</h2>
//               <p class="address">PLOT NO. L09 ADDITIONAL MIDC SATARA</p>
//               <p class="pin">PIN. 415004</p>
//                  <h3>Material Indent Form</h3>
//             </div>

//             <!-- Standard Format Section -->
//             <div class="both_side">
//               <div class="date-time" id="date-time"></div>
//             </div>
//             <div class="weights"></div>

//             <!-- Table Format Section -->
//             <table>
//               <tr>
//                 <th>Sr. No</th>
//                 <th>Format No</th>
//                 <th>Party Name</th>
//                 <th>Material Name</th>
//                 <th>Remark</th>
//                 <th>Issue</th>
//                 <th>Quantity</th>
//                 <th>Unit</th>
//               </tr>
//               ${printData
//                 .map(
//                   (item, index) => `
//                   <tr>
//                     <td>${index + 1}</td> <!-- Dynamic Serial Number -->
//                     <td>${item.formatNo}</td>
//                     <td>${item.partyName}</td>
//                     <td>${item.materialName}</td>
//                     <td>${item.remark}</td>
//                     <td>${item.issue}</td>
//                     <td>${item.qty}</td>
//                     <td>${item.unit}</td>
//                   </tr>
//                 `
//                 )
//                 .join("")}
//             </table>

//             <div class="signatures">
//             <div class="signature">
//               <p>Issued By: __________________</p>
//             </div>
//             <div class="signature">
//               <p class="marginL">Verified & Approved By: __________________</p>
//             </div>
//             </div>
//           </div>

//           <!-- Script to add date and time -->
//           <script>
//           document.addEventListener("DOMContentLoaded", function () {
//             var currentDate = new Date();
//             var dateOptions = {
//               year: "numeric",
//               month: "2-digit",
//               day: "2-digit",
//             };
//             var timeOptions = {
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit",
//             };
//             var formattedDate = currentDate.toLocaleDateString("en-GB", dateOptions);
//             var formattedTime = currentDate.toLocaleTimeString("en-US", timeOptions);

//             var dateElement = document.createElement("p");
//             dateElement.innerHTML = "Date: " + formattedDate;
//             document.querySelector("#date-time").appendChild(dateElement);

//             var timeElement = document.createElement("p");
//             timeElement.innerHTML = "Time: " + formattedTime;
//             document.querySelector("#date-time").appendChild(timeElement);
//           });
//         </script>
//         </body>
//         </html>
//       `);
//       printWindow.document.close();
//       printWindow.print();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Failed to submit form.");
//     }
//   };
//   const filteredWeights = weights.filter((weight) =>
//     weight.materialName.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   return (
//     <div>
//       <Sidebar />
//       <div className="p-2 overflow-hidden lg:pl-72 lg:w-full md:pl-72 md:w-full min-h-screen text-black">
//         <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
//           <div className="bg-white rounded-lg shadow-lg">
//             <div className="flex items-center justify-between p-2 border-b rounded-t">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Indent Form
//               </h3>
//             </div>
//             <div className="p-4">
//               <input
//                 type="text"
//                 placeholder="Search Material"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="border px-2 py-1 rounded w-fit"
//               />
//             </div>
//             <div className="table-container overflow-x-auto  text-sm custom-scrollbars">
//               <div className="overflow-y-auto " style={{ height: "30rem" }}>
//                 <table className="min-w-full bg-white border border-gray-300 text-center align-middle">
//                   <thead className="text-base bg-violet-100 text-violet-500">
//                     <tr>
//                       <th className="px-4 py-2 whitespace-nowrap">SR No</th>
//                       <th className="px-4 py-2 whitespace-nowrap">
//                         Material name
//                       </th>
//                       <th className="px-4 py-2 whitespace-nowrap">
//                         Material stock out
//                       </th>
//                       <th className="px-4 py-2 whitespace-nowrap">
//                         Material stock alert
//                       </th>
//                       <th className="px-4 py-2 whitespace-nowrap">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredWeights.map((weight, index) => (
//                       <tr key={weight._id} className="text-center text-base">
//                         <td className="border px-4 py-2">{index + 1}</td>
//                         <td className="border px-4 py-2">
//                           {weight.materialName}
//                         </td>
//                         <td className="border px-4 py-2">{weight.qty}</td>
//                         <td className="border px-4 py-2">
//                           {weight.stockAlert}
//                         </td>
//                         <td className="border px-4 py-2">
//                           <button
//                             className="text-center bg-blue-500 text-white px-2 py-1 rounded"
//                             onClick={() => handleProcessClick(weight)}
//                           >
//                             Process
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Popup Modal */}
//         {isPopupOpen && selectedMaterial && (
//           <div className=" fixed inset-0 flex items-center justify-center z-50">
//             <div className="bg-white p-4 rounded shadow-lg">
//             <p>Latest Format No: {latestFormatNo}</p> {/* Display latestFormatNo */}
//               <h2 className="text-lg font-semibold mb-4">

//                 Process Material: {selectedMaterial.materialName}
//               </h2>
//               <div className="grid gap-2">
//                 {/* Material Name Dropdown */}
//                 <input
//                   type="date"
//                   name="expectedDate"
//                   value={formData.expectedDate} // Bind expectedDate to formData
//                   onChange={handleInputChange}
//                   className="border px-2 py-1 rounded"
//                 />
//                 <input
//                   type="text"
//                   name="formatNo"
//                   value={formData.formatNo || 0}
//                   onChange={handleInputChange}
//                   readOnly
//                   className="border px-2 py-1 rounded bg-gray-100"
//                 />
//                 <select
//                   name="materialName"
//                   value={formData.materialName}
//                   onChange={handleMaterialChange}
//                   className="border px-2 py-1 rounded"
//                 >
//                   <option value="" disabled>
//                     Select material
//                   </option>
//                   {weights.map((weight) => (
//                     <option key={weight._id} value={weight.materialName}>
//                       {weight.materialName}
//                     </option>
//                   ))}
//                 </select>
//                 <input
//                   type="text"
//                   name="partyName"
//                   value={formData.partyName}
//                   placeholder="Maker Name"
//                   onChange={handleInputChange}
//                   className="border px-2 py-1 rounded"
//                 />
//                 <textarea
//                   name="issue"
//                   value={formData.issue}
//                   onChange={handleInputChange}
//                   placeholder="Issue"
//                   className="border px-2 py-1 rounded"
//                 />

//                 <input
//                   type="text"
//                   name="remark"
//                   value={formData.remark}
//                   onChange={handleInputChange}
//                   placeholder="Remark"
//                   className="border px-2 py-1 rounded"
//                 />
//                 <input
//                   type="number"
//                   name="qty"
//                   value={formData.qty}
//                   placeholder="Quantity"
//                   onChange={handleInputChange}
//                   required
//                   className="border px-2 py-1 rounded"
//                 />

//                 <input
//                   type="text"
//                   name="unit"
//                   placeholder="Unit"
//                   value={formData.unit}
//                   onChange={handleInputChange}
//                   className="border px-2 py-1 rounded"
//                 />

//                 <div className="flex justify-end mt-4">
//                   <button
//                     className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
//                     onClick={handleSubmit}
//                   >
//                     Submit
//                   </button>
//                   <button
//                     className="bg-gray-500 text-white px-4 py-2 rounded"
//                     onClick={handleClosePopup}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StockManagement;

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { useRouter } from "next/navigation";

const StockManagement = () => {
  const [weights, setWeights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [latestFormatNo, setLatestFormatNo] = useState(0);
  const [selectedMaterials, setSelectedMaterials] = useState([]); // Track selected materials with qty and unit
  const [formData, setFormData] = useState({
    materialName: "",
    formatNo: "",
    partyName: "",
    expectedDate: "",
    remark: "",
    isChecked: false,
    isTemporary: false,
  });

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
          "http://localhost:5000/api/material/materials"
        );
        setWeights(response.data);
      } catch (error) {
        console.error("Error fetching weights:", error);
      }
    };
    fetchWeights();
  }, []);

  useEffect(() => {
    const fetchLatestFormatNo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/indentForm/latestFormatNo"
        );
        setLatestFormatNo(response.data.latestFormatNo || 0);
      } catch (error) {
        console.error("Error fetching latest format number:", error);
      }
    };
    fetchLatestFormatNo();
  }, []);

  const handleCheckboxChange = (material) => {
    setSelectedMaterials((prevSelected) => {
      if (prevSelected.some((item) => item._id === material._id)) {
        // Remove material if already selected
        return prevSelected.filter((item) => item._id !== material._id);
      } else {
        // Add the material with default qty and unit
        return [...prevSelected, { ...material, qty: "", unit: "" }];
      }
    });
  };

  const handleInputChange = (materialId, field, value) => {
    setSelectedMaterials((prevSelected) =>
      prevSelected.map((material) =>
        material._id === materialId ? { ...material, [field]: value } : material
      )
    );
  };

  const handleProcessMultipleClick = () => {
    const materialNames = selectedMaterials
      .map((item) => item.materialName)
      .join(", ");
    const currentDate = new Date().toISOString().split("T")[0];
    setFormData({
      ...formData,
      materialName: materialNames,
      expectedDate: currentDate,
      formatNo:
        latestFormatNo === 0 ? "1" : (parseInt(latestFormatNo) + 1).toString(),
    });
    setIsPopupOpen(true);
  };

  // const handleSubmit = async () => {
  //   try {
  //     const dataToSubmit = selectedMaterials.map((material) => ({
  //       materialName: material.materialName,
  //       qty: material.qty,
  //       unit: material.unit,
  //     }));

  //     await axios.post("http://localhost:5000/api/indentForm/indentForm", {
  //       formatNo: formData.formatNo,
  //       materials: dataToSubmit, // Send the materials array
  //       expectedDate: formData.expectedDate,
  //       remark: formData.remark,
  //       partyName: formData.partyName,
  //       isTemporary: formData.isTemporary,
  //     });

  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     alert("Failed to submit form.");
  //   }
  // };

  const handleSubmit = async () => {
    try {
      // Create a function to map selected materials
      const mapMaterials = (materials) => {
        return materials.map((material) => ({
          materialName: material.materialName,
          qty: material.qty,
          unit: material.unit,
          partyName: material.partyName,
        }));
      };

      // Use the mapMaterials function to create a data array ready for submission
      const dataToSubmit = mapMaterials(selectedMaterials);

      // Define the payload object with the mapped materials
      const payload = {
        formatNo: formData.formatNo,
        materials: dataToSubmit, // Send the materials array
        expectedDate: formData.expectedDate,
        remark: formData.remark,
        issue: formData.issue,
        isTemporary: formData.isTemporary,
      };

      // Send the post request
      await axios.post(
        "http://localhost:5000/api/indentForm/indentForm",
        payload
      );

      // Once the form is successfully submitted, proceed with printing
      const printData = dataToSubmit
        .map(
          (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${formData.formatNo}</td>
          <td>${item.partyName}</td>
          <td>${item.materialName}</td>
          <td>${formData.remark}</td>
          <td>${formData.issue}</td>
          <td>${item.qty}</td>
          <td>${item.unit}</td>
        </tr>
      `
        )
        .join("");

      // Open a new window for printing
      const printWindow = window.open("", "_self");
      printWindow.document.open();
      printWindow.document.write(`
        <html>
        <head>
          <title>Indent Form Print Preview</title>
          <style>
            @page { margin: 2mm; }
            body { font-family: sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: black; }
            .container { margin: 0 auto; padding: 10px; background-color: #fff; box-shadow: 0 0 10px black; }
            .header { text-align: center; }
            .address { margin-top: -17px; }
            .weights { border-bottom: 1px dotted black; }
            .both_side { display: flex; justify-content: space-between; }
            .signature { margin-top: 20px; }
            p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f2f2f2; }
            .signatures {display:flex}
            .marginL{ margin-left: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>KHATAV STEEL PVT LTD</h2>
              <p class="address">PLOT NO. L09 ADDITIONAL MIDC SATARA</p>
              <p class="pin">PIN. 415004</p>
              <h3>Material Indent Form</h3>
            </div>
  
            <!-- Standard Format Section -->
            <div class="both_side">
              <div class="date-time" id="date-time"></div>
            </div>
            <div class="weights"></div>
  
            <!-- Table Format Section -->
            <table>
              <tr>
                <th>Sr. No</th>
                <th>Format No</th>
                <th>Party Name</th>
                <th>Material Name</th>
                <th>Remark</th>
                <th>Issue</th>
                <th>Quantity</th>
                <th>Unit</th>
              </tr>
              ${printData}
            </table>
  
            <div class="signatures">
              <div class="signature">
                <p>Issued By: __________________</p>
              </div>
              <div class="signature">
                <p class="marginL">Verified & Approved By: __________________</p>
              </div>
            </div>
          </div>
  
          <!-- Script to add date and time -->
          <script>
            document.addEventListener("DOMContentLoaded", function () {
              var currentDate = new Date();
              var dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
              var timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
              var formattedDate = currentDate.toLocaleDateString("en-GB", dateOptions);
              var formattedTime = currentDate.toLocaleTimeString("en-US", timeOptions);
  
              var dateElement = document.createElement("p");
              dateElement.innerHTML = "Date: " + formattedDate;
              document.querySelector("#date-time").appendChild(dateElement);
  
              var timeElement = document.createElement("p");
              timeElement.innerHTML = "Time: " + formattedTime;
              document.querySelector("#date-time").appendChild(timeElement);
            });
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    setIsPopupOpen(false);

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
    }
  };

  const filteredWeights = weights.filter((weight) =>
    weight.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Sidebar />
      <div className="p-2 overflow-hidden lg:pl-72 lg:w-full md:pl-72 md:w-full min-h-screen text-black">
        <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-2 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Indent Form
              </h3>
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder="Search Material"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-2 py-1 rounded w-fit"
              />
            </div>
            <div className="table-container overflow-x-auto text-sm custom-scrollbars">
              <div className="overflow-y-auto" style={{ height: "30rem" }}>
                <table className="min-w-full bg-white border border-gray-300 text-center align-middle">
                  <thead className="text-base bg-violet-100 text-violet-500">
                    <tr>
                      <th className="px-4 py-2">Select</th>
                      <th className="px-4 py-2">SR No</th>
                      <th className="px-4 py-2">Material name</th>
                      <th className="px-4 py-2">Material stock out</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWeights.map((weight, index) => (
                      <tr key={weight._id} className="text-center text-base">
                        <td className="border px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedMaterials.some(
                              (item) => item._id === weight._id
                            )}
                            onChange={() => handleCheckboxChange(weight)}
                          />
                        </td>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">
                          {weight.materialName}
                        </td>
                        <td className="border px-4 py-2">{weight.qty}</td>
                        <td className="border px-4 py-2">
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                            onClick={handleProcessMultipleClick}
                            disabled={selectedMaterials.length === 0}
                          >
                            Process Selected
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Modal */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Process Materials</h2>

              {selectedMaterials.map((material, index) => (
                <div key={material._id} className="grid gap-2 mb-4 grid-cols-4">
                  <h3 className="text-base font-semibold lg:ml-28 mt-2">
                    {material.materialName}
                  </h3>

                  <input
                    type="number"
                    name="qty"
                    value={material.qty}
                    placeholder="Quantity"
                    onChange={(e) =>
                      handleInputChange(material._id, "qty", e.target.value)
                    }
                    required
                    className="border px-2 py-1 rounded "
                  />
                  <input
                    type="text"
                    name="unit"
                    value={material.unit}
                    placeholder="Unit"
                    onChange={(e) =>
                      handleInputChange(material._id, "unit", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="test"
                    name="partyName"
                    value={material.partyName}
                    placeholder="party Name"
                    onChange={(e) =>
                      handleInputChange(
                        material._id,
                        "partyName",
                        e.target.value
                      )
                    }
                    required
                    className="border px-2 py-1 rounded"
                  />
                </div>
              ))}

              <div className="grid gap-2 mb-4">
                <input
                  type="text"
                  name="formatNo"
                  value={formData.formatNo || 0}
                  readOnly
                  className="border px-2 py-1 rounded bg-gray-100"
                />
                <input
                  type="date"
                  name="expectedDate"
                  value={formData.expectedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedDate: e.target.value })
                  }
                  className="border px-2 py-1 rounded"
                />
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData({ ...formData, remark: e.target.value })
                  }
                  placeholder="Remark"
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="test"
                  name="issue"
                  value={formData.issue}
                  onChange={(e) =>
                    setFormData({ ...formData, issue: e.target.value })
                  }
                  placeholder="Issue"
                  className="border px-2 py-1 rounded"
                />
                <div className="flex justify-center">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 ml-4 rounded"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockManagement;
