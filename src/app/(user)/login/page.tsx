'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/utils/store";
import { useCart } from "@/hooks/useCart";
import { AuthService } from "@/services/auth.service";
import { API_BASE_URLS } from "@/lib/constants";

export default function LoginAdmin() {
  const { t } = useTranslation();
  const { syncCart} = useCart();
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

    if (response?.user) {
      setUser(response.user);

      await syncCart();

      router.push("/");
    }
  };

  return (
    <div className="flex-grow">
      <div className="flex h-full w-full items-center justify-center mt-12">
        <ToastContainer position="top-center" />
        <div className="card p-4 w-full max-w-sm border border-gray-300 rounded-lg">
          <div className="flex mb-6 border-b border-gray-300 dark:border-gray-600">
            <button
              className={`flex-1 text-center py-2 font-semibold border-b-2 border-blue-600 text-blue-600`}
            >
              { t("login") }
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="text"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{ t("password") }</label>
                <div className="relative">
                  <input
                    type={ showPass ? "text" : "password" }
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  <button type="button" className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowPass(!showPass)}
                  >
                    <svg className="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" >
                      {showPass ? (
                        <>
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      ) : (
                        <>
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" y1="2" x2="22" y2="22" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                  
              </div>
            </>
            <button
              type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            > {t("login")} </button>
          </form>
          <div className="flex justify-between mt-2">
            <div className="mt-4 flex justify-between text-sm">
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                {t("Forgot Password?")}
              </Link>
            </div>
            <button
              onClick={() => {
                window.location.href = API_BASE_URLS.ADMIN_MEDIA +
                  "/auth/login/google-oauth2/";
              }}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.4 0 19.2-7.6 19.2-20 0-1.3-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.1 29.2 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.2l-6.3-5.2C29.5 35.3 26.9 36 24 36c-5.3 0-9.8-3.4-11.3-8.1l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.7-3 4.9-5.9 6.1l6.3 5.2C39.5 36.2 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}