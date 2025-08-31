"use client"

import axios from "axios";
import Link from "next/link";
import { useState } from "react";


export default function Login() {
 
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
   

    const handleSubmit= async (e)=>{
        e.preventDefault()
        console.log({ email, password }); 
        try {
          const response = await axios.post('/api/login', {
            
            email,
            password
            
          });
          console.log("Registration successful:", response.data);
        } catch (error) {
          if (error.response) {
            // Server responded with a status code outside 2xx
            console.log("Server responded with error:", error.response.data);
          } else if (error.request) {
            // Request was made but no response received
            console.log("No response received:", error.request);
          } else {
            // Something else caused the error
            console.log("Error setting up request:", error.message);
          }
        }
        

    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              type="text"
              name="email"
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
            <Link href="/register" className="text-blue-500 hover:underline">
              or register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
