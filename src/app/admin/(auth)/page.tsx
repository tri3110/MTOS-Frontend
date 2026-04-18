'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/utils/store";
import { toast } from "react-toastify";
import { AuthService } from "@/services/auth.service";

export default function LoginAdmin() {
  const { t } = useTranslation();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await AuthService.login({
      email: formData.email,
      password: formData.password
    });

    if (response?.user){
      setUser(response.user);
      router.push("/admin/dashboard");
    }
    else{
      toast.error("Incorrect username or password.");
    }
  };

  return (
    
    <div className="min-h-screen flex">
      <ToastContainer position="top-center" />

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {t("Sign In")}
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("password")}
              </label>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPass ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium
              hover:bg-blue-700 active:scale-[0.98] transition"
            >
              {t("login")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              {t("Forgot Password?")}
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="photo-1555066931-4365d14bab8c.jpg"
          alt="login"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-white text-center px-6">
            <h2 className="text-3xl font-bold mb-2">
              Welcome
            </h2>
            <p className="text-gray-200">
              Manage your dashboard easily and efficiently
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}