'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/utils/store";

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
    const response = await fetch(process.env.NEXT_PUBLIC_HTTP_AUTH + `login/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username_or_email: formData.email,
            password: formData.password,
        }),
    });

    if (response.ok){
      const data = await response.json();
      setUser(data.data.user);

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
          <div className="flex justify-between">
            <div className="mt-4 flex justify-between text-sm">
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                {t("Forgot Password?")}
              </Link>
            </div>
            <button onClick={() => {window.location.href = "http://localhost:8000/auth/login/google-oauth2/";}}>
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}