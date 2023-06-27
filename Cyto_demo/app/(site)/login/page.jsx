'use client'

import { useState, useEffect } from "react"
import { signIn, useSession } from 'next-auth/react'
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { FiUser, FiLock } from "react-icons/fi";
import { SiGithub, SiGoogle } from "react-icons/si";

export default function Login() {
  const session = useSession();
  const router = useRouter();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [session, router]);

  const loginUser = async (e) => {
    e.preventDefault();
    signIn('credentials', { ...data, redirect: false }).then((callback) => {
      if (callback?.error) {
        toast.error(callback.error);
      }

      if (callback?.ok && !callback?.error) {
        toast.success('Logged in successfully!');
      }
      
    });
  };

  return (
    <div className="bg-gradient-to-r from-cyan-100 to-blue-300 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <a href="/" className="text-4xl font-bold text-gray-800 mb-8">
          CytoUI
        </a>
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-3xl font-bold mb-4">Login</h1>
          <p className="text-gray-500 mb-8">Sign In to your account</p>

          <form className="space-y-6" onSubmit={loginUser}>
            <div className="mb-6">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 text-black sm:text-sm border-gray-300 rounded-md"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 text-black sm:text-sm border-gray-300 rounded-md"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>

          </form>
          <button onClick={() => signIn('github')} className="flex items-center justify-center w-full mt-4 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800">
            <SiGithub className="mr-2" />
            Sign In with GitHub
          </button>
          <button onClick={() => signIn('google')} className="flex items-center justify-center w-full mt-2 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600">
            <SiGoogle className="mr-2" />
            Sign In with Google
          </button>

          <p className="text-gray-500 mt-4 text-sm text-center">
            Not a member?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
