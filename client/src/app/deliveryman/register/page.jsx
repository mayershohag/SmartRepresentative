"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Register } from "../../../apis/register";
import { getCompanies } from "../../../apis/getCompanies";
import { getDistributors } from "../../../apis/getDistributors";

import {
     User,
     Phone,
     Lock,
     Building,
     CreditCard,
     ArrowRight,
     ArrowLeft,
     AlertCircle,
     CheckCircle,
     ShieldCheck,
     MapPin,
     Truck,
     Eye,
     EyeOff,
     Briefcase,
} from "lucide-react";

import { usePathname } from "next/navigation";

export default function DeliveryManRegister() {
     const [currentStep, setCurrentStep] = useState(1);
     const totalSteps = 4;

     const [formData, setFormData] = useState({
          name: "",
          phone: "",
          nid: "",
          distributorId: "",
          companies: "",
          vehicleType: "Van",
          vehicleNumber: "",
          address: "",
          password: "",
          confirmPassword: "",
     });

     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [success, setSuccess] = useState(false);
     const [fieldErrors, setFieldErrors] = useState({});

     const [showPassword, setShowPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

     const [availableCompanies, setAvailableCompanies] = useState([]);
     const [availableDistributors, setAvailableDistributors] = useState([]);

     const [fetchingCompanies, setFetchingCompanies] = useState(false);
     const [fetchingDistributors, setFetchingDistributors] = useState(false);

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

     // ============================================
     // FETCH COMPANIES AND DISTRIBUTORS
     // ============================================

     useEffect(() => {
          const fetchData = async () => {
               setFetchingCompanies(true);
               setFetchingDistributors(true);

               try {
                    const [companiesResponse, distributorsResponse] =
                         await Promise.all([getCompanies(), getDistributors()]);

                    if (
                         companiesResponse.ok &&
                         Array.isArray(companiesResponse.data)
                    ) {
                         setAvailableCompanies(companiesResponse.data);
                    }

                    if (
                         distributorsResponse.ok &&
                         Array.isArray(distributorsResponse.data)
                    ) {
                         setAvailableDistributors(distributorsResponse.data);
                    }
               } catch (err) {
                    console.error("Error fetching data:", err);
               } finally {
                    setFetchingCompanies(false);
                    setFetchingDistributors(false);
               }
          };

          fetchData();
     }, []);

     const vehicleTypes = [
          "Van",
          "Pickup",
          "Motorbike",
          "Bicycle",
          "On Foot",
          "Other",
     ];

     // ============================================
     // GET DISTRIBUTORS FOR SELECTED COMPANY
     // ============================================

     const getCompanyDistributors = () => {
          if (!formData.companies) {
               return [];
          }

          const selectedCompany = availableCompanies.find(
               (company) => company._id === formData.companies,
          );

          if (
               !selectedCompany ||
               !Array.isArray(selectedCompany.distributors)
          ) {
               return [];
          }

          const companyDistributorIds = selectedCompany.distributors
               .map((distributor) => {
                    // If distributors contains ObjectId strings
                    if (typeof distributor === "string") {
                         return distributor;
                    }

                    // If distributors contains populated objects
                    if (distributor && distributor._id) {
                         return distributor._id;
                    }

                    return null;
               })
               .filter(Boolean);

          return availableDistributors.filter((distributor) =>
               companyDistributorIds.includes(distributor._id),
          );
     };

     const filteredDistributors = getCompanyDistributors();

     // ============================================
     // VALIDATION
     // ============================================

     const validateStep = (step) => {
          const errors = {};

          if (step === 1) {
               if (!formData.name || formData.name.trim().length < 2) {
                    errors.name = "Name must be at least 2 characters.";
               }

               if (
                    !formData.phone ||
                    !/^(\+8801|01)[3-9]\d{8}$/.test(formData.phone)
               ) {
                    errors.phone =
                         "Please provide a valid Bangladeshi phone number.";
               }

               if (
                    !formData.nid ||
                    !/^(?:\d{10}|\d{13}|\d{17})$/.test(formData.nid)
               ) {
                    errors.nid = "NID must be exactly 10, 13, or 17 digits.";
               }
          }

          if (step === 2) {
               if (!formData.companies) {
                    errors.companies = "Company selection is required.";
               }

               if (!formData.distributorId) {
                    errors.distributorId = "Assigned Distributor is required.";
               }
          }

          if (step === 3) {
               if (!formData.vehicleType) {
                    errors.vehicleType = "Vehicle type is required.";
               }
          }

          if (step === 4) {
               if (!formData.password || formData.password.length < 8) {
                    errors.password = "Password must be at least 8 characters.";
               }

               if (formData.password !== formData.confirmPassword) {
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

     // ============================================
     // HANDLE INPUT CHANGE
     // ============================================

     const handleChange = (e) => {
          const { name, value } = e.target;

          // When company changes,
          // reset previously selected distributor
          if (name === "companies") {
               setFormData((prev) => ({
                    ...prev,
                    companies: value,
                    distributorId: "",
               }));

               setFieldErrors((prev) => ({
                    ...prev,
                    companies: null,
                    distributorId: null,
               }));

               return;
          }

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

     // ============================================
     // SUBMIT
     // ============================================

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (currentStep !== totalSteps) return;

          if (!validateStep(4)) return;

          setLoading(true);
          setError(null);

          try {
               const credentials = {
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    nid: formData.nid.trim(),

                    distributorId: formData.distributorId,
                    companies: formData.companies,

                    vehicleType: formData.vehicleType,
                    vehicleNumber: formData.vehicleNumber.trim(),
                    address: formData.address.trim(),

                    password: formData.password,

                    role: "deliveryman",
               };

               const response = await Register(credentials, "deliveryman");

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

     // ============================================
     // STYLES
     // ============================================

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

     // ============================================
     // SUCCESS SCREEN
     // ============================================

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
                              Your delivery man account has been created
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

     // ============================================
     // MAIN UI
     // ============================================

     return (
          <div className="min-h-screen bg-[#111]/5 flex font-sans selection:bg-orange-100">
               <div className="w-160 max-w-3xl my-10 mx-auto bg-white/80 backdrop-blur-[5px] rounded-4xl border border-black/9 shadow-2xl shadow-slate-300/60 p-6 sm:p-10 flex items-center justify-center relative">
                    <div className="w-full max-w-lg">
                         {/* Header */}
                         <div className="flex items-center gap-3 mb-10">
                              <span className="text-gray-900 text-2xl font-bold tracking-tight">
                                   Register as Delivery Man
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
                                             label: "Assignment",
                                        },
                                        {
                                             step: 3,
                                             label: "Vehicle",
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
                                   {currentStep === 2 && "Work Assignment"}
                                   {currentStep === 3 && "Vehicle Details"}
                                   {currentStep === 4 && "Secure your account"}
                              </h2>

                              <p className="text-gray-500 mt-2">
                                   {currentStep === 1 &&
                                        "Let's start with your basic details."}
                                   {currentStep === 2 &&
                                        "Assign a company and distributor."}
                                   {currentStep === 3 &&
                                        "Tell us about your delivery vehicle."}
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
                              {/* =====================================
                                   STEP 1: PERSONAL
                              ===================================== */}

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
                                             placeholder="Delivery Man Name"
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

                                   {/* NID */}
                                   <div className="relative group">
                                        <input
                                             type="text"
                                             name="nid"
                                             value={formData.nid}
                                             onChange={handleChange}
                                             placeholder="NID Number (10, 13 or 17 digits)"
                                             className={`peer ${inputClasses(
                                                  fieldErrors.nid,
                                             )}`}
                                        />

                                        <CreditCard
                                             className={iconClasses(
                                                  fieldErrors.nid,
                                             )}
                                        />

                                        {fieldErrors.nid && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.nid}
                                             </p>
                                        )}
                                   </div>
                              </div>

                              {/* =====================================
                                   STEP 2: ASSIGNMENT
                              ===================================== */}

                              <div
                                   className={
                                        currentStep === 2
                                             ? "block space-y-5 animate-in slide-in-from-right-4 fade-in duration-300"
                                             : "hidden"
                                   }
                              >
                                   {/* Company Select */}
                                   <div className="relative group">
                                        <select
                                             name="companies"
                                             value={formData.companies}
                                             onChange={handleChange}
                                             disabled={fetchingCompanies}
                                             className={`peer appearance-none bg-no-repeat bg-right pr-12 ${inputClasses(
                                                  fieldErrors.companies,
                                             )}`}
                                             style={{
                                                  backgroundImage:
                                                       'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                                  backgroundSize:
                                                       "0.65rem auto",
                                                  backgroundPosition:
                                                       "calc(100% - 1.2rem) center",
                                             }}
                                        >
                                             <option value="" disabled>
                                                  {fetchingCompanies
                                                       ? "Loading Companies..."
                                                       : "Select Company"}
                                             </option>

                                             {availableCompanies.map(
                                                  (company) => (
                                                       <option
                                                            key={company._id}
                                                            value={company._id}
                                                       >
                                                            {company.name ||
                                                                 company.businessName ||
                                                                 "Unnamed Company"}
                                                       </option>
                                                  ),
                                             )}
                                        </select>

                                        <Building
                                             className={iconClasses(
                                                  fieldErrors.companies,
                                             )}
                                        />

                                        {fieldErrors.companies && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.companies}
                                             </p>
                                        )}
                                   </div>

                                   {/* Distributor Select */}
                                   <div className="relative group">
                                        <select
                                             name="distributorId"
                                             value={formData.distributorId}
                                             onChange={handleChange}
                                             disabled={
                                                  fetchingDistributors ||
                                                  !formData.companies
                                             }
                                             className={`peer appearance-none bg-no-repeat bg-right pr-12 ${inputClasses(
                                                  fieldErrors.distributorId,
                                             )}`}
                                             style={{
                                                  backgroundImage:
                                                       'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                                  backgroundSize:
                                                       "0.65rem auto",
                                                  backgroundPosition:
                                                       "calc(100% - 1.2rem) center",
                                             }}
                                        >
                                             <option value="" disabled>
                                                  {!formData.companies
                                                       ? "Select Company First"
                                                       : fetchingDistributors
                                                         ? "Loading Distributors..."
                                                         : filteredDistributors.length ===
                                                             0
                                                           ? "No Distributors Available"
                                                           : "Select Distributor"}
                                             </option>

                                             {filteredDistributors.map(
                                                  (distributor) => (
                                                       <option
                                                            key={
                                                                 distributor._id
                                                            }
                                                            value={
                                                                 distributor._id
                                                            }
                                                       >
                                                            {distributor.businessName ||
                                                                 distributor.name ||
                                                                 distributor.shopName ||
                                                                 "Unnamed Distributor"}
                                                       </option>
                                                  ),
                                             )}
                                        </select>

                                        <Briefcase
                                             className={iconClasses(
                                                  fieldErrors.distributorId,
                                             )}
                                        />

                                        {fieldErrors.distributorId && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.distributorId}
                                             </p>
                                        )}
                                   </div>
                              </div>

                              {/* =====================================
                                   STEP 3: VEHICLE
                              ===================================== */}

                              <div
                                   className={
                                        currentStep === 3
                                             ? "block space-y-5 animate-in slide-in-from-right-4 fade-in duration-300"
                                             : "hidden"
                                   }
                              >
                                   {/* Vehicle Type */}
                                   <div className="relative group">
                                        <select
                                             name="vehicleType"
                                             value={formData.vehicleType}
                                             onChange={handleChange}
                                             className={`peer appearance-none bg-no-repeat bg-right pr-12 ${inputClasses(
                                                  fieldErrors.vehicleType,
                                             )}`}
                                             style={{
                                                  backgroundImage:
                                                       'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9%205.4l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                                  backgroundSize:
                                                       "0.65rem auto",
                                                  backgroundPosition:
                                                       "calc(100% - 1.2rem) center",
                                             }}
                                        >
                                             {vehicleTypes.map((vehicle) => (
                                                  <option
                                                       key={vehicle}
                                                       value={vehicle}
                                                  >
                                                       {vehicle}
                                                  </option>
                                             ))}
                                        </select>

                                        <Truck
                                             className={iconClasses(
                                                  fieldErrors.vehicleType,
                                             )}
                                        />

                                        {fieldErrors.vehicleType && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.vehicleType}
                                             </p>
                                        )}
                                   </div>

                                   {/* Vehicle Number */}
                                   <div className="relative group">
                                        <input
                                             type="text"
                                             name="vehicleNumber"
                                             value={formData.vehicleNumber}
                                             onChange={handleChange}
                                             placeholder="Vehicle Number (Optional)"
                                             className={`peer ${inputClasses(
                                                  null,
                                             )}`}
                                        />

                                        <Truck className={iconClasses(null)} />
                                   </div>

                                   {/* Address */}
                                   <div className="relative group">
                                        <textarea
                                             name="address"
                                             value={formData.address}
                                             onChange={handleChange}
                                             placeholder="Residential Address (Optional)"
                                             rows="4"
                                             className={`peer resize-none ${inputClasses(
                                                  null,
                                             )}`}
                                        />

                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400 transition-colors duration-300" />
                                   </div>
                              </div>

                              {/* =====================================
                                   STEP 4: SECURITY
                              ===================================== */}

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
                              </div>

                              {/* Navigation Buttons */}
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
