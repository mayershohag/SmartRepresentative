"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Register } from "../../../apis/register";
import { getCompanies } from "../../../apis/getCompanies";
import {
     User,
     Briefcase,
     MapPin,
     Phone,
     Mail,
     Lock,
     Building,
     FileText,
     CreditCard,
     ArrowRight,
     ArrowLeft,
     AlertCircle,
     CheckCircle,
     Loader2,
     ShieldCheck,
     Map,
     Eye,
     EyeOff,
     Building2,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function DistributorRegister() {
     const [currentStep, setCurrentStep] = useState(1);
     const totalSteps = 4;

     const [formData, setFormData] = useState({
          name: "",
          businessName: "",
          tradeLicense: "",
          nid: "",
          companyIds: "",
          district: "",
          address: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
     });

     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [success, setSuccess] = useState(false);
     const [fieldErrors, setFieldErrors] = useState({});
     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
     const [showPassword, setShowPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
     const [availableCompanies, setAvailableCompanies] = useState([]);
     const [fetchingCompanies, setFetchingCompanies] = useState(false);
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

     useEffect(() => {
          const fetchCompanies = async () => {
               setFetchingCompanies(true);
               try {
                    const response = await getCompanies();
                    if (response.ok && response.data) {
                         // Assuming response.data.data or response.data contains the array of companies
                         const companiesList = Array.isArray(response.data.data)
                              ? response.data.data
                              : Array.isArray(response.data)
                                ? response.data
                                : [];
                         setAvailableCompanies(companiesList);
                    }
               } catch (error) {
                    console.error("Error fetching companies:", error);
               } finally {
                    setFetchingCompanies(false);
               }
          };

          fetchCompanies();
     }, []);

     const districts = [
          "Dhaka",
          "Faridpur",
          "Gazipur",
          "Gopalganj",
          "Kishoreganj",
          "Madaripur",
          "Manikganj",
          "Munshiganj",
          "Narayanganj",
          "Narsingdi",
          "Rajbari",
          "Shariatpur",
          "Tangail",
          "Bogra",
          "Joypurhat",
          "Naogaon",
          "Natore",
          "Nawabganj",
          "Pabna",
          "Rajshahi",
          "Sirajganj",
          "Dinajpur",
          "Gaibandha",
          "Kurigram",
          "Lalmonirhat",
          "Nilphamari",
          "Panchagarh",
          "Rangpur",
          "Thakurgaon",
          "Barguna",
          "Barisal",
          "Bhola",
          "Jhalokati",
          "Patuakhali",
          "Pirojpur",
          "Bandarban",
          "Brahmanbaria",
          "Chandpur",
          "Chattogram",
          "Cumilla",
          "Cox's Bazar",
          "Feni",
          "Khagrachari",
          "Lakshmipur",
          "Noakhali",
          "Rangamati",
          "Habiganj",
          "Moulvibazar",
          "Sunamganj",
          "Sylhet",
          "Bagerhat",
          "Chuadanga",
          "Jashore",
          "Jhenaidah",
          "Khulna",
          "Kushtia",
          "Magura",
          "Meherpur",
          "Narail",
          "Satkhira",
          "Jamalpur",
          "Mymensingh",
          "Netrokona",
          "Sherpur",
     ].sort();

     const validateStep = (step) => {
          const errors = {};

          if (step === 1) {
               if (!formData.name || formData.name.length < 2)
                    errors.name = "Name must be at least 2 characters.";
               if (
                    !formData.nid ||
                    formData.nid.length < 10 ||
                    formData.nid.length > 17
               )
                    errors.nid = "NID must be 10-17 digits.";
               if (
                    !formData.phone ||
                    !/^(\+8801|01)[3-9]\d{8}$/.test(formData.phone)
               )
                    errors.phone = "Valid BD phone required.";
               if (
                    formData.email &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
               )
                    errors.email = "Valid email required.";
          }
          if (step === 2) {
               if (!formData.businessName)
                    errors.businessName = "Business name is required.";
               if (!formData.tradeLicense)
                    errors.tradeLicense = "Trade license is required.";
               if (!formData.companyIds.trim())
                    errors.companyIds = "At least one company ID is required.";
          }
          if (step === 3) {
               if (!formData.district)
                    errors.district = "District is required.";
          }
          if (step === 4) {
               if (!formData.password || formData.password.length < 8)
                    errors.password = "Password must be at least 8 characters.";
               if (formData.password !== formData.confirmPassword)
                    errors.confirmPassword = "Passwords do not match.";
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

     const handleCompanySelect = (companyId) => {
          setFormData((prev) => {
               const currentIds = prev.companyIds
                    ? prev.companyIds.split(",")
                    : [];
               if (currentIds.includes(companyId)) {
                    // Remove if already selected
                    return {
                         ...prev,
                         companyIds: currentIds
                              .filter((id) => id !== companyId)
                              .join(","),
                    };
               } else {
                    // Add to selection
                    return {
                         ...prev,
                         companyIds: [...currentIds, companyId].join(","),
                    };
               }
          });
          if (fieldErrors.companyIds) {
               setFieldErrors((prev) => ({ ...prev, companyIds: null }));
          }
     };

     const removeCompany = (companyId, e) => {
          e.stopPropagation();
          setFormData((prev) => {
               const currentIds = prev.companyIds
                    ? prev.companyIds.split(",")
                    : [];
               return {
                    ...prev,
                    companyIds: currentIds
                         .filter((id) => id !== companyId)
                         .join(","),
               };
          });
     };

     const handleChange = (e) => {
          const { name, value, type } = e.target;

          if (type === "select-multiple") {
               const options = Array.from(e.target.selectedOptions);
               const selectedValues = options
                    .map((option) => option.value)
                    .join(",");
               setFormData((prev) => ({ ...prev, [name]: selectedValues }));
          } else {
               setFormData((prev) => ({ ...prev, [name]: value }));
          }

          // Clear error when typing/selecting
          if (fieldErrors[name]) {
               setFieldErrors((prev) => ({ ...prev, [name]: null }));
          }
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (currentStep !== totalSteps) return;

          if (!validateStep(4)) return;

          setLoading(true);
          setError(null);

          try {
               const companies = formData.companyIds
                    .split(",")
                    .map((id) => id.trim())
                    .filter((id) => id.length > 0);

               const credentials = {
                    name: formData.name.trim(),
                    businessName: formData.businessName.trim(),
                    tradeLicense: formData.tradeLicense.trim(),
                    nid: formData.nid.trim(),
                    companies,
                    district: formData.district,
                    address: formData.address.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email ? formData.email.trim() : undefined,
                    password: formData.password,
                    role: "Distributor",
               };

               const response = await Register(credentials, "distributor");

               if (response.ok) {
                    setSuccess(true);
               } else {
                    setError(
                         response.data?.message ||
                              "Registration failed. Please try again.",
                    );
               }
          } catch (err) {
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
          ${errorField ? "text-red-400" : "text-gray-400 peer-focus:text-orange-500"}
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
                              Your distributor account has been created
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
                         <div className=" flex items-center gap-3 mb-10">
                              <span className="text-gray-900 text-2xl font-bold tracking-tight">
                                   Register as Distributor
                              </span>
                         </div>

                         {/* Stepper Progress */}
                         <div className="mb-10">
                              <div className="flex items-start">
                                   {[
                                        { step: 1, label: "Personal" },
                                        { step: 2, label: "Business" },
                                        { step: 3, label: "Location" },
                                        { step: 4, label: "Security" },
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

                         <div className="mb-8">
                              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                   {currentStep === 1 && "Personal Information"}
                                   {currentStep === 2 && "Business Details"}
                                   {currentStep === 3 && "Location"}
                                   {currentStep === 4 && "Secure your account"}
                              </h2>
                              <p className="text-gray-500 mt-2">
                                   {currentStep === 1 &&
                                        "Let's start with your basic details."}
                                   {currentStep === 2 &&
                                        "Tell us about your distribution business."}
                                   {currentStep === 3 &&
                                        "Where are you operating from?"}
                                   {currentStep === 4 &&
                                        "Create a strong password to protect your account."}
                              </p>
                         </div>

                         {error && (
                              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in">
                                   <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                   <p className="text-red-700 text-sm font-medium">
                                        {error}
                                   </p>
                              </div>
                         )}

                         <form onSubmit={handleSubmit} className="space-y-5">
                              {/* Step 1: Personal */}
                              <div
                                   className={
                                        currentStep === 1
                                             ? "block space-y-5 animate-in slide-in-from-right-4 fade-in duration-300"
                                             : "hidden"
                                   }
                              >
                                   <div className="relative group">
                                        <input
                                             type="text"
                                             name="name"
                                             value={formData.name}
                                             onChange={handleChange}
                                             placeholder="Full Name"
                                             className={`peer ${inputClasses(fieldErrors.name)}`}
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
                                   <div className="relative group">
                                        <input
                                             type="text"
                                             name="nid"
                                             value={formData.nid}
                                             onChange={handleChange}
                                             placeholder="NID Number (10-17 digits)"
                                             className={`peer ${inputClasses(fieldErrors.nid)}`}
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
                                   <div className="relative group">
                                        <input
                                             type="tel"
                                             name="phone"
                                             value={formData.phone}
                                             onChange={handleChange}
                                             placeholder="Phone Number (e.g. +8801...)"
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
                                   <div className="relative group">
                                        <input
                                             type="email"
                                             name="email"
                                             value={formData.email}
                                             onChange={handleChange}
                                             placeholder="Email Address (Optional)"
                                             className={`peer ${inputClasses(fieldErrors.email)}`}
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
                              </div>

                              {/* Step 2: Business */}
                              <div
                                   className={
                                        currentStep === 2
                                             ? "block space-y-5 animate-in slide-in-from-right-4 fade-in duration-300"
                                             : "hidden"
                                   }
                              >
                                   <div className="relative group">
                                        <input
                                             type="text"
                                             name="businessName"
                                             value={formData.businessName}
                                             onChange={handleChange}
                                             placeholder="Business Name"
                                             className={`peer ${inputClasses(fieldErrors.businessName)}`}
                                        />
                                        <Briefcase
                                             className={iconClasses(
                                                  fieldErrors.businessName,
                                             )}
                                        />
                                        {fieldErrors.businessName && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.businessName}
                                             </p>
                                        )}
                                   </div>
                                   <div className="relative group">
                                        <input
                                             type="text"
                                             name="tradeLicense"
                                             value={formData.tradeLicense}
                                             onChange={handleChange}
                                             placeholder="Trade License Number"
                                             className={`peer ${inputClasses(fieldErrors.tradeLicense)}`}
                                        />
                                        <FileText
                                             className={iconClasses(
                                                  fieldErrors.tradeLicense,
                                             )}
                                        />
                                        {fieldErrors.tradeLicense && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.tradeLicense}
                                             </p>
                                        )}
                                   </div>
                                   <div className="relative group">
                                        {/* Custom Dropdown Trigger */}
                                        <div
                                             onClick={() =>
                                                  setIsDropdownOpen(
                                                       !isDropdownOpen,
                                                  )
                                             }
                                             className={`peer w-full pl-11 pr-10 py-3 bg-gray-50/50 border rounded-2xl text-gray-900 transition-all duration-300 outline-none cursor-pointer min-h-14 flex flex-wrap items-center gap-2
                                             ${fieldErrors.companyIds ? "border-red-300 ring-4 ring-red-100 bg-white" : "border-gray-200 hover:border-gray-300"}
                                             ${isDropdownOpen ? "ring-4 ring-orange-100 border-orange-500 bg-white" : ""}
                                             `}
                                        >
                                             <Building
                                                  className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300 ${fieldErrors.companyIds ? "text-red-400" : isDropdownOpen ? "text-orange-500" : "text-gray-400"}`}
                                             />

                                             {formData.companyIds ? (
                                                  formData.companyIds
                                                       .split(",")
                                                       .map((id) => {
                                                            const company =
                                                                 availableCompanies.find(
                                                                      (c) =>
                                                                           c._id ===
                                                                           id,
                                                                 );
                                                            if (!company)
                                                                 return null;
                                                            return (
                                                                 <span
                                                                      key={id}
                                                                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-100 text-orange-800 text-xs font-semibold shadow-sm"
                                                                 >
                                                                      {company.name ||
                                                                           company.businessName}
                                                                      <button
                                                                           type="button"
                                                                           onClick={(
                                                                                e,
                                                                           ) =>
                                                                                removeCompany(
                                                                                     id,
                                                                                     e,
                                                                                )
                                                                           }
                                                                           className="hover:text-orange-950 hover:bg-orange-200 rounded-full p-0.5 transition-colors ml-0.5 flex items-center justify-center"
                                                                      >
                                                                           <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="12"
                                                                                height="12"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                           >
                                                                                <path d="M18 6 6 18" />
                                                                                <path d="m6 6 12 12" />
                                                                           </svg>
                                                                      </button>
                                                                 </span>
                                                            );
                                                       })
                                             ) : (
                                                  <span className="text-gray-400">
                                                       Select Companies
                                                  </span>
                                             )}
                                        </div>

                                        {/* Dropdown Menu */}
                                        {isDropdownOpen && (
                                             <>
                                                  {/* Invisible overlay to close on click outside */}
                                                  <div
                                                       className="fixed inset-0 z-40"
                                                       onClick={() =>
                                                            setIsDropdownOpen(
                                                                 false,
                                                            )
                                                       }
                                                  ></div>
                                                  <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-64 overflow-auto py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                       {fetchingCompanies ? (
                                                            <div className="px-4 py-6 text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
                                                                 <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                                                                 Loading
                                                                 companies...
                                                            </div>
                                                       ) : availableCompanies.length >
                                                         0 ? (
                                                            availableCompanies.map(
                                                                 (company) => {
                                                                      const isSelected =
                                                                           formData.companyIds
                                                                                .split(
                                                                                     ",",
                                                                                )
                                                                                .includes(
                                                                                     company._id,
                                                                                );
                                                                      return (
                                                                           <div
                                                                                key={
                                                                                     company._id
                                                                                }
                                                                                onClick={() =>
                                                                                     handleCompanySelect(
                                                                                          company._id,
                                                                                     )
                                                                                }
                                                                                className={`px-4 py-3 mx-2 rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${isSelected ? "bg-orange-50" : "hover:bg-gray-50"}`}
                                                                           >
                                                                                <div
                                                                                     className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${isSelected ? "bg-orange-600 border-orange-600" : "border-gray-300"}`}
                                                                                >
                                                                                     <svg
                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                          width="12"
                                                                                          height="12"
                                                                                          viewBox="0 0 24 24"
                                                                                          fill="none"
                                                                                          stroke="currentColor"
                                                                                          strokeWidth="3"
                                                                                          strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                          className={`text-white transition-transform duration-200 ${isSelected ? "scale-100" : "scale-0"}`}
                                                                                     >
                                                                                          <path d="M20 6 9 17l-5-5" />
                                                                                     </svg>
                                                                                </div>
                                                                                <span
                                                                                     className={`text-sm ${isSelected ? "font-semibold text-orange-900" : "text-gray-700"}`}
                                                                                >
                                                                                     {company.name ||
                                                                                          company.businessName ||
                                                                                          "Unnamed Company"}
                                                                                </span>
                                                                           </div>
                                                                      );
                                                                 },
                                                            )
                                                       ) : (
                                                            <div className="px-4 py-6 text-sm text-gray-500 text-center">
                                                                 No companies
                                                                 available
                                                            </div>
                                                       )}
                                                  </div>
                                             </>
                                        )}

                                        {fieldErrors.companyIds && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.companyIds}
                                             </p>
                                        )}
                                   </div>
                              </div>

                              {/* Step 3: Location */}
                              <div
                                   className={
                                        currentStep === 3
                                             ? "block space-y-5 animate-in slide-in-from-right-4 fade-in duration-300"
                                             : "hidden"
                                   }
                              >
                                   <div className="relative group">
                                        <select
                                             name="district"
                                             value={formData.district}
                                             onChange={handleChange}
                                             className={`peer appearance-none bg-no-repeat bg-right pr-12 ${inputClasses(fieldErrors.district)}`}
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
                                                  Select District
                                             </option>
                                             {districts.map((dist) => (
                                                  <option
                                                       key={dist}
                                                       value={dist}
                                                  >
                                                       {dist}
                                                  </option>
                                             ))}
                                        </select>
                                        <Map
                                             className={iconClasses(
                                                  fieldErrors.district,
                                             )}
                                        />
                                        {fieldErrors.district && (
                                             <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">
                                                  {fieldErrors.district}
                                             </p>
                                        )}
                                   </div>
                                   <div className="relative group">
                                        <textarea
                                             name="address"
                                             value={formData.address}
                                             onChange={handleChange}
                                             placeholder="Detailed Address (Optional)"
                                             rows="3"
                                             className={`peer resize-none ${inputClasses(null)}`}
                                        />
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400 transition-colors duration-300" />
                                   </div>
                              </div>

                              {/* Step 4: Security */}
                              <div
                                   className={
                                        currentStep === 4
                                             ? "block space-y-5 animate-in slide-in-from-right-4 fade-in duration-300"
                                             : "hidden"
                                   }
                              >
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
                                             className={`peer ${inputClasses(fieldErrors.confirmPassword).replace("pr-4", "pr-12")}`}
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
                                             <ArrowLeft className="w-5 h-5" />{" "}
                                             Back
                                        </button>
                                   )}
                                   {currentStep < totalSteps ? (
                                        <button
                                             type="button"
                                             onClick={nextStep}
                                             className="flex-2 py-4 px-4 bg-orange-600 cursor-pointer text-white rounded-2xl font-bold hover:bg-orange-700 focus:ring-4 focus:ring-orange-100 hover:shadow-lg hover:shadow-orange-200 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                             Continue{" "}
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
                                                       <Loader2 className="w-5 h-5 animate-spin" />{" "}
                                                       Processing
                                                  </>
                                             ) : (
                                                  <>
                                                       <CheckCircle className="w-5 h-5" />{" "}
                                                       Create Account
                                                  </>
                                             )}
                                        </button>
                                   )}
                              </div>
                         </form>

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
