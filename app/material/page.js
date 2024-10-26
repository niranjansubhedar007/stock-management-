"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faCircleXmark,
  faTimesCircle,
  faPenToSquare,
  faTrash,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Components/Sidebar";

const Material = () => {
  const [materialName, setMaterialName] = useState("");
  const [qty, setQty] = useState("");
  const [stockAlert, setStockAlert] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [editedMaterialName, setEditedMaterialName] = useState("");
  const [editedQty, setEditedQty] = useState("");
  const [editedStockAlert, setEditedStockAlert] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [materialId, setMaterialId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isChecked, setIsChecked] = useState(false); // New state for checkbox
  const [currentPage, setCurrentPage] = useState(1);
  const materialsPerPage = 10;
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state

  const router = useRouter();

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsEditModalOpen(false);
  };

  const handleMaterialNameChange = (e) => {
    const capitalizedMaterialName = capitalizeFirstLetter(e.target.value);
    setMaterialName(capitalizedMaterialName);
  };

  const handleQtyChange = (e) => {
    const capitalizedQty = capitalizeFirstLetter(e.target.value);
    setQty(capitalizedQty);
  };

  const handleStockAlertChange = (e) => {
    const capitalizedStockAlert = capitalizeFirstLetter(e.target.value);
    setStockAlert(capitalizedStockAlert);
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/material/materials",
        { materialName, qty, stockAlert }
      );

      // Update the materials state with the new material
      setMaterials([...materials, response.data]);

      console.log(response.data);
      setMaterialName("");
      setQty("");
      setStockAlert("");
      setSuccess(true);
      setIsChecked(false);
      setIsModalOpen(false);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleEditClick = (material) => {
    setEditedMaterialName(material.materialName);
    setEditedQty(material.qty);
    setEditedStockAlert(material.stockAlert);
    setIsChecked(material.isChecked); // Set checkbox state
    setMaterialId(material._id); // Store the materialId in state
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/material/materials/${materialId}`,
        {
          materialName: editedMaterialName,
          isChecked,
          qty: editedQty,
          stockAlert: editedStockAlert,
        }
      );

      // Update the materials state with the updated material data
      setMaterials(
        materials.map((material) => {
          if (material._id === materialId) {
            return {
              ...material,
              materialName: editedMaterialName,
              qty: editedQty,
              stockAlert: editedStockAlert,
              isChecked,
            };
          }
          return material;
        })
      );

      console.log(response.data); // Log the response data to the console
      setSuccess(true);
      setIsEditModalOpen(false); // Close the modal
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    // Fetch materials data when the component mounts
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/material/materials"
        );
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Calculate the index of the first and last vehicle to display
  const indexOfLastMaterials = currentPage * materialsPerPage;
  const indexOfFirstMaterials = indexOfLastMaterials - materialsPerPage;
  const currentMaterials = materials.slice(
    indexOfFirstMaterials,
    indexOfLastMaterials
  );

  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(materials.length / materialsPerPage);

  // Generate an array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter materials based on search term
  const filteredMaterials = materials.filter((material) =>
    material.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (materialId) => {
    setMaterialToDelete(materialId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setMaterialToDelete(null);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/material/materials/${materialToDelete}`
      );

      if (response.data.message === "material deleted successfully") {
        // Remove the deleted material from the materials state
        setMaterials(
          materials.filter((material) => material._id !== materialToDelete)
        );
      }

      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  return (
    <div>
      <>
        <Sidebar />
        <div className="p-2 lg:pl-72 lg:w-full md:pl-72 md:w-full text-black">
          <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            {isModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="bg-white rounded-lg shadow-lg">
                  {/* Modal header */}
                  <div className="flex items-center justify-between p-4 border-b rounded-t">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Add New Material
                    </h3>
                    {/* Close button */}
                    <button
                      onClick={handleToggleModal}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        style={{ color: "#7644a6" }}
                        size="xl"
                      />
                    </button>
                  </div>
                  {/* Modal body */}
                  <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4 grid-cols-1">
                      <div>
                        <label
                          htmlFor="materialName"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Material Name
                        </label>
                        <input
                          type="text"
                          name="materialName"
                          id="materialName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block lg:w-96 md:w-96 w-60 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type material name"
                          required
                          value={materialName}
                          onChange={handleMaterialNameChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="qty"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Stock out
                        </label>
                        <input
                          type="number"
                          name="qty"
                          id="qty"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block lg:w-96 md:w-96 w-60 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type Stock out"
                          required
                          value={qty}
                          onChange={handleQtyChange}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="stockAlert"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Stock Alert
                        </label>
                        <input
                          type="number"
                          name="stockAlert"
                          id="stockAlert"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block lg:w-96 md:w-96 w-60 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type Stock alert"
                          required
                          value={stockAlert}
                          onChange={handleStockAlertChange}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-violet-600 text-white hover:text-white"
                      >
                        Add Material
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isEditModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="bg-white rounded-lg shadow-lg">
                  <div className="flex items-center justify-between p-4 border-b rounded-t">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Edit Material
                    </h3>
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        style={{ color: "#7644a6" }}
                        size="xl"
                      />
                    </button>
                  </div>
                  <form className="p-4 md:p-5" onSubmit={handleEditSubmit}>
                    <div className="grid gap-4 mb-4 grid-cols-1">
                      <div>
                        <label
                          htmlFor="editedMaterialName"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Material Name
                        </label>
                        <input
                          type="text"
                          name="editedMaterialName"
                          id="editedMaterialName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block lg:w-96 md:w-96 w-60 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type edited material name"
                          required
                          value={editedMaterialName}
                          onChange={(e) =>
                            setEditedMaterialName(e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="editedQty"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Stock out
                        </label>
                        <input
                          type="text"
                          name="editedQty"
                          id="editedQty"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block lg:w-96 md:w-96 w-60 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type edited stock out"
                          required
                          value={editedQty}
                          onChange={(e) => setEditedQty(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="editedStockAlert"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Stock alert
                        </label>
                        <input
                          type="text"
                          name="editedStockAlert"
                          id="editedStockAlert"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block lg:w-96 md:w-96 w-60 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type edited stock alert"
                          required
                          value={editedStockAlert}
                          onChange={(e) => setEditedStockAlert(e.target.value)}
                        />
                      </div>
                      {/* <div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isChecked"
                            name="isChecked"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-gray-600 dark:text-white focus:ring-primary-500 dark:focus:ring-primary-400 rounded"
                          />
                          <label
                            htmlFor="isChecked"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Is Checked
                          </label>
                        </div>
                      </div> */}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border bg-violet-600 text-white hover:text-white"
                      >
                        Update Material
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className=" bg-white shadow-md rounded-md">
              <div className="flex flex-col md:flex-col lg:flex-row py-4 px-4 items-center justify-between mb-4">
                <h1 className="text-xl font-bold font-sans mb-2 md:mb-0 text-gray-600">
                  Material
                </h1>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="relative mb-2 md:mb-0 md:mr-3">
                    <input
                      className="border-2 border-gray-300 pl-2 rounded-full bg-white h-9 text-sm focus:outline-non"
                      id="searchInput"
                      type="text"
                      name="searchInput"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={handleToggleModal}
                      className="bg-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white font-bold py-2 rounded-md text-sm  mr-2 px-5"
                      type="button"
                    >
                      <FontAwesomeIcon className="px-2" icon={faCirclePlus} />
                      Add Material
                    </button>
                  </div>
                </div>
              </div>
              <div className="shadow-md sm:rounded-lg bg-white  ">
                <div className="overflow-y-auto "style={{ height: '30rem' }}>
                  <table className="min-w-full mt-4 ">
                    <thead className="text-base bg-violet-100 text-violet-500">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Serial No.
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3  whitespace-nowrap text-left pl-10 lg:pl-40"
                        >
                          Material Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3  whitespace-nowrap text-left pl-10 lg:pl-52"
                        >
                          Stock out
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3  whitespace-nowrap text-left pl-10 lg:pl-32"
                        >
                          Stock alert
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaterials
                        .slice(
                          (currentPage - 1) * materialsPerPage,
                          currentPage * materialsPerPage
                        )
                        .map((material, index) => (
                          <tr
                            key={material._id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-100 "
                            }
                          >
                            <td className="p-2  text-center text-gray">
                              {(currentPage - 1) * materialsPerPage + index + 1}
                            </td>
                            <td className="px-6 py-4 text-left text-gray lg:pl-40 md:pl-10 pl-6">
                              {material.materialName}
                            </td>
                            <td className="px-6 py-4 text-left text-gray lg:pl-52 md:pl-10 pl-6">
                              {material.qty}
                            </td>
                            <td className="px-6 py-4 text-left text-gray lg:pl-32 md:pl-10 pl-6">
                              {material.stockAlert}
                            </td>
                            <td className="py-4 text-center">
                              <button
                                onClick={() => handleEditClick(material)}
                                className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm"
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  color="#482668"
                                />
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
        </div>
      </>
    </div>
  );
};

export default Material;
