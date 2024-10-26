// // pages/outward.js
// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../Components/Sidebar";

// const Outward = () => {
//   const [outwards, setOutwards] = useState([]);
//   const [materials, setMaterials] = useState([]); // For storing material names
//   const [formData, setFormData] = useState({
//     materialName: "",
//     workerName: "",
//     qty: "",
//     reason: "mill",
//     expectedDate: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch all outward entries
//   const fetchOutwards = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:5000/api/outward/outward"); // Adjust the API path accordingly
//       setOutwards(res.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching outwards:", error);
//       setLoading(false);
//     }
//   };
//   const getCurrentDate = () => {
//     const today = new Date();
//     const yyyy = today.getFullYear();
//     const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
//     const dd = String(today.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   };
//   useEffect(() => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       expectedDate: getCurrentDate(),
//     }));

//     fetchOutwards();
//     fetchMaterials(); // Fetch the material names when the component mounts
//   }, []);
//   // Fetch material names for the dropdown
//   const fetchMaterials = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/outward/material"); // Adjust the API path for fetching materials
//       setMaterials(res.data); // Assuming the API returns a list of materials with "materialName"
//     } catch (error) {
//       console.error("Error fetching materials:", error);
//     }
//   };

//   // Create a new outward entry and update material qty
//   const createOutward = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       // Call the PATCH API to update the material quantity first
//       const materialResponse = await axios.patch(
//         "http://localhost:5000/api/material/material/outward",
//         {
//           materialName: formData.materialName,
//           outwardQty: formData.qty,
//         }
//       );

//       // Now create the outward entry if material quantity was updated successfully
//       const res = await axios.post(
//         "http://localhost:5000/api/outward/outward",
//         formData
//       );
//       setOutwards([...outwards, res.data]);
//       setFormData({
//         materialName: "",
//         workerName: "",
//         qty: "",
//         reason: "mill",
//         expectedDate: getCurrentDate(),
//       });
//     } catch (error) {
//       console.error(
//         "Error creating outward entry or updating material:",
//         error
//       );
//       setError(
//         "Error creating outward entry or updating material stock. Check if material exists and stock is sufficient."
//       );
//     }
//   };

//   // Delete an outward entry by ID and reset material qty
//   const deleteOutward = async (id) => {
//     try {
//       // Find the outward entry that is being deleted
//       const outwardToDelete = outwards.find((outward) => outward._id === id);
//       if (!outwardToDelete) return; // If outward entry is not found, return

//       // Delete the outward entry first
//       await axios.delete(`http://localhost:5000/api/outward/outward/${id}`);
//       setOutwards(outwards.filter((outward) => outward._id !== id));

//       // Reset the material quantity after deletion
//       await axios.patch(
//         "http://localhost:5000/api/material/material/resetQty",
//         {
//           materialName: outwardToDelete.materialName,
//           qtyToAdd: outwardToDelete.qty, // Adding back the quantity after deletion
//         }
//       );
//     } catch (error) {
//       console.error(
//         "Error deleting outward entry or resetting material qty:",
//         error
//       );
//     }
//   };

//   // Show a confirmation dialog before deleting
//   const handleDeleteClick = (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this entry?"
//     );
//     if (confirmed) {
//       deleteOutward(id); // Call the delete function if the user confirms
//     }
//   };

//   useEffect(() => {
//     fetchOutwards();
//     fetchMaterials(); // Fetch the material names when the component mounts
//   }, []);

//   return (
//     <>
//       <Sidebar />
//       <div className="p-2 lg:w-full md:pl-72 md:w-full text-black flex mt-20">

//         {/* Outward Form */}
//         <form
//           onSubmit={createOutward}
//           className="  bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2"
//         >
//           {/* Material Name Dropdown */}
//           <div className="mb-4">
//             <div className="mb-4">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="expectedDate"
//               >
//                 Expected Date
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
//                 id="expectedDate"
//                 type="date"
//                 value={formData.expectedDate}
//                 onChange={(e) =>
//                   setFormData({ ...formData, expectedDate: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="materialName"
//             >
//               Material Name
//             </label>
//             <select
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
//               id="materialName"
//               value={formData.materialName}
//               onChange={(e) =>
//                 setFormData({ ...formData, materialName: e.target.value })
//               }
//               required
//             >
//               <option value="">Select Material</option>
//               {materials.map((material) => (
//                 <option key={material._id} value={material.materialName}>
//                   {material.materialName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="workerName"
//             >
//               Worker Name
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
//               id="workerName"
//               type="text"
//               value={formData.workerName}
//               onChange={(e) =>
//                 setFormData({ ...formData, workerName: e.target.value })
//               }
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="qty"
//             >
//               Quantity
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
//               id="qty"
//               type="number"
//               value={formData.qty}
//               onChange={(e) =>
//                 setFormData({ ...formData, qty: parseInt(e.target.value) })
//               }
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="reason"
//             >
//               Reason
//             </label>
//             <select
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
//               id="reason"
//               value={formData.reason}
//               onChange={(e) =>
//                 setFormData({ ...formData, reason: e.target.value })
//               }
//               required
//             >
//               <option value="mill">Mill</option>
//               <option value="workshop">Workshop</option>
//             </select>
//           </div>

//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             type="submit"
//           >
//             Add Outward Entry
//           </button>

//           {error && <p className="text-red-500 mt-2">{error}</p>}
//         </form>

//         {/* Display Outward Entries */}
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <div className="overflow-x-auto w-full ml-5">
//           <div className="overflow-y-auto "style={{ height: '30rem' }}>

//             <table className=" bg-white rounded-lg shadow-md">
//               <thead>
//                 <tr className="bg-blue-500 text-white">
//                   <th className="py-3 px-4 text-left font-semibold">Sr</th>
//                   <th className="py-3 px-4 text-left font-semibold">Date</th>
//                   <th className="py-3 px-4 text-left font-semibold">
//                     Material Name
//                   </th>
//                   <th className="py-3 px-4 text-left font-semibold">
//                     Worker Name
//                   </th>
//                   <th className="py-3 px-4 text-left font-semibold">
//                     Quantity
//                   </th>
//                   <th className="py-3 px-4 text-left font-semibold">Reason</th>
//                   <th className="py-3 px-4 text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {outwards.map((outward, index) => (
//                   <tr
//                     key={outward._id}
//                     className="hover:bg-gray-100 transition-all"
//                   >
//                     <td className="py-3 px-4 border-b">{index + 1}</td>
//                     <td className="py-2 px-4 border-b">
//                     {new Date(outward.expectedDate).toLocaleDateString("en-GB")} {/* Option 1 */}
//                     {/* Or use the manual formatting approach as shown above for Option 2 */}
//                   </td>

//                     <td className="py-3 px-4 border-b">
//                       {outward.materialName}
//                     </td>
//                     <td className="py-3 px-4 border-b">{outward.workerName}</td>
//                     <td className="py-3 px-4 border-b">{outward.qty}</td>
//                     <td className="py-3 px-4 border-b">{outward.reason}</td>
//                     <td className="py-3 px-4 border-b">
//                       <button
//                         className="text-red-500 hover:text-red-700 font-semibold"
//                         onClick={() => handleDeleteClick(outward._id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Outward;

// pages/outward.js
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";

const Outward = () => {
  const [outwards, setOutwards] = useState([]);
  const [materials, setMaterials] = useState([]); // For storing material names
  const [filteredOutwards, setFilteredOutwards] = useState([]);
  const [formData, setFormData] = useState({
    materialName: "",
    workerName: "",
    qty: "",
    reason: "mill",
    expectedDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // To store the search term
  // Fetch all outward entries
  const fetchOutwards = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/outward/outward"); // Adjust the API path accordingly
      setOutwards(res.data);
      setFilteredOutwards(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching outwards:", error);
      setLoading(false);
    }
  };
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      expectedDate: getCurrentDate(),
    }));

    fetchOutwards();
    fetchMaterials(); // Fetch the material names when the component mounts
  }, []);
  // Fetch material names for the dropdown
  const fetchMaterials = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/outward/material"); // Adjust the API path for fetching materials
      setMaterials(res.data); // Assuming the API returns a list of materials with "materialName"
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  // Create a new outward entry and update material qty
  const createOutward = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Call the PATCH API to update the material quantity first
      const materialResponse = await axios.patch(
        "http://localhost:5000/api/material/material/outward",
        {
          materialName: formData.materialName,
          outwardQty: formData.qty,
        }
      );

      // Now create the outward entry if material quantity was updated successfully
      const res = await axios.post(
        "http://localhost:5000/api/outward/outward",
        formData
      );
      setOutwards([...outwards, res.data]);
      setFormData({
        materialName: "",
        workerName: "",
        qty: "",
        reason: "mill",
        expectedDate: getCurrentDate(),
      });
    } catch (error) {
      console.error(
        "Error creating outward entry or updating material:",
        error
      );
      setError(
        "Error creating outward entry or updating material stock. Check if material exists and stock is sufficient."
      );
    }
  };

  // Delete an outward entry by ID and reset material qty
  const deleteOutward = async (id) => {
    try {
      // Find the outward entry that is being deleted
      const outwardToDelete = outwards.find((outward) => outward._id === id);
      if (!outwardToDelete) return; // If outward entry is not found, return

      // Delete the outward entry first
      await axios.delete(`http://localhost:5000/api/outward/outward/${id}`);
      setOutwards(outwards.filter((outward) => outward._id !== id));

      // Reset the material quantity after deletion
      await axios.patch(
        "http://localhost:5000/api/material/material/resetQty",
        {
          materialName: outwardToDelete.materialName,
          qtyToAdd: outwardToDelete.qty, // Adding back the quantity after deletion
        }
      );
    } catch (error) {
      console.error(
        "Error deleting outward entry or resetting material qty:",
        error
      );
    }
  };

  // Show a confirmation dialog before deleting
  const handleDeleteClick = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (confirmed) {
      deleteOutward(id); // Call the delete function if the user confirms
    }
  };

  useEffect(() => {
    fetchOutwards();
    fetchMaterials(); // Fetch the material names when the component mounts
  }, []);
  useEffect(() => {
    const filtered = outwards.filter(
      (outward) =>
        outward.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outward.workerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOutwards(filtered);
  }, [searchTerm, outwards]); // Trigger filtering on searchTerm or outwards change

  return (
    <>
      <Sidebar />
      <div className="p-2 lg:w-full md:pl-72 md:w-full text-black flex mt-20">
       

        {/* Outward Form */}
        <form
          onSubmit={createOutward}
          className="  bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2"
        >
          {/* Material Name Dropdown */}
          <div className="mb-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="expectedDate"
              >
                Expected Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="expectedDate"
                type="date"
                value={formData.expectedDate}
                onChange={(e) =>
                  setFormData({ ...formData, expectedDate: e.target.value })
                }
                required
              />
            </div>

            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="materialName"
            >
              Material Name
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="materialName"
              value={formData.materialName}
              onChange={(e) =>
                setFormData({ ...formData, materialName: e.target.value })
              }
              required
            >
              <option value="">Select Material</option>
              {materials.map((material) => (
                <option key={material._id} value={material.materialName}>
                  {material.materialName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="workerName"
            >
              Worker Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="workerName"
              type="text"
              value={formData.workerName}
              onChange={(e) =>
                setFormData({ ...formData, workerName: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="qty"
            >
              Quantity
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="qty"
              type="number"
              value={formData.qty}
              onChange={(e) =>
                setFormData({ ...formData, qty: parseInt(e.target.value) })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="reason"
            >
              Reason
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              required
            >
              <option value="mill">Mill</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Add Outward Entry
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        {/* Display Outward Entries */}
        {loading ? (
          <p>Loading...</p>
        ) : (

          <div className="overflow-x-auto w-full ml-5">
          <input
            type="text"
            placeholder="Search by material or worker name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow appearance-none border rounded w-fit py-2 px-3 text-gray-700"
          />
            <div className="overflow-y-auto mt-5" style={{ height: "30rem" }}>
              <table className=" bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="py-3 px-4 text-left font-semibold">Sr</th>
                    <th className="py-3 px-4 text-left font-semibold">Date</th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Material Name
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Worker Name
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Quantity
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Reason
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOutwards.map((outward, index) => (
                    <tr
                      key={outward._id}
                      className="hover:bg-gray-100 transition-all"
                    >
                      <td className="py-3 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">
                        {new Date(outward.expectedDate).toLocaleDateString(
                          "en-GB"
                        )}{" "}
                        {/* Option 1 */}
                        {/* Or use the manual formatting approach as shown above for Option 2 */}
                      </td>

                      <td className="py-3 px-4 border-b">
                        {outward.materialName}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {outward.workerName}
                      </td>
                      <td className="py-3 px-4 border-b">{outward.qty}</td>
                      <td className="py-3 px-4 border-b">{outward.reason}</td>
                      <td className="py-3 px-4 border-b">
                        <button
                          className="text-red-500 hover:text-red-700 font-semibold"
                          onClick={() => handleDeleteClick(outward._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Outward;
