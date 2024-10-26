import Image from "next/image";
import AdminLogin from "./adminLogin/page";

export default function Home() {
  return (
<>
<AdminLogin/>

</>
  );
}





// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../Components/Sidebar";
// import { useRouter } from "next/navigation";

// const PurchaseOrder = () => {
//   const [weights, setWeights] = useState([]);
//   const [selectedMaterial, setSelectedMaterial] = useState(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
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
//           "http://localhost:5000/api/indentForm/indentForms"
//         );
//         setWeights(response.data);
//       } catch (error) {
//         console.error("Error fetching weights:", error);
//       }
//     };
//     fetchWeights();
//   }, []);

//   const handlePOButtonClick = (weight) => {
//     setSelectedMaterial(weight);
//     setFormData({
//       ...formData,
//       materialName: weight.materialName,
//       formatNo: weight.formatNo,
//       qty: weight.qty,
//     });
//     setIsPopupOpen(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/poForm", // Adjust the endpoint as necessary
//         formData
//       );
//       console.log("Purchase order created:", response.data);
//       handleClosePopup(); // Close the popup after submission
//     } catch (error) {
//       console.error("Error creating purchase order:", error);
//     }
//   };

//   return (
//     <div>
//       <Sidebar />
//       <div className="p-2 overflow-hidden lg:pl-72 lg:w-full md:pl-72 md:w-full min-h-screen text-black">
//         <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
//           <div className="bg-white rounded-lg shadow-lg">
//             <div className="flex items-center justify-between p-2 border-b rounded-t">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Stock Management
//               </h3>
//             </div>

//             <div className="table-container overflow-x-auto overflow-y-auto text-sm custom-scrollbars">
//               <table className="min-w-full bg-white border border-gray-300 text-center align-middle">
//                 <thead className="text-base bg-violet-100 text-violet-500">
//                   <tr>
//                     <th className="px-4 py-2 whitespace-nowrap">SR No</th>
//                     <th className="px-4 py-2 whitespace-nowrap">Format No</th>
//                     <th className="px-4 py-2 whitespace-nowrap">
//                       Material name
//                     </th>
//                     <th className="px-4 py-2 whitespace-nowrap">Qty</th>
//                     <th className="px-4 py-2 whitespace-nowrap">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {weights.map((weight, index) => (
//                     <tr className={`text-center text-base`} key={weight._id}>
//                       <td className="border px-4 py-2">{index + 1}</td>
//                       <td className="border px-4 py-2">{weight.formatNo}</td>
//                       <td className="border px-4 py-2">{weight.materialName}</td>
//                       <td className="border px-4 py-2">{weight.qty}</td>
//                       <td className="border px-4 py-2">
//                         <button
//                           onClick={() => handlePOButtonClick(weight)}
//                           className="text-center bg-blue-500 text-white px-2 py-1 rounded"
//                         >
//                           P.O
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {isPopupOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-5 rounded shadow-lg">
//               <h2 className="text-xl mb-4">Create Purchase Order</h2>
//               <form onSubmit={handleSubmit}>
//                 <div>
//                   <label>Material Name:</label>
//                   <input
//                     type="text"
//                     name="materialName"
//                     value={formData.materialName}
//                     onChange={handleInputChange}
//                     readOnly
//                     className="border border-gray-300 p-1 w-full mb-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Format No:</label>
//                   <input
//                     type="text"
//                     name="formatNo"
//                     value={formData.formatNo}
//                     onChange={handleInputChange}
//                     readOnly
//                     className="border border-gray-300 p-1 w-full mb-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Quantity:</label>
//                   <input
//                     type="text"
//                     name="qty"
//                     value={formData.qty}
//                     onChange={handleInputChange}
//                     readOnly
//                     className="border border-gray-300 p-1 w-full mb-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Party Name:</label>
//                   <input
//                     type="text"
//                     name="partyName"
//                     onChange={handleInputChange}
//                     className="border border-gray-300 p-1 w-full mb-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Expected Date:</label>
//                   <input
//                     type="date"
//                     name="expectedDate"
//                     onChange={handleInputChange}
//                     className="border border-gray-300 p-1 w-full mb-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Remarks:</label>
//                   <input
//                     type="text"
//                     name="remark"
//                     onChange={handleInputChange}
//                     className="border border-gray-300 p-1 w-full mb-2"
//                   />
//                 </div>
//                 <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
//                 Submit
//               </button>
//                 <button
//                   type="button"
//                   onClick={handleClosePopup}
//                   className="bg-red-500 text-white px-4 py-2 rounded ml-2"
//                 >
//                   Cancel
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PurchaseOrder;



















// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../Components/Sidebar";
// import { useRouter } from "next/navigation";

// const StockManagement = () => {
//   const [weights, setWeights] = useState([]);
  
//   const [selectedMaterial, setSelectedMaterial] = useState(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
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
//       expectedDate: currentDate
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
//       await axios.post("http://localhost:5000/api/indentForm/indentForm", formData);
  
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
//         }
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
//             .container { max-width: 600px; margin: 0 auto; padding: 10px; background-color: #fff; box-shadow: 0 0 10px black; }
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
//                 .map((item, index) => `
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
//                 `)
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
  
  



//   return (
//     <div>
//       <Sidebar />
//       <div className="p-2 overflow-hidden lg:pl-72 lg:w-full md:pl-72 md:w-full min-h-screen text-black">
//         <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
//           <div className="bg-white rounded-lg shadow-lg">
//             <div className="flex items-center justify-between p-2 border-b rounded-t">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Stock Management
//               </h3>
//             </div>

//             <div className="table-container overflow-x-auto overflow-y-auto text-sm custom-scrollbars">
//               <table className="min-w-full bg-white border border-gray-300 text-center align-middle">
//                 <thead className="text-base bg-violet-100 text-violet-500">
//                   <tr>
//                     <th className="px-4 py-2 whitespace-nowrap">SR No</th>
//                     <th className="px-4 py-2 whitespace-nowrap">
//                       Material name
//                     </th>
//                     <th className="px-4 py-2 whitespace-nowrap">
//                       Material stock out
//                     </th>
//                     <th className="px-4 py-2 whitespace-nowrap">
//                       Material stock alert
//                     </th>
//                     <th className="px-4 py-2 whitespace-nowrap">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {weights.map((weight, index) => (
//                     <tr
//                       className={`text-center text-base ${
//                         weight.stockOut <= weight.stockAlert
//                           ? "bg-red-200"
//                           : "bg-green-200"
//                       }`} // Add yellow background if saved
//                       key={weight._id}
//                     >
//                       <td className="border px-4 py-2">{index + 1}</td>
//                       <td className="border px-4 py-2">
//                         {weight.materialName}
//                       </td>
//                       <td className="border px-4 py-2">{weight.stockOut}</td>
//                       <td className="border px-4 py-2">{weight.stockAlert}</td>
//                       <td className="border px-4 py-2">
//                         <button
//                           className="text-center bg-blue-500 text-white px-2 py-1 rounded"
//                           onClick={() => handleProcessClick(weight)}
//                         >
//                           Process
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Popup Modal */}
//         {isPopupOpen && selectedMaterial && (
//           <div className=" absolute top-32  overflow-hidden left-28 w-full  flex justify-center items-center">
//             <div className="bg-white rounded-lg shadow-lg p-6 w-fullmax-w-md">
//               <h2 className="text-lg font-semibold mb-4">
//                 Process Material: {selectedMaterial.materialName}
//               </h2>

//               <div>
//                 {/* Material Name Dropdown */}
//                 <div className="flex">
//                   <label className="block mb-2 ml-1">FormatNo</label>
//                   <input
//                     type="text"
//                     name="formatNo"
//                     value={formData.formatNo}
//                     onChange={handleInputChange}
//                     className="border rounded w-full p-2 mb-4 ml-3"
//                   />
//                   <label className="block mb-2 ml-3"> Date</label>
//                   <input
//                   type="date"
//                   name="expectedDate"
//                   value={formData.expectedDate}  // Bind expectedDate to formData
//                   onChange={handleInputChange}
//                   className="border rounded w-full p-2 mb-4 ml-3"
//                 />
//                 </div>
//                 <div className="flex"></div>
//                 <label className="block mb-2 ml-1">Maker Name</label>
//                 <input
//                   type="text"
//                   name="partyName"
//                   value={formData.partyName}
//                   onChange={handleInputChange}
//                   className="border rounded w-full p-2 mb-4 ml-1"
//                 />
//                 <label className="block mb-2 ml-1">Issue</label>
//                 <textarea
//                   name="issue"
//                   value={formData.issue}
//                   onChange={handleInputChange}
//                   className="border rounded w-full p-2 mb-4 ml-1"
//                 />
//                 <div className="flex">
//                   <label className="block mb-2 ml-1 text">Material</label>
//                   <select
//                     name="materialName"
//                     value={formData.materialName}
//                     onChange={handleMaterialChange}
//                     className="border rounded w-full p-2 mb-4 ml-3"
//                   >
//                     <option value="" disabled>
//                       Select material
//                     </option>
//                     {weights.map((weight) => (
//                       <option key={weight._id} value={weight.materialName}>
//                         {weight.materialName}
//                       </option>
//                     ))}
//                   </select>
//                   <label className="block mb-2 ml-3">Remark</label>
//                   <input
//                     type="text"
//                     name="remark"
//                     value={formData.remark}
//                     onChange={handleInputChange}
//                     className="border rounded w-full p-2 mb-4 ml-3"
//                   />
//                 </div>
//                 <div className="flex">
//                   <label className="block mb-2 ml-1">Quantity</label>
//                   <input
//                     type="number"
//                     name="qty"
//                     value={formData.qty}
//                     onChange={handleInputChange}
//                     className="border rounded w-full p-2 mb-4 ml-3 "
//                   />

//                   <label className="block mb-2 ml-3">Unit</label>
//                   <input
//                     type="text"
//                     name="unit"
//                     value={formData.unit}
//                     onChange={handleInputChange}
//                     className="border rounded w-full p-2 mb-4 ml-3"
//                   />
//                 </div>
        
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

