"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
     Phone,
     Lock,
     AlertCircle,
     Loader2,
     Eye,
     EyeOff,
     ArrowRight,
} from "lucide-react";
import { login } from "@/apis/login";

export default function LoginPage() {
     const navigate = useRouter();
     const allowedRole = [
          "super-admin",
          "distributor",
          "delivery",
          "shopkeeper",
     ];
     const roleSet = usePathname().split("/");
     const role = roleSet
          .filter((item) => allowedRole.includes(item))
          .toString();

     const [formData, setFormData] = useState({
          phone: "",
          password: "",
     });
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [showPassword, setShowPassword] = useState(false);
     const [fieldErrors, setFieldErrors] = useState({});

     const validate = () => {
          const errors = {};
          if (!formData.phone || formData.phone.trim() === "") {
               errors.phone = "Phone number is required";
          } else if (formData.phone.length < 11) {
               errors.phone = "Enter a valid phone number";
          }
          if (!formData.password || formData.password.trim() === "") {
               errors.password = "Password is required";
          } else if (formData.password.length < 8) {
               errors.password = "Password must be at least 8 characters";
          }
          setFieldErrors(errors);
          return Object.keys(errors).length === 0;
     };

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
          if (fieldErrors[name]) {
               setFieldErrors((prev) => ({ ...prev, [name]: null }));
          }
          if (error) setError(null);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!validate()) return;

          setLoading(true);
          setError(null);

          try {
               const response = await login(
                    { phone: formData.phone, password: formData.password },
                    role,
               );

               if (response.ok) {
                    if (response.data?.user) {
                         localStorage.setItem(
                              "user",
                              JSON.stringify(response.data.user),
                         );
                    }
                    navigate.push(`/${role}/dashboard`);
               } else {
                    setError(
                         response.data?.message ||
                              "Invalid phone or password. Please try again.",
                    );
               }
          } catch (err) {
               console.log(err);
               setError("Something went wrong. Please try again later.");
          } finally {
               setLoading(false);
          }
     };

     const inputClasses = (errorField) => `
          w-full pl-12 pr-4 py-4 bg-gray-50/50 border rounded-2xl text-gray-900 
          text-[15px] transition-all duration-300 outline-none focus:bg-white
          ${
               errorField
                    ? "border-red-300 focus:ring-4 focus:ring-red-100 focus:border-red-500"
                    : "border-gray-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 hover:border-gray-300"
          }
     `;

     const iconClasses = (errorField) => `
          absolute left-4 top-[18px] w-5 h-5 transition-colors duration-300
          ${errorField ? "text-red-400" : "text-gray-400 peer-focus:text-orange-500"}
     `;

     return (
          <div className="min-h-screen bg-[#111]/5 flex font-sans selection:bg-orange-100 px-4 sm:px-0">
               <div className="w-140 max-w-3xl my-10 mx-auto bg-white/80 backdrop-blur-[5px] rounded-4xl border border-black/9 shadow-2xl shadow-slate-300/60 p-6 sm:p-10 flex items-center justify-center relative">
                    <div className="w-full max-w-md">
                         <div className="mb-8">
                              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                   Sign in to your account
                              </h2>
                              <p className="text-gray-500 mt-2">
                                   Enter your credentials to access your{" "}
                                   <span className="text-orange-500 font-semibold">
                                        {role.charAt(0).toUpperCase() +
                                             role.slice(1)}{" "}
                                   </span>
                                   dashboard.
                              </p>
                         </div>

                         {/* Error Banner */}
                         {error && (
                              <div className="mb-6 px-4 py-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
                                   <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                   <p className="text-sm text-red-700 font-medium">
                                        {error}
                                   </p>
                              </div>
                         )}

                         {/* Login Form */}
                         <form onSubmit={handleSubmit} className="space-y-5">
                              {/* Phone */}
                              <div className="relative group">
                                   <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone number"
                                        className={`peer ${inputClasses(fieldErrors.phone)}`}
                                   />
                                   <Phone
                                        className={iconClasses(
                                             fieldErrors.phone,
                                        )}
                                   />
                                   {fieldErrors.phone && (
                                        <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                             {fieldErrors.phone}
                                        </p>
                                   )}
                              </div>

                              {/* Password */}
                              <div className="relative group">
                                   <input
                                        type={
                                             showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className={`peer ${inputClasses(fieldErrors.password).replace("pr-4", "pr-12")}`}
                                   />
                                   <Lock
                                        className={iconClasses(
                                             fieldErrors.password,
                                        )}
                                   />
                                   <button
                                        type="button"
                                        onClick={() =>
                                             setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-4.5 text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
                                   >
                                        {showPassword ? (
                                             <EyeOff className="w-5 h-5" />
                                        ) : (
                                             <Eye className="w-5 h-5" />
                                        )}
                                   </button>
                                   {fieldErrors.password && (
                                        <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                             {fieldErrors.password}
                                        </p>
                                   )}
                              </div>

                              {/* Remember & Forgot */}
                              <div className="flex items-center justify-between">
                                   <label className="flex items-center gap-2 cursor-pointer group/check">
                                        <input
                                             type="checkbox"
                                             className="w-4 h-4 rounded-md border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-offset-0 transition-colors cursor-pointer accent-orange-600"
                                        />
                                        <span className="text-sm text-gray-600 group-hover/check:text-gray-900 transition-colors">
                                             Remember me
                                        </span>
                                   </label>
                                   <Link
                                        href="/forgot-password"
                                        className="text-sm font-semibold text-orange-600 hover:text-orange-800 transition-colors"
                                   >
                                        Forgot password?
                                   </Link>
                              </div>

                              {/* Submit */}
                              <button
                                   type="submit"
                                   disabled={loading}
                                   className="w-full py-4 px-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 focus:ring-4 focus:ring-orange-100 hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                              >
                                   {loading ? (
                                        <>
                                             <Loader2 className="w-5 h-5 animate-spin" />
                                             Login in...
                                        </>
                                   ) : (
                                        <>
                                             Login
                                             <ArrowRight className="w-5 h-5" />
                                        </>
                                   )}
                              </button>
                         </form>

                         {/* Divider */}
                         <div className="my-8 flex items-center gap-4">
                              <div className="flex-1 h-px bg-gray-200" />
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                   New here?
                              </span>
                              <div className="flex-1 h-px bg-gray-200" />
                         </div>

                         {/* Register Link */}
                         <Link
                              href={`/${role}/register`}
                              className="w-full py-4 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-700 transition-all duration-300 flex items-center justify-center gap-2"
                         >
                              Create a new account
                              <ArrowRight className="w-4 h-4" />
                         </Link>

                         {/* Footer */}
                         <p className="text-center text-xs text-gray-400 mt-8">
                              By signing in, you agree to our{" "}
                              <span className="text-orange-600 hover:underline cursor-pointer">
                                   Terms of Service
                              </span>{" "}
                              and{" "}
                              <span className="text-orange-600 hover:underline cursor-pointer">
                                   Privacy Policy
                              </span>
                              .
                         </p>
                    </div>
               </div>
          </div>
     );
}
