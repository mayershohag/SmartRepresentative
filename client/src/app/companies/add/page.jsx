"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
     Building2,
     Phone,
     Mail,
     Globe,
     FileText,
     Image as ImageIcon,
     ArrowLeft,
     CheckCircle2,
     AlertCircle,
     Activity,
     Loader2,
} from "lucide-react";
import { addCompany } from "@/apis/addCompany";

export default function AddCompany() {
     const router = useRouter();
     const [formData, setFormData] = useState({
          name: "",
          logo: "",
          description: "",
          website: "",
          phone: "",
          email: "",
          isActive: "active",
     });

     // Validation errors state
     const [errors, setErrors] = useState({});
     const [touched, setTouched] = useState({});

     // Request and response state
     const [loading, setLoading] = useState(false);
     const [apiError, setApiError] = useState("");
     const [success, setSuccess] = useState(false);
     const [countdown, setCountdown] = useState(3);

     // Handle input change
     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
          if (apiError) setApiError("");
          if (touched[name]) {
               validateField(name, value);
          }
     };

     // Handle blur validation
     const handleBlur = (e) => {
          const { name, value } = e.target;
          setTouched((prev) => ({ ...prev, [name]: true }));
          validateField(name, value);
     };

     // Individual field validation
     const validateField = (name, value) => {
          let errorMsg = "";

          if (name === "name") {
               if (!value.trim()) {
                    errorMsg = "Company name is required";
               }
          }

          if (name === "phone") {
               if (!value.trim()) {
                    errorMsg = "Phone number is required";
               } else {
                    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
                    if (!phoneRegex.test(value.trim())) {
                         errorMsg =
                              "Please enter a valid phone number (10-15 digits)";
                    }
               }
          }

          if (name === "email" && value.trim()) {
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               if (!emailRegex.test(value.trim())) {
                    errorMsg = "Please enter a valid email address";
               }
          }

          if (name === "website" && value.trim()) {
               const urlRegex =
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
               if (!urlRegex.test(value.trim())) {
                    errorMsg =
                         "Please enter a valid URL (e.g. https://example.com)";
               }
          }

          setErrors((prev) => ({ ...prev, [name]: errorMsg }));
          return errorMsg;
     };

     // Validate all fields before submission
     const validateAll = () => {
          const newErrors = {};

          // Name validation
          if (!formData.name.trim()) {
               newErrors.name = "Company name is required";
          }

          // Phone validation
          if (!formData.phone.trim()) {
               newErrors.phone = "Phone number is required";
          } else {
               const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
               if (!phoneRegex.test(formData.phone.trim())) {
                    newErrors.phone =
                         "Please enter a valid phone number (10-15 digits)";
               }
          }

          // Email validation
          if (formData.email.trim()) {
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               if (!emailRegex.test(formData.email.trim())) {
                    newErrors.email = "Please enter a valid email address";
               }
          }

          // Website validation
          if (formData.website.trim()) {
               const urlRegex =
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
               if (!urlRegex.test(formData.website.trim())) {
                    newErrors.website =
                         "Please enter a valid URL (e.g. https://example.com)";
               }
          }

          setErrors(newErrors);

          // Set all fields to touched so errors render
          const touchedFields = {};
          Object.keys(formData).forEach((key) => {
               touchedFields[key] = true;
          });
          setTouched(touchedFields);

          return Object.keys(newErrors).length === 0;
     };

     useEffect(() => {
          let timer;
          if (success && countdown > 0) {
               timer = setTimeout(() => {
                    setCountdown((c) => c - 1);
               }, 1000);
          } else if (success && countdown === 0) {
               router.push("/companies");
          }
          return () => clearTimeout(timer);
     }, [success, countdown, router]);

     const handleSubmit = async (e) => {
          e.preventDefault();
          setApiError("");

          if (!validateAll()) {
               return;
          }
          setLoading(true);
          try {
               const payload = {
                    name: formData.name.trim(),
                    logo: formData.logo.trim(),
                    description: formData.description.trim(),
                    website: formData.website.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim(),
                    isActive: formData.isActive,
               };
               console.log(payload);

               const response = await addCompany(payload);

               if (response.success || response.data?.success) {
                    setSuccess(true);
               } else {
                    const errorMsg =
                         response.data?.message ||
                         "Failed to create company. Please check your data.";
                    setApiError(errorMsg);

                    if (errorMsg.toLowerCase().includes("exists")) {
                         if (
                              errorMsg.toLowerCase().includes("company") ||
                              errorMsg.toLowerCase().includes("name")
                         ) {
                              setErrors((prev) => ({
                                   ...prev,
                                   name: "This company name is already registered",
                              }));
                         } else if (errorMsg.toLowerCase().includes("phone")) {
                              setErrors((prev) => ({
                                   ...prev,
                                   phone: "This phone number is already registered",
                              }));
                         } else if (errorMsg.toLowerCase().includes("email")) {
                              setErrors((prev) => ({
                                   ...prev,
                                   email: "This email address is already registered",
                              }));
                         }
                    }
               }
          } catch (err) {
               setApiError(
                    "A network error occurred. Please verify you are logged in and try again.",
               );
          } finally {
               setLoading(false);
          }
     };

     // Image preview helper state
     const [imgValid, setImgValid] = useState(false);
     useEffect(() => {
          if (!formData.logo.trim()) {
               return;
          }
          const img = new Image();
          img.src = formData.logo;
          img.onload = () => setImgValid(true);
          img.onerror = () => setImgValid(false);
     }, [formData.logo]);

     return (
          <main className="relative flex-1 px-6 pb-8 min-h-screen">
               <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div
                         className="absolute right-1/4 top-1/4 h-72 w-72 rounded-full opacity-10 blur-3xl"
                         style={{ background: "var(--thread-pink)" }}
                    />
                    <div
                         className="absolute left-1/3 bottom-1/4 h-80 w-80 rounded-full opacity-10 blur-3xl"
                         style={{ background: "var(--thread-blue)" }}
                    />
               </div>

               {/* Back button and page title */}
               <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                         <Link
                              href="/companies"
                              className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                              style={{
                                   background: "var(--glass-fill-hover)",
                                   borderColor: "var(--glass-border-strong)",
                              }}
                              title="Back to list"
                         >
                              <ArrowLeft
                                   size={18}
                                   className="text-(--text-secondary) hover:text-(--text-primary)"
                              />
                         </Link>
                         <div>
                              <h2 className="font-display text-[22px] font-bold text-(--text-primary) leading-tight">
                                   Add Collaborated Company
                              </h2>
                              <p className="text-[12.5px] text-(--text-tertiary)">
                                   Register a new brand or supplier in your
                                   distribution network
                              </p>
                         </div>
                    </div>
               </div>

               <AnimatePresence mode="wait">
                    {success ? (
                         <motion.div
                              key="success-card"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.3 }}
                              className="glass-panel mx-auto max-w-xl rounded-3xl p-8 text-center shadow-2xl"
                              style={{ background: "rgba(21, 15, 38, 0.85)" }}
                         >
                              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--ok-bg) border border-(--ok)/20">
                                   <CheckCircle2
                                        size={36}
                                        className="text-(--ok)"
                                   />
                              </div>
                              <h3 className="font-display text-2xl font-bold text-(--text-primary)">
                                   Company Created!
                              </h3>
                              <p className="mt-3 text-[14px] text-(--text-secondary)">
                                   <strong>{formData.name}</strong> has been
                                   successfully added to your catalog database.
                              </p>
                              <p className="mt-6 text-[12.5px] text-(--text-tertiary)">
                                   Redirecting to all companies list in{" "}
                                   <span className="font-mono font-bold text-(--thread-pink)">
                                        {countdown}
                                   </span>{" "}
                                   seconds...
                              </p>

                              <div className="mt-8 flex justify-center gap-4">
                                   <Link
                                        href="/companies"
                                        className="rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                                        style={{ background: "var(--thread)" }}
                                   >
                                        Go to List Now
                                   </Link>
                                   <button
                                        onClick={() => {
                                             setSuccess(false);
                                             setCountdown(3);
                                             setFormData({
                                                  name: "",
                                                  logo: "",
                                                  description: "",
                                                  website: "",
                                                  phone: "",
                                                  email: "",
                                                  isActive: "active",
                                             });
                                             setErrors({});
                                             setTouched({});
                                        }}
                                        className="glass-panel rounded-xl px-5 py-2.5 text-[13px] font-semibold text-(--text-secondary) hover:text-(--text-primary) hover:bg-white/5 transition-colors"
                                   >
                                        Add Another
                                   </button>
                              </div>
                         </motion.div>
                    ) : (
                         <motion.div
                              key="form-card"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -15 }}
                              transition={{ duration: 0.3 }}
                              className="glass-panel mx-auto max-w-4xl rounded-3xl p-6 md:p-8 shadow-2xl"
                         >
                              {apiError && (
                                   <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mb-6 flex items-start gap-3 rounded-xl border border-(--danger)/20 bg-(--danger-bg) p-4 text-[13.5px] text-(--danger)"
                                   >
                                        <AlertCircle
                                             size={18}
                                             className="shrink-0 mt-0.5"
                                        />
                                        <div className="flex-1">
                                             <span className="font-semibold">
                                                  Creation Error:
                                             </span>{" "}
                                             {apiError}
                                        </div>
                                   </motion.div>
                              )}

                              <form
                                   onSubmit={handleSubmit}
                                   method="POST"
                                   className="space-y-6"
                              >
                                   <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Left column: Core details */}
                                        <div className="space-y-5">
                                             <div
                                                  className="border-b pb-2 mb-3"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                  }}
                                             >
                                                  <h4 className="text-[14px] font-semibold text-(--text-primary) flex items-center gap-2">
                                                       <Building2
                                                            size={16}
                                                            className="text-(--thread-pink)"
                                                       />
                                                       Basic Profile
                                                  </h4>
                                             </div>

                                             {/* Company Name */}
                                             <div>
                                                  <label
                                                       htmlFor="name"
                                                       className="block text-[12.5px] font-medium text-(--text-secondary) mb-2"
                                                  >
                                                       Company Name{" "}
                                                       <span className="text-(--danger)">
                                                            *
                                                       </span>
                                                  </label>
                                                  <div className="relative">
                                                       <input
                                                            type="text"
                                                            id="name"
                                                            name="name"
                                                            value={
                                                                 formData.name
                                                            }
                                                            onChange={
                                                                 handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            placeholder="e.g. ACI Foods Ltd."
                                                            disabled={loading}
                                                            className={`w-full rounded-xl bg-white/3 px-4 py-2.5 text-[13.5px] text-(--text-primary) outline-none border transition-all duration-200 ${
                                                                 touched.name &&
                                                                 errors.name
                                                                      ? " focus:border-(--danger) focus:ring-1 focus:ring-(--danger)"
                                                                      : "focus:border-(--thread-violet) focus:ring-1 focus:ring-(--thread-violet)"
                                                            }`}
                                                       />
                                                  </div>
                                                  <AnimatePresence>
                                                       {touched.name &&
                                                            errors.name && (
                                                                 <motion.p
                                                                      initial={{
                                                                           opacity: 0,
                                                                           height: 0,
                                                                      }}
                                                                      animate={{
                                                                           opacity: 1,
                                                                           height: "auto",
                                                                      }}
                                                                      exit={{
                                                                           opacity: 0,
                                                                           height: 0,
                                                                      }}
                                                                      className="mt-1.5 text-[11.5px] text-(--danger) flex items-center gap-1.5"
                                                                 >
                                                                      <AlertCircle
                                                                           size={
                                                                                12
                                                                           }
                                                                      />
                                                                      {
                                                                           errors.name
                                                                      }
                                                                 </motion.p>
                                                            )}
                                                  </AnimatePresence>
                                             </div>

                                             {/* Logo URL */}
                                             <div>
                                                  <label
                                                       htmlFor="logo"
                                                       className="block text-[12.5px] font-medium text-(--text-secondary) mb-2"
                                                  >
                                                       Logo Image URL
                                                  </label>
                                                  <div className="flex gap-3 items-start">
                                                       <div className="relative flex-1">
                                                            <input
                                                                 type="text"
                                                                 id="logo"
                                                                 name="logo"
                                                                 value={
                                                                      formData.logo
                                                                 }
                                                                 onChange={
                                                                      handleChange
                                                                 }
                                                                 onBlur={
                                                                      handleBlur
                                                                 }
                                                                 placeholder="https://example.com/logo.png"
                                                                 disabled={
                                                                      loading
                                                                 }
                                                                 className={`w-full rounded-xl bg-white/3 px-4 py-2.5 text-[13.5px] text-(--text-primary) outline-none border border-(--glass-border) focus:ring-1 focus:ring-(--thread-violet) transition-all duration-200`}
                                                            />
                                                       </div>
                                                       {/* Mini live logo preview */}
                                                       <div
                                                            className="glass-panel flex h-10.25 w-10.25 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                                                            style={{
                                                                 background:
                                                                      "rgba(255, 255, 255, 0.02)",
                                                                 borderColor:
                                                                      "var(--glass-border)",
                                                            }}
                                                       >
                                                            {imgValid ? (
                                                                 // eslint-disable-next-line @next/next/no-img-element
                                                                 <img
                                                                      src={
                                                                           formData.logo
                                                                      }
                                                                      alt="Preview"
                                                                      className="h-full w-full object-contain p-1"
                                                                 />
                                                            ) : (
                                                                 <ImageIcon
                                                                      size={16}
                                                                      className="text-(--text-tertiary)"
                                                                 />
                                                            )}
                                                       </div>
                                                  </div>
                                                  <p className="mt-1 text-[11px] text-(--text-tertiary)">
                                                       Provide a web URL to the
                                                       {` brand's`} logo image
                                                       (.svg, .png, .jpg)
                                                  </p>
                                             </div>

                                             {/* Description */}
                                             <div>
                                                  <label
                                                       htmlFor="description"
                                                       className="block text-[12.5px] font-medium text-(--text-secondary) mb-2"
                                                  >
                                                       Description
                                                  </label>
                                                  <div className="relative">
                                                       <textarea
                                                            id="description"
                                                            name="description"
                                                            value={
                                                                 formData.description
                                                            }
                                                            onChange={
                                                                 handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            rows={4}
                                                            placeholder="Brief details about the company, main supplier contacts, catalog details..."
                                                            disabled={loading}
                                                            className="w-full rounded-xl bg-white/3 px-4 py-2.5 text-[13.5px] text-(--text-primary) outline-none border border-(--glass-border) focus:ring-1 focus:ring-(--thread-violet) transition-all duration-200 resize-none"
                                                       />
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Right column: Contacts & Status */}
                                        <div className="space-y-5">
                                             <div
                                                  className="border-b pb-2 mb-3"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                  }}
                                             >
                                                  <h4 className="text-[14px] font-semibold text-(--text-primary) flex items-center gap-2">
                                                       <Phone
                                                            size={16}
                                                            className="text-(--thread-pink)"
                                                       />
                                                       Contact & Status
                                                  </h4>
                                             </div>

                                             {/* Phone */}
                                             <div>
                                                  <label
                                                       htmlFor="phone"
                                                       className="block text-[12.5px] font-medium text-(--text-secondary) mb-2"
                                                  >
                                                       Phone Number{" "}
                                                       <span className="text-(--danger)">
                                                            *
                                                       </span>
                                                  </label>
                                                  <div className="relative">
                                                       <input
                                                            type="text"
                                                            id="phone"
                                                            name="phone"
                                                            value={
                                                                 formData.phone
                                                            }
                                                            onChange={
                                                                 handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            placeholder="e.g. +8801712345678"
                                                            disabled={loading}
                                                            className={`w-full rounded-xl bg-white/3 px-4 py-2.5 text-[13.5px] text-(--text-primary) outline-none border transition-all duration-200 ${
                                                                 touched.phone &&
                                                                 errors.phone
                                                                      ? "border-(--danger)  focus:ring-1 focus:ring-(--danger)"
                                                                      : "border-(--glass-border) focus:ring-1 focus:ring-(--thread-violet)"
                                                            }`}
                                                       />
                                                  </div>
                                                  <AnimatePresence>
                                                       {touched.phone &&
                                                            errors.phone && (
                                                                 <motion.p
                                                                      initial={{
                                                                           opacity: 0,
                                                                           height: 0,
                                                                      }}
                                                                      animate={{
                                                                           opacity: 1,
                                                                           height: "auto",
                                                                      }}
                                                                      exit={{
                                                                           opacity: 0,
                                                                           height: 0,
                                                                      }}
                                                                      className="mt-1.5 text-[11.5px] text-(--danger) flex items-center gap-1.5"
                                                                 >
                                                                      <AlertCircle
                                                                           size={
                                                                                12
                                                                           }
                                                                      />
                                                                      {
                                                                           errors.phone
                                                                      }
                                                                 </motion.p>
                                                            )}
                                                  </AnimatePresence>
                                             </div>

                                             {/* Email */}
                                             <div>
                                                  <label
                                                       htmlFor="email"
                                                       className="block text-[12.5px] font-medium text-(--text-secondary) mb-2"
                                                  >
                                                       Email Address
                                                  </label>
                                                  <div className="relative">
                                                       <input
                                                            type="text"
                                                            id="email"
                                                            name="email"
                                                            value={
                                                                 formData.email
                                                            }
                                                            onChange={
                                                                 handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            placeholder="supplier@company.com"
                                                            disabled={loading}
                                                            className={`w-full rounded-xl bg-white/3 px-4 py-2.5 text-[13.5px] text-(--text-primary) outline-none border transition-all duration-200 ${
                                                                 touched.email &&
                                                                 errors.email
                                                                      ? "border-(--danger) focus:ring-1 focus:ring-(--danger)"
                                                                      : "border-(--glass-border) focus:ring-1 focus:ring-(--thread-violet)"
                                                            }`}
                                                       />
                                                  </div>
                                                  <AnimatePresence>
                                                       {touched.email &&
                                                            errors.email && (
                                                                 <motion.p
                                                                      initial={{
                                                                           opacity: 0,
                                                                           height: 0,
                                                                      }}
                                                                      animate={{
                                                                           opacity: 1,
                                                                           height: "auto",
                                                                      }}
                                                                      exit={{
                                                                           opacity: 0,
                                                                           height: 0,
                                                                      }}
                                                                      className="mt-1.5 text-[11.5px] text-(--danger) flex items-center gap-1.5"
                                                                 >
                                                                      <AlertCircle
                                                                           size={
                                                                                12
                                                                           }
                                                                      />
                                                                      {
                                                                           errors.email
                                                                      }
                                                                 </motion.p>
                                                            )}
                                                  </AnimatePresence>
                                             </div>

                                             {/* Website */}
                                             <div>
                                                  <label
                                                       htmlFor="website"
                                                       className="block text-[12.5px] font-medium text-(--text-secondary) mb-2"
                                                  >
                                                       Website URL
                                                  </label>
                                                  <div className="relative">
                                                       <input
                                                            type="text"
                                                            id="website"
                                                            name="website"
                                                            value={
                                                                 formData.website
                                                            }
                                                            onChange={
                                                                 handleChange
                                                            }
                                                            onBlur={handleBlur}
                                                            placeholder="https://www.company.com"
                                                            disabled={loading}
                                                            className={`w-full rounded-xl bg-white/3 px-4 py-2.5 text-[13.5px] text-(--text-primary) outline-none border transition-all duration-200 ${
                                                                 touched.website &&
                                                                 errors.website
                                                                      ? "border-(--danger) focus:ring-1 focus:ring-(--danger)"
                                                                      : "border-(--glass-border) focus:ring-1 focus:ring-(--thread-violet)"
                                                            }`}
                                                       />
                                                  </div>
                                                  <AnimatePresence>
                                                       {touched.website &&
                                                            errors.website && (
                                                                 <motion.p
                                                                      initial={{
                                                                           opacity: 0,
                                                                           height: 0,
                                                                      }}
                                                                      animate={{
                                                                           opacity: 1,
                                                                           height: "auto",
                                                                      }}
                                                                      exit={{
                                                                           opacity: 0,
                                                                           height: 0,
                                                                      }}
                                                                      className="mt-1.5 text-[11.5px] text-(--danger) flex items-center gap-1.5"
                                                                 >
                                                                      <AlertCircle
                                                                           size={
                                                                                12
                                                                           }
                                                                      />
                                                                      {
                                                                           errors.website
                                                                      }
                                                                 </motion.p>
                                                            )}
                                                  </AnimatePresence>
                                             </div>

                                             {/* Active Status Toggle */}
                                             <div>
                                                  <label className="block text-[12.5px] font-medium text-(--text-secondary) mb-2.5">
                                                       Collaboration Status
                                                  </label>
                                                  <div
                                                       className="glass-panel relative flex w-full gap-1 rounded-xl p-1"
                                                       style={{
                                                            background:
                                                                 "rgba(255, 255, 255, 0.02)",
                                                            borderColor:
                                                                 "var(--glass-border)",
                                                       }}
                                                  >
                                                       {/* Active Option */}
                                                       <button
                                                            type="button"
                                                            onClick={() =>
                                                                 !loading &&
                                                                 setFormData(
                                                                      (
                                                                           prev,
                                                                      ) => ({
                                                                           ...prev,
                                                                           isActive:
                                                                                "active",
                                                                      }),
                                                                 )
                                                            }
                                                            className="relative flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-semibold transition-all duration-200 cursor-pointer"
                                                            style={{
                                                                 color:
                                                                      formData.isActive ===
                                                                      "active"
                                                                           ? "#FFFFFF"
                                                                           : "var(--text-secondary)",
                                                                 background:
                                                                      formData.isActive ===
                                                                      "active"
                                                                           ? "var(--thread-soft)"
                                                                           : "transparent",
                                                                 border:
                                                                      formData.isActive ===
                                                                      "active"
                                                                           ? "1px solid var(--glass-border-strong)"
                                                                           : "1px solid transparent",
                                                            }}
                                                       >
                                                            <Activity
                                                                 size={14}
                                                                 className={
                                                                      formData.isActive ===
                                                                      "active"
                                                                           ? "text-(--ok)"
                                                                           : ""
                                                                 }
                                                            />
                                                            Active
                                                       </button>

                                                       {/* Inactive Option */}
                                                       <button
                                                            type="button"
                                                            onClick={() =>
                                                                 !loading &&
                                                                 setFormData(
                                                                      (
                                                                           prev,
                                                                      ) => ({
                                                                           ...prev,
                                                                           isActive:
                                                                                "inactive",
                                                                      }),
                                                                 )
                                                            }
                                                            className="relative flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-semibold transition-all duration-200 cursor-pointer"
                                                            style={{
                                                                 color:
                                                                      formData.isActive ===
                                                                      "inactive"
                                                                           ? "#FFFFFF"
                                                                           : "var(--text-secondary)",
                                                                 background:
                                                                      formData.isActive ===
                                                                      "inactive"
                                                                           ? "rgba(248, 113, 113, 0.08)"
                                                                           : "transparent",
                                                                 border:
                                                                      formData.isActive ===
                                                                      "inactive"
                                                                           ? "1px solid rgba(248, 113, 113, 0.3)"
                                                                           : "1px solid transparent",
                                                            }}
                                                       >
                                                            <Activity
                                                                 size={14}
                                                                 className={
                                                                      formData.isActive ===
                                                                      "inactive"
                                                                           ? "text-(--danger)"
                                                                           : ""
                                                                 }
                                                            />
                                                            Inactive
                                                       </button>
                                                  </div>
                                                  <p className="mt-1.5 text-[11px] text-(--text-tertiary)">
                                                       Inactive companies cannot
                                                       have new products listed
                                                       under them
                                                  </p>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Form actions / buttons */}
                                   <div
                                        className="border-t pt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
                                        style={{
                                             borderColor: "var(--glass-border)",
                                        }}
                                   >
                                        <Link
                                             href="/companies"
                                             className="glass-panel rounded-xl px-6 py-3 text-[13px] font-semibold text-(--text-secondary) hover:text-(--text-primary) hover:bg-white/5 transition-colors text-center"
                                        >
                                             Cancel
                                        </Link>
                                        <button
                                             type="button"
                                             onClick={() =>
                                                  setFormData({
                                                       name: "",
                                                       logo: "",
                                                       description: "",
                                                       website: "",
                                                       phone: "",
                                                       email: "",
                                                       isActive: "active",
                                                  })
                                             }
                                             disabled={loading}
                                             className="glass-panel rounded-xl px-6 py-3 text-[13px] font-semibold text-(--text-secondary) hover:text-(--text-primary) hover:bg-white/5 transition-colors disabled:opacity-50 text-center"
                                        >
                                             Reset Form
                                        </button>
                                        <button
                                             type="submit"
                                             disabled={loading}
                                             className="relative flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-[13px] font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                             style={{
                                                  background: "var(--thread)",
                                             }}
                                        >
                                             {loading ? (
                                                  <>
                                                       <Loader2
                                                            size={16}
                                                            className="animate-spin"
                                                       />
                                                       Saving Company...
                                                  </>
                                             ) : (
                                                  "Save Company"
                                             )}
                                        </button>
                                   </div>
                              </form>
                         </motion.div>
                    )}
               </AnimatePresence>
          </main>
     );
}
