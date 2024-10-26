"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  faTruckMoving,
  faGauge,
  faPeopleGroup,
  faBoxesPacking,
  faScaleUnbalancedFlip,
  faList,
  faMinus,
  faRightFromBracket,
  faTimes,
  faBars,
  faPager,
  faStore,
  faSquarePlus,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    localStorage.removeItem("AdminAuthToken");
    localStorage.removeItem("EmployeeAuthToken");
    router.push("/adminLogin");
  };

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? (
                  <FontAwesomeIcon icon={faTimes} size="xl" />
                ) : (
                  <FontAwesomeIcon icon={faBars} size="xl" />
                )}
              </button>

              <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                <img src="steel.png" className="h-8 me-3" alt="steel Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Khatav Steel
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm  rounded-full "
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Logout</span>
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className=" w-5 h-5"
                      onClick={logout}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-violet-700 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-violet-700 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="material"
                className="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faBoxesPacking}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-xl">
                  Material
                </span>
              </a>
            </li>
            <li>
              <a
                href="stockManagement"
                className="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faPager}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-xl">
                  Indent Form
                </span>
              </a>
            </li>
            <li>
              <a
                href="purchaseOrder"
                className="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faSquarePlus}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-xl">
                  Purchase Order
                </span>
              </a>
            </li>
            <li>
            <a
              href="inwardData"
              className="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
            >
              <FontAwesomeIcon
                icon={faStore}
                size="lg"
                style={{ color: "#FFFFFF" }}
              />
              <span className="flex-1 ms-3 whitespace-nowrap text-xl">
                Inward data 
              </span>
            </a>
          </li>
          <li>
          <a
            href="outwardData"
            className="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              size="lg"
              style={{ color: "#FFFFFF" }}
            />
            <span className="flex-1 ms-3 whitespace-nowrap text-xl">
              Outward data 
            </span>
          </a>
        </li>
          <li>
          <button
            type="button"
            className="flex items-center w-full p-2 text-base  transition duration-75 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
            onClick={toggleDropdown}
          >
            <FontAwesomeIcon
              icon={faList}
              size="lg"
              style={{ color: "#FFFFFF" }}
            />
            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap text-xl">
              Reports
            </span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <ul
            id="dropdown-example"
            className={`py-2 space-y-2 ${
              isDropdownOpen ? "" : "hidden"
            }`}
          >
            <li>
              <a
                href="inwardReport"
                className="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faMinus}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-base">
                   Inward Report
                </span>
              </a>
            </li>

            <li>
              <a
                href="outwardReport"
                className="flex items-center p-2 text-violet-100 rounded-lg dark:text-white hover:bg-violet-600 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faMinus}
                  size="lg"
                  style={{ color: "#FFFFFF" }}
                />
                <span className="flex-1 ms-3 whitespace-nowrap text-base">
                   Outward Report
                </span>
              </a>
            </li>
          </ul>
        </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
