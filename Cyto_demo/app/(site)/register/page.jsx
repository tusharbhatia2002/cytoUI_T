'use client'

import { useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { IoMdLock } from "react-icons/io";

export default function Register() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const registerUser = async (e) => {
    e.preventDefault();
    axios.post('/api/register', data)
      .then(() => {
        toast.success('User has been registered!');
        window.location.href = `/login`
      })
      .catch(() => toast.error('Something went wrong!'));
  };

  return (
    <>
      <div className="bg-gradient-to-r from-cyan-100 to-blue-300 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <a href="/" className="text-4xl font-bold text-gray-800 mb-8">CytoUI</a>
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h1 className="text-3xl text-black font-bold mb-4">Register</h1>
            <p className="text-gray-500 mb-8">Create your account</p>

            <form onSubmit={registerUser}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={data.name}
                    onChange={e => setData({ ...data, name: e.target.value })}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 text-black sm:text-sm border-gray-300 rounded-md"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={data.email}
                    onChange={e => setData({ ...data, email: e.target.value })}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 text-black sm:text-sm border-gray-300 rounded-md"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoMdLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={data.password}
                    onChange={e => setData({ ...data, password: e.target.value })}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 text-black sm:text-sm border-gray-300 rounded-md"
                    placeholder="Password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 text-sm hover:underline">
                  Login now
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
