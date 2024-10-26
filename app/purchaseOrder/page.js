"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { useRouter } from "next/navigation";

const PurchaseOrder = () => {
  const [weights, setWeights] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]); // Store selected materials
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    formatNo: "",
    partyName:"",
    isChecked: false, // default value for checkbox
    materials: [], // you can initialize other form fields here as well
  });

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
          "http://localhost:5000/api/indentForm/indentForms"
        );
        setWeights(response.data);
      } catch (error) {
        console.error("Error fetching weights:", error);
      }
    };
    fetchWeights();
  }, []);

  // Function to handle checkbox change
  const handleCheckboxChange = (material, checked) => {
    if (checked) {
      // Add material to selectedMaterials array with current date as expectedDate
      setSelectedMaterials((prevSelected) => [
        ...prevSelected,
        { ...material, expectedDate: new Date().toISOString().split("T")[0] },
        // Set expectedDate to current date
      ]);
    } else {
      // Remove material from selectedMaterials array
      setSelectedMaterials((prevSelected) =>
        prevSelected.filter((m) => m._id !== material._id)
      );
    }
  };

  const handlePOButtonClick = (weight) => {
    console.log(weight); // Add this line to check what `weight` contains

    if (weight && weight.formatNo) {
      if (selectedMaterials.length > 0) {
        setFormData({
          ...formData,
          formatNo: weight.formatNo,
        });
        setIsPopupOpen(true);
      } else {
        setErrorMessage("Please select at least one material.");
      }
    } else {
      setErrorMessage("Weight or format number is undefined.");
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
    setSelectedMaterials([]); // Clear selected materials on close
  };
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Handles formData inputs like partyName
    });
    
    setSelectedMaterials((prevSelected) => {
      const updatedMaterials = [...prevSelected];
      updatedMaterials[index] = { ...updatedMaterials[index], [name]: value };
      return updatedMaterials;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedMaterials.length === 0) {
      setErrorMessage("No materials selected.");
      return;
    }

    const dataToSubmit = {
      formatNo: formData.formatNo,
      isTemporary: false,
      partyName:formData.partyName,

      materials: selectedMaterials.map((material) => ({
        materialName: material.materialName,
        qty: material.qty,
        unit: material.unit,
        currentAmt: material.currentAmt,
        previousAmt: material.previousAmt,
        expectedDate: material.expectedDate, // Include expected date
        discount: material.discount, // Include discount
        des: material.des, // Include description
        isChecked: formData.isChecked,

      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/poForm/poForm",
        dataToSubmit
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Purchase order created successfully!");
        setErrorMessage("");
        handleClosePopup();
      } else {
        throw new Error("Failed to create purchase order.");
      }


      const printData = selectedMaterials.map((material) => ({
        materialName: material.materialName,
        formatNo: formData.formatNo,
        partyName: formData.partyName || "Not specified",
        remark: formData.remark || "",
        issue: formData.issue || "",
        qty: material.qty,
        unit: material.unit,
        discount: material.discount || 0,
        des: material.des || "",
        currentAmt: material.currentAmt,
        total: (material.qty * material.currentAmt - (material.discount || 0)).toFixed(2), // calculate total
      }));
      const grandTotal = printData.reduce((acc, item) => acc + parseFloat(item.total), 0).toFixed(2); // Calculate grand total
     
  
      const printWindow = window.open("", "_self");
      printWindow.document.open();
      printWindow.document.write(`
        <html>
        <head>
          <title>Purchase Order Print Preview</title>
          <style>
            @page { margin: 5mm; }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f4f4f4;
              color: #333;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border: 1px solid #ccc;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
            }
            .details {
              margin-bottom: 20px;
            }
            .details div {
              margin-bottom: 5px;
            }
            .details p {
              margin: 0;
            }
            .both-side {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            table, th, td {
              border: 1px solid #333;
            }
            th, td {
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: bold;
            }
            .signatures {
              margin-top: 30px;
              font-size: 14px;
              text-align: left;
            }
            .info {
              margin-top: 20px;
              font-size: 14px;
              text-align: left;
              border-top: 1px solid #333;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>KHATAV STEEL PVT LTD</h1>
              <p>PLOT NO. L09 ADDITIONAL MIDC SATARA - 415004</p>
              <p>PIN: 415004</p>
              <p>Email: ksplsatara@gmail.com</p>
              <h3>Purchase Order</h3>
            </div>
  
            <div class="details">
              <div class="both-side">
                <p><strong>P.O No:</strong> ${printData[0].formatNo}</p>
                <div class="date-time" id="date-time"></div>
              </div>
  
              <div class="both-side">
                <div class="party-info">
                  <p><strong>To:</strong></p>
                  <p><strong>${printData[0].partyName}</strong></p>
                  <p>SATARA - 415004</p>
                </div>
              </div>
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${printData
                  .map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.materialName}</td>
                      <td>${item.des}</td>
                      <td>${item.qty}</td>
                      <td>${item.currentAmt}</td>
                      <td>${item.discount}</td>
                      <td>${item.total}</td>
                    </tr>
                  `)
                  .join("")}
                     <tr>
                  <td colspan="6" style="text-align: right;"><strong>Grand Total:</strong></td>
                  <td><strong>${grandTotal}</strong></td>
                </tr>
              </tbody>
            </table>
  
            <div class="signatures">
              <p>Company GST No: 27AAKCK7341P1ZT</p>
              <p>Company PAN No: AAKCK7341P</p>
            </div>
  
            <div class="info">
              <p>1. Duties & Taxes: Extra as applicable (18% GST)</p>
              <p>2. Payment Terms: One Month</p>
              <p>3. Freight: As per the company's policy</p>
              <p>4. Insurance: To be discussed</p>
              <p>5. Packing Charges: As per standard terms</p>
              <p>6. Advance Payment: Not required</p>
              <p>7. Delivery: Same day</p>
            </div>
  
            <div style="text-align: right;">
              <p>For, KHATAV STEEL PVT LTD</p>
            </div>
          </div>
  
          <!-- Script to add date and time -->
          <script>
            document.addEventListener("DOMContentLoaded", function () {
              var currentDate = new Date();
              var dateOptions = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              };
              var timeOptions = {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              };
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
    } catch (error) {
      console.error("Error submitting purchase order:", error);
      setErrorMessage("Error creating purchase order.");
      setSuccessMessage("");
    }
  };
  const handleUpdate = async (materialName, qtyToAdd) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/material/material`, // API endpoint to update quantity
        {
          materialName, // Pass the material name
          qty: qtyToAdd, // Pass the quantity to add
        }
      );
      setSuccessMessage(`Quantity updated for ${materialName} successfully!`);
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating material quantity:", error);
      setErrorMessage("Failed to update material quantity.");
      setSuccessMessage("");
    }
  };
  const handleUpdateAllQuantities = async () => {
    try {
      const updatePromises = selectedMaterials.map((material) => {
        const materialName = material.materialName;
        const qtyToAdd = parseInt(material.qty);

        if (qtyToAdd && qtyToAdd > 0) {
          // Call the update function for each material
          return handleUpdate(materialName, qtyToAdd);
        } else {
          setErrorMessage(`Please enter a valid quantity for ${materialName}.`);
          return Promise.reject(); // Skip if quantity is invalid
        }
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      setSuccessMessage("Quantities updated for all selected materials!");
    } catch (error) {
      console.error("Error updating material quantities:", error);
      setErrorMessage("Failed to update material quantities.");
    }
  };


  
  


  return (
    <div>
      <Sidebar />
      <div className="p-2 overflow-hidden lg:pl-72 lg:w-full md:pl-72 md:w-full min-h-screen text-black">
        <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-2 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Purchase order
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
            <div className="table-container text-sm custom-scrollbars">
              <div className="overflow-y-auto" style={{ height: "30rem" }}>
                <table className="min-w-full bg-white border border-gray-300 text-center align-middle">
                  <thead className="text-base bg-violet-100 text-violet-500">
                    <tr>
                      <th className="px-4 py-2 whitespace-nowrap">Select</th>
                      <th className="px-4 py-2 whitespace-nowrap">SR No</th>
                      <th className="px-4 py-2 whitespace-nowrap">Format No</th>
                      <th className="px-4 py-2 whitespace-nowrap">Date</th>
                      <th className="px-4 py-2 whitespace-nowrap">
                        Material name
                      </th>
                      <th className="px-4 py-2 whitespace-nowrap">Qty</th>
                      <th className="px-4 py-2 whitespace-nowrap">Unit</th>
                      <th className="px-4 py-2 whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weights.map((weight, index) =>
                      weight.materials.map((material, matIndex) => (
                        <tr
                          className="text-center text-base"
                          key={material._id}
                        >
                          <td className="border px-4 py-2">
                            <input
                              type="checkbox"
                              checked={selectedMaterials.some(
                                (m) => m._id === material._id
                              )}
                              onChange={(e) =>
                                handleCheckboxChange(material, e.target.checked)
                              }
                            />
                          </td>
                          <td className="border px-4 py-2">{matIndex + 1}</td>
                          <td className="border px-4 py-2">
                            {weight.formatNo}
                          </td>
                          <td className="border px-4 py-2">
                            {weight.expectedDate}
                          </td>
                          <td className="border px-4 py-2">
                            {material.materialName}
                          </td>
                          <td className="border px-4 py-2">{material.qty}</td>
                          <td className="border px-4 py-2">{material.unit}</td>
                          <td className="border px-4 py-2">
                            <button
                              onClick={() => handlePOButtonClick(weight)}
                              className="text-center bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              P.O
                            </button>


                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {isPopupOpen && (
          <div className="flex items-center justify-center inset-0 fixed z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full overflow-y-auto h-1/2">
              <h2 className="text-xl font-bold mb-4">Submit Purchase Order</h2>
              <form onSubmit={handleSubmit}>
                {selectedMaterials.map((material, index) => (
                  <div key={material._id} className="mb-4">
                    <h3 className="font-semibold mb-2">
                      {material.materialName}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block mb-1">Format No</label>
                      <input
                        type="text"
                        name="formatNo"
                        value={formData.formatNo} // Display formatNo
                        readOnly
                        className="border px-2 py-1 rounded w-full bg-gray-100"
                      />
                      <div>
                        <label className="block mb-1">Quantity</label>
                        <input
                          type="number"
                          name="qty"
                        readOnly

                          value={material.qty} // Allow input of qty
                          onChange={(e) => handleInputChange(e, index)}
                          className="border px-2 py-1 rounded w-full bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Unit</label>
                        <input
                          type="text"
                        readOnly

                          name="unit"
                          value={material.unit} // Allow input of unit
                          onChange={(e) => handleInputChange(e, index)}
                          className="border px-2 py-1 rounded w-full bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Expected Date</label>
                        <input
                          type="date"
                          name="expectedDate"
                          value={material.expectedDate} // Set default value here
                          onChange={(e) => handleInputChange(e, index)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Previous Amt</label>
                        <input
                          type="number"
                          name="previousAmt"
                          onChange={(e) => handleInputChange(e, index)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Current Amt</label>
                        <input
                          type="number"
                          name="currentAmt"
                          onChange={(e) => handleInputChange(e, index)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Discount</label>
                        <input
                          type="number"
                          name="discount"
                          onChange={(e) => handleInputChange(e, index)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block mb-1">Description</label>
                        <textarea
                          name="des"
                          onChange={(e) => handleInputChange(e, index)}
                          className="border px-2 py-1 rounded w-full"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mb-4">
              <label className="block mb-1">Party Name</label>
              <input
                type="text"
                name="partyName" // Input for partyName
                value={formData.partyName}
                onChange={handleInputChange}
                className="border px-2 py-1 rounded w-full"
              />
            </div>
                {successMessage && (
                  <p className="text-green-500">{successMessage}</p>
                )}
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <label className="block text-sm font-medium">
                  Mark as Checked:
                </label>
                <input
                  type="checkbox"
                  name="isChecked"
                  checked={formData.isChecked}
                  onChange={(e) =>
                    setFormData({ ...formData, isChecked: e.target.checked })
                  }
                />
                <div className="flex justify-center ">
                  <button
                    type="button"
                    onClick={handleClosePopup}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 mx-4 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateAllQuantities}
                    className="bg-green-500 text-white px-4 py-2 rounded "
                  >
                    Update All Quantities
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrder;
