"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  faEye,
  faEyeSlash,
  faUser,
  fawhatsapp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   // Add event listener when component mounts
  //   const handleKeyDown = (event) => {
  //     // Check if Ctrl + N is pressed
  //     if (event.ctrlKey && event.key === "z") {
  //       // Navigate to proxyLogin page
  //       router.push('/proxyLogin');
  //     }
  //   };

  //   // Attach event listener to the document
  //   document.addEventListener("keydown", handleKeyDown);

  //   // Remove event listener when component unmounts
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []); 
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        { username, password }
      );
      // Handle successful login, save token to localStorage, redirect, etc.
      console.log(response.data);
      const token = response.data.token;

      localStorage.setItem("AdminAuthToken", token);
      setMessage("Login successful");
      router.push("/material");
    } catch (error) {
      setMessage("Authentication failed");
    }
  };


  
  useEffect(() => {
    localStorage.removeItem("AdminAuthToken");
  }, []);
  const [isOrderEnabled, setIsOrderEnabled] = useState(true);
  const handleToggle = () => {
    const newIsOrderEnabled = !isOrderEnabled;
    setIsOrderEnabled(newIsOrderEnabled);
    localStorage.setItem("isOrderEnabled", newIsOrderEnabled.toString());
    // Disable the toggle
    localStorage.setItem("disableToggle", "true");
  };
  return (
    <>
 
        <div
          className="bg-cover bg-center min-h-screen flex items-center justify-center text-black"
          style={{ backgroundImage: "url('blue.jpg')" }}
        >
          <div className="absolute inset-0 bg-opacity-50 bg-violet-900"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-md w-full px-6">
              <div className="flex flex-col items-center justify-center h-full">
                <img src="/steel.png" alt="logo" className="h-16 w-16" />
                <h1 className="text-3xl font-bold text-white mb-6">
                  Khatav Steel
                </h1>
              </div>
              <div className=" flex justify-between mb-2">
             
             <div className="ml-3 text-white font-semibold text-base">
               Admin Login
             </div>
             <label
             htmlFor="toggle"
             className="flex items-center cursor-pointer mr-2.5"
           >
            
           </label>
           </div>

              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm">
                <div className="w-full p-3 lg:w-96 border-solid">
                  {/* <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src="/ab.png"
                  alt="logo"
                  height={80}
                  width={80}
                  style={{ display: "block" }}
                />
              </div> */}
                  <p className="text-2xl text-violet-700 text-center font-medium mb-8">
                    Welcome!
                  </p>

                  <div className="mt-4 relative">
                    <label className="block text-gray-700 text-sm md:text-base font-semibold mb-2">
                      Username
                    </label>
                    <input
                      className="bg-violet-200 text-gray-700 focus:outline-none focus:shadow-outline border border-violet-300 rounded py-1 px-4 block w-full appearance-none pr-10 text-sm md:text-base"
                      type="text"
                      value={username}
                      placeholder="Enter Username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 mt-8">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-violet-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 relative">
                    <label className="block text-gray-700 text-sm md:text-base font-semibold mb-2">
                      Password
                    </label>
                    <input
                      className="bg-violet-200 text-gray-700 focus:outline-none focus:shadow-outline border border-violet-300 rounded py-1 px-4 block w-full appearance-none pr-10 text-sm md:text-base"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Enter Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 mt-8">
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="text-violet-500 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </div>
             
                  {/*
                    
                         <div className="mb-8 flex justify-end">
                    <Link
                      href="/forgotPassword"
                      className="text-sm md:text-sm text-violet-500 mr-2"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                    */}
                  <div className="flex justify-center mt-7">
                    <button
                      className="bg-violet-200 text-violet-600 hover:bg-violet-600 hover:text-white font-bold py-2 rounded-md text-sm   px-5 w-full"
                      onClick={handleLogin}
                    >
                      Login
                    </button>
                  </div>

                  {message && <p className="mt-4 text-red-500">{message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
    
    </>
  );
}
