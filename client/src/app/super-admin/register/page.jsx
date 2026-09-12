"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Register } from "../../../apis/register";

import {
     User,
     Phone,
     Mail,
     Lock,
     Camera,
     ArrowRight,
     ArrowLeft,
     AlertCircle,
     CheckCircle,
     ShieldCheck,
     Eye,
     EyeOff,
     KeyRound,
} from "lucide-react";

import { usePathname } from "next/navigation";

export default function SuperAdminRegister() {
     const [currentStep, setCurrentStep] = useState(1);
     const totalSteps = 4;

     const [formData, setFormData] = useState({
          name: "",
          email: "",
          phone: "",
          photo: "",
          permissions: [
               "manage_distributors",
               "manage_shopkeepers",
               "manage_deliveries",
               "view_analytics",
          ],
          password: "",
          confirmPassword: "",
     });

     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [success, setSuccess] = useState(false);
     const [fieldErrors, setFieldErrors] = useState({});

     const [showPassword, setShowPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

     const roleSet = usePathname().split("/");

     const allowedRole = [
          "super-admin",
          "distributor",
          "deliveryman",
          "shopkeeper",
     ];

     const role = roleSet
          .filter((item) => allowedRole.includes(item))
          .toString();

     const availablePermissions = [
          {
               value: "manage_distributors",
               label: "Manage Distributors",
               description: "Create, update and manage distributors",
          },
          {
               value: "manage_shopkeepers",
               label: "Manage Shopkeepers",
               description: "Manage shopkeeper accounts and information",
          },
          {
               value: "manage_deliveries",
               label: "Manage Deliveries",
               description: "Manage delivery men and deliveries",
          },
          {
               value: "view_analytics",
               label: "View Analytics",
               description: "View system analytics and reports",
          },
     ];

     const validateStep = (step) => {
          const errors = {};

          if (step === 1) {
               if (!formData.name || formData.name.trim().length < 2) {
                    errors.name = "Name must be at least 2 characters.";
               }

               if (
                    !formData.email ||
                    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                         formData.email,
                    )
               ) {
                    errors.email = "Please provide a valid email address.";
               }

               if (
                    !formData.phone ||
                    !/^(\+8801|01)[3-9]\d{8}$/.test(formData.phone)
               ) {
                    errors.phone =
                         "Please provide a valid Bangladeshi phone number.";
               }
          }

          if (step === 2) {
               /*
                * Photo is optional according to schema,
                * so no validation is required.
                */
          }

          if (step === 3) {
               if (!formData.permissions || formData.permissions.length === 0) {
                    errors.permissions = "At least one permission is required.";
               }
          }

          if (step === 4) {
               if (!formData.password || formData.password.length < 8) {
                    errors.password = "Password must be at least 8 characters.";
               }

               if (
                    !formData.confirmPassword ||
                    formData.password !== formData.confirmPassword
               ) {
                    errors.confirmPassword = "Passwords do not match.";
               }
          }

          setFieldErrors(errors);

          return Object.keys(errors).length === 0;
     };

     const nextStep = () => {
          if (validateStep(currentStep)) {
               setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
          }
     };

     const prevStep = () => {
          setCurrentStep((prev) => Math.max(prev - 1, 1));
     };

     const handleChange = (e) => {
          const { name, value } = e.target;

          setFormData((prev) => ({
               ...prev,
               [name]: value,
          }));

          if (fieldErrors[name]) {
               setFieldErrors((prev) => ({
                    ...prev,
                    [name]: null,
               }));
          }
     };

     const handlePermissionChange = (permission) => {
          setFormData((prev) => {
               const exists = prev.permissions.includes(permission);

               return {
                    ...prev,
                    permissions: exists
                         ? prev.permissions.filter(
                                (item) => item !== permission,
                           )
                         : [...prev.permissions, permission],
               };
          });

          if (fieldErrors.permissions) {
               setFieldErrors((prev) => ({
                    ...prev,
                    permissions: null,
               }));
          }
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (currentStep !== totalSteps) return;

          if (!validateStep(4)) return;

          setLoading(true);
          setError(null);

          try {
               const credentials = {
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phone: formData.phone.trim(),

                    photo: formData.photo.trim(),

                    permissions: formData.permissions,

                    password: formData.password,

                    role: "super-admin",
               };

               const response = await Register(credentials, "admin");

               if (response.ok) {
                    setSuccess(true);
               } else {
                    setError(
                         response.data?.message ||
                              "Registration failed. Please try again.",
                    );
               }
          } catch (err) {
               console.error(err);

               setError("An unexpected error occurred. Please try again.");
          } finally {
               setLoading(false);
          }
     };

     const inputClasses = (errorField) => `
          w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border rounded-2xl text-gray-900
          transition-all duration-300 outline-none focus:bg-white
          ${
               errorField
                    ? "border-red-300 focus:ring-4 focus:ring-red-100 focus:border-red-500"
                    : "border-gray-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 hover:border-gray-300"
          }
     `;

     const iconClasses = (errorField) => `
          absolute left-4 top-[17px] w-5 h-5 transition-colors duration-300
          ${
               errorField
                    ? "text-red-400"
                    : "text-gray-400 peer-focus:text-orange-500"
          }
     `;

     if (success) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-4xl shadow-2xl p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
                         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <CheckCircle className="w-10 h-10 text-green-600" />
                         </div>

                         <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                              Welcome Aboard!
                         </h2>

                         <p className="text-gray-500 mb-8">
                              Your Super Admin account has been created
                              successfully. You can now log in to your
                              dashboard.
                         </p>

                         <Link
                              href={`/${role}/auth/login`}
                              className="block w-full py-4 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-orange-200"
                         >
                              Go to Login
                         </Link>
                    </div>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-[#111]/5 flex font-sans selection:bg-orange-100">
               <div className="w-160 max-w-3xl my-10 mx-auto bg-white/80 backdrop-blur-[5px] rounded-4xl border border-black/9 shadow-2xl shadow-slate-300/60 p-6 sm:p-10 flex items-center justify-center relative">
                    <div className="w-full max-w-lg">
                         {/* Header */}
                         <div className="flex items-center gap-3 mb-10">
                              <span className="text-gray-900 text-2xl font-bold tracking-tight">
                                   Register as Super Admin
                              </span>
                         </div>

                         {/* Stepper */}
                         <div className="mb-10">
                              <div className="flex items-start">
                                   {[
                                        {
                                             step: 1,
                                             label: "Personal",
                                        },
                                        {
                                             step: 2,
                                             label: "Profile",
                                        },
                                        {
                                             step: 3,
                                             label: "Permissions",
                                        },
                                        {
                                             step: 4,
                                             label: "Security",
                                        },
                                   ].map(({ step, label }) => (
                                        <div
                                             key={step}
                                             className="flex items-center grow last:flex-none"
                                        >
                                             <div className="flex flex-col items-center">
                                                  <div
                                                       className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                                            currentStep === step
                                                                 ? "bg-orange-600 text-white shadow-lg shadow-orange-200 ring-4 ring-orange-50"
                                                                 : currentStep >
                                                                     step
                                                                   ? "bg-orange-100 text-orange-600"
                                                                   : "bg-gray-100 text-gray-400"
                                                       }`}
                                                  >
                                                       {currentStep > step ? (
                                                            <CheckCircle className="w-4 h-4" />
                                                       ) : (
                                                            step
                                                       )}
                                                  </div>

                                                  <span
                                                       className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                                                            currentStep === step
                                                                 ? "text-orange-600"
                                                                 : currentStep >
                                                                     step
                                                                   ? "text-orange-400"
                                                                   : "text-gray-400"
                                                       }`}
                                                  >
                                                       {label}
                                                  </span>
                                             </div>

                                             {step < 4 && (
                                                  <div
                                                       className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-300 mb-6 ${
                                                            currentStep > step
                                                                 ? "bg-orange-600"
                                                                 : "bg-gray-100"
                                                       }`}
                                                  />
                                             )}
                                        </div>
                                   ))}
                              </div>
                         </div>

                         {/* Heading */}
                         <div className="mb-8">
                              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                   {currentStep === 1 && "Personal Information"}

                                   {currentStep === 2 && "Profile Information"}

                                   {currentStep === 3 && "Admin Permissions"}

                                   {currentStep === 4 && "Secure your account"}
                              </h2>

                              <p className="text-gray-500 mt-2">
                                   {currentStep === 1 &&
                                        "Let's start with your basic details."}

                                   {currentStep === 2 &&
                                        "Add a profile photo for your admin account."}

                                   {currentStep === 3 &&
                                        "Choose what this Super Admin can manage."}

                                   {currentStep === 4 &&
                                        "Create a strong password to protect your account."}
                              </p>
                         </div>

                         {/* Error Message */}
                         {error && (
                              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in">
                                   <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />

                                   <p className="text-red-700 text-sm font-medium">
                                        {error}
                                   </p>
                              </div>
                         )}

                         <form onSubmit={handleSubmit} className="space-y-5">
                              {/* =================================================
                                   STEP 1: PERSONAL
                              ================================================== */}

                              <div
                                   className={
                                        currentStep === 1
                                             ? "block space-y-5 animate-in slide-in-from-right-4 fade-in duration-300"
                                             : "hidden"
                                   }
                              >
                                   {/* Name */}
                                   <div className="relative group">
                                        <input
                                             type="text"
                                             name="name"
                                             value={formData.name}
                                             onChange={handleChange}
                                             placeholder="Super Admin Name"
                                             className={`peer ${inputClasses(
                                                  fieldErrors.name,
                                             )}`}
                                        />

                                        <User
                                             className={iconClasses(
                                                  fieldErrors.name,
                                             )}
                                        />

                                        {fieldErrors.name && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.name}
                                             </p>
                                        )}
                                   </div>

                                   {/* Email */}
                                   <div className="relative group">
                                        <input
                                             type="email"
                                             name="email"
                                             value={formData.email}
                                             onChange={handleChange}
                                             placeholder="Email Address"
                                             className={`peer ${inputClasses(
                                                  fieldErrors.email,
                                             )}`}
                                        />

                                        <Mail
                                             className={iconClasses(
                                                  fieldErrors.email,
                                             )}
                                        />

                                        {fieldErrors.email && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.email}
                                             </p>
                                        )}
                                   </div>

                                   {/* Phone */}
                                   <div className="relative group">
                                        <input
                                             type="tel"
                                             name="phone"
                                             value={formData.phone}
                                             onChange={handleChange}
                                             placeholder="Phone Number (e.g. +8801...)"
                                             className={`peer ${inputClasses(
                                                  fieldErrors.phone,
                                             )}`}
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
                              </div>

                              {/* =================================================
                                   STEP 2: PROFILE
                              ================================================== */}

                              <div
                                   className={
                                        currentStep === 2
                                             ? "block space-y-5 animate-in slide-in-from-right-4 fade-in duration-300"
                                             : "hidden"
                                   }
                              >
                                   {/* Photo URL */}
                                   <div className="relative group">
                                        <input
                                             type="url"
                                             name="photo"
                                             value={formData.photo}
                                             onChange={handleChange}
                                             placeholder="Profile Photo URL (Optional)"
                                             className={`peer ${inputClasses(
                                                  null,
                                             )}`}
                                        />

                                        <Camera className={iconClasses(null)} />
                                   </div>

                                   <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
                                        <div className="flex gap-3">
                                             <Camera className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />

                                             <div>
                                                  <p className="text-sm font-semibold text-orange-800">
                                                       Profile Photo
                                                  </p>

                                                  <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                                                       You can provide a profile
                                                       image URL. This field is
                                                       optional and can be added
                                                       later from your
                                                       dashboard.
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* =================================================
                                   STEP 3: PERMISSIONS
                              ================================================== */}

                              <div
                                   className={
                                        currentStep === 3
                                             ? "block space-y-3 animate-in slide-in-from-right-4 fade-in duration-300"
                                             : "hidden"
                                   }
                              >
                                   <div className="flex items-center gap-2 mb-3">
                                        <KeyRound className="w-5 h-5 text-orange-500" />

                                        <p className="text-sm font-semibold text-gray-700">
                                             Select Admin Permissions
                                        </p>
                                   </div>

                                   {availablePermissions.map((permission) => {
                                        const isSelected =
                                             formData.permissions.includes(
                                                  permission.value,
                                             );

                                        return (
                                             <button
                                                  type="button"
                                                  key={permission.value}
                                                  onClick={() =>
                                                       handlePermissionChange(
                                                            permission.value,
                                                       )
                                                  }
                                                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                                                       isSelected
                                                            ? "border-orange-300 bg-orange-50 ring-2 ring-orange-100"
                                                            : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white"
                                                  }`}
                                             >
                                                  <div className="flex items-start gap-3">
                                                       <div
                                                            className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                                                                 isSelected
                                                                      ? "bg-orange-600 border-orange-600"
                                                                      : "border-gray-300 bg-white"
                                                            }`}
                                                       >
                                                            {isSelected && (
                                                                 <CheckCircle className="w-3.5 h-3.5 text-white" />
                                                            )}
                                                       </div>

                                                       <div>
                                                            <p
                                                                 className={`text-sm font-semibold ${
                                                                      isSelected
                                                                           ? "text-orange-700"
                                                                           : "text-gray-700"
                                                                 }`}
                                                            >
                                                                 {
                                                                      permission.label
                                                                 }
                                                            </p>

                                                            <p className="text-xs text-gray-500 mt-1">
                                                                 {
                                                                      permission.description
                                                                 }
                                                            </p>
                                                       </div>
                                                  </div>
                                             </button>
                                        );
                                   })}

                                   {fieldErrors.permissions && (
                                        <p className="mt-2 text-xs text-red-500 font-medium ml-2">
                                             {fieldErrors.permissions}
                                        </p>
                                   )}
                              </div>

                              {/* =================================================
                                   STEP 4: SECURITY
                              ================================================== */}

                              <div
                                   className={
                                        currentStep === 4
                                             ? "block space-y-5 animate-in slide-in-from-right-4 fade-in duration-300"
                                             : "hidden"
                                   }
                              >
                                   {/* Password */}
                                   <div className="relative group">
                                        <input
                                             type={
                                                  showPassword
                                                       ? "text"
                                                       : "password"
                                             }
                                             name="password"
                                             value={formData.password}
                                             onChange={handleChange}
                                             placeholder="Password (min 8 chars)"
                                             className={`peer ${inputClasses(
                                                  fieldErrors.password,
                                             ).replace("pr-4", "pr-12")}`}
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
                                             className="absolute right-4 top-4.25 text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
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

                                   {/* Confirm Password */}
                                   <div className="relative group">
                                        <input
                                             type={
                                                  showConfirmPassword
                                                       ? "text"
                                                       : "password"
                                             }
                                             name="confirmPassword"
                                             value={formData.confirmPassword}
                                             onChange={handleChange}
                                             placeholder="Confirm Password"
                                             className={`peer ${inputClasses(
                                                  fieldErrors.confirmPassword,
                                             ).replace("pr-4", "pr-12")}`}
                                        />

                                        <ShieldCheck
                                             className={iconClasses(
                                                  fieldErrors.confirmPassword,
                                             )}
                                        />

                                        <button
                                             type="button"
                                             onClick={() =>
                                                  setShowConfirmPassword(
                                                       !showConfirmPassword,
                                                  )
                                             }
                                             className="absolute right-4 top-4.25 text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
                                        >
                                             {showConfirmPassword ? (
                                                  <EyeOff className="w-5 h-5" />
                                             ) : (
                                                  <Eye className="w-5 h-5" />
                                             )}
                                        </button>

                                        {fieldErrors.confirmPassword && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.confirmPassword}
                                             </p>
                                        )}
                                   </div>

                                   {/* Security Info */}
                                   <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                                        <div className="flex gap-3">
                                             <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />

                                             <div>
                                                  <p className="text-sm font-semibold text-orange-800">
                                                       Keep your password secure
                                                  </p>

                                                  <p className="text-xs text-orange-700 mt-1">
                                                       Use at least 8 characters
                                                       and avoid using easily
                                                       guessable information.
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* =================================================
                                   NAVIGATION BUTTONS
                              ================================================== */}

                              <div className="flex gap-4 pt-6">
                                   {currentStep > 1 && (
                                        <button
                                             type="button"
                                             onClick={prevStep}
                                             className="flex-1 py-4 px-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                             <ArrowLeft className="w-5 h-5" />
                                             Back
                                        </button>
                                   )}

                                   {currentStep < totalSteps ? (
                                        <button
                                             type="button"
                                             onClick={nextStep}
                                             className="flex-2 py-4 px-4 bg-orange-600 cursor-pointer text-white rounded-2xl font-bold hover:bg-orange-700 focus:ring-4 focus:ring-orange-100 hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                             Continue
                                             <ArrowRight className="w-5 h-5" />
                                        </button>
                                   ) : (
                                        <button
                                             type="submit"
                                             disabled={loading}
                                             className="flex-2 py-4 px-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 focus:ring-4 focus:ring-orange-100 hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                             {loading ? (
                                                  <>
                                                       <svg
                                                            className="animate-spin h-5 w-5 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                       >
                                                            <circle
                                                                 className="opacity-25"
                                                                 cx="12"
                                                                 cy="12"
                                                                 r="10"
                                                                 stroke="currentColor"
                                                                 strokeWidth="4"
                                                            />

                                                            <path
                                                                 className="opacity-75"
                                                                 fill="currentColor"
                                                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                            />
                                                       </svg>
                                                       Processing
                                                  </>
                                             ) : (
                                                  <>
                                                       <CheckCircle className="w-5 h-5" />
                                                       Create Account
                                                  </>
                                             )}
                                        </button>
                                   )}
                              </div>
                         </form>

                         {/* Login Link */}
                         <div className="mt-10 text-center">
                              <p className="text-gray-500">
                                   Already have an account?{" "}
                                   <Link
                                        href={`/${role}/auth/login`}
                                        className="font-semibold text-orange-600 hover:text-orange-500 hover:underline underline-offset-4 transition-all"
                                   >
                                        Login to dashboard
                                   </Link>
                              </p>
                         </div>
                    </div>
               </div>
          </div>
     );
}
