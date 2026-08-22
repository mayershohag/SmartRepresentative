"use client";

import { useState } from "react";
import {
     User,
     Phone,
     Lock,
     Mail,
     Building2,
     FileBadge2,
     MapPin,
     IdCard,
     Eye,
     EyeOff,
     Loader2,
     AlertCircle,
} from "lucide-react";
import { addUser } from "@/apis/addUser";

const PHONE_REGEX = /^(\+8801|01)[3-9]\d{8}$/;

const ROLES = [
     { value: "distributor", label: "Distributor" },
     { value: "delivery", label: "Delivery Man" },
     { value: "shopkeeper", label: "Shopkeeper" },
];

const INITIAL_FORM = {
     name: "",
     role: "distributor",
     businessName: "",
     tradeLicense: "",
     nid: "",
     district: "",
     address: "",
     phone: "",
     email: "",
     password: "",
     confirmPassword: "",
};

function validateField(name, value, form) {
     switch (name) {
          case "name":
               if (!value.trim()) return "Name is required";
               if (value.trim().length < 2)
                    return "Name must be at least 2 characters";
               return "";

          case "businessName":
               if (form.role === "distributor" && !value.trim())
                    return "Business name is required";
               return "";

          case "tradeLicense":
               if (form.role === "distributor" && !value.trim())
                    return "Trade license is required";
               return "";

          case "district":
               if (form.role === "distributor" && !value.trim())
                    return "District is required";
               return "";

          case "nid":
               if (!value.trim()) return "NID is required";
               return "";

          case "phone":
               if (!value.trim()) return "Phone number is required";
               if (!PHONE_REGEX.test(value.trim()))
                    return "Enter a valid BD number, e.g. 01712345678";
               return "";

          case "email":
               if (
                    value.trim() &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
               )
                    return "Enter a valid email";
               return "";

          case "password":
               if (!value) return "Password is required";
               if (value.length < 8)
                    return "Password must be at least 8 characters";
               return "";

          case "confirmPassword":
               if (value !== form.password) return "Passwords do not match";
               return "";

          default:
               return "";
     }
}

function FieldError({ message }) {
     if (!message) return null;
     return (
          <p
               className="mt-1.5 flex items-center gap-1 text-[11.5px]"
               style={{ color: "var(--danger)" }}
          >
               <AlertCircle size={12} strokeWidth={2} />
               {message}
          </p>
     );
}

function TextField({
     icon: Icon,
     label,
     name,
     value,
     onChange,
     onBlur,
     error,
     type = "text",
     placeholder,
     required,
     autoComplete,
}) {
     return (
          <div>
               <label
                    htmlFor={name}
                    className="mb-1.5 block text-[12.5px] font-medium"
                    style={{ color: "var(--text-secondary)" }}
               >
                    {label}
                    {required && (
                         <span style={{ color: "var(--thread-pink)" }}> *</span>
                    )}
               </label>
               <div
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 transition-colors"
                    style={{
                         background: "rgba(255,255,255,0.05)",
                         border: `1px solid ${error ? "var(--danger)" : "var(--glass-border)"}`,
                    }}
               >
                    <Icon
                         size={16}
                         className="shrink-0"
                         style={{ color: "var(--text-tertiary)" }}
                         strokeWidth={2}
                    />
                    <input
                         id={name}
                         name={name}
                         type={type}
                         value={value}
                         onChange={onChange}
                         onBlur={onBlur}
                         placeholder={placeholder}
                         autoComplete={autoComplete}
                         className="w-full bg-transparent text-[13.5px]"
                         style={{
                              color: "var(--text-primary)",
                              outline: false,
                         }}
                    />
               </div>
               <FieldError message={error} />
          </div>
     );
}

export default function DistributionRegister({ onSubmit }) {
     const [form, setForm] = useState(INITIAL_FORM);
     const [errors, setErrors] = useState({});
     const [touched, setTouched] = useState({});
     const [showPassword, setShowPassword] = useState(false);
     const [showConfirm, setShowConfirm] = useState(false);
     const [submitting, setSubmitting] = useState(false);
     const [submitError, setSubmitError] = useState("");

     const isDistributor = form.role === "distributor";

     const handleChange = (e) => {
          const { name, value } = e.target;
          const nextForm = { ...form, [name]: value };
          setForm(nextForm);

          if (touched[name]) {
               setErrors((prev) => ({
                    ...prev,
                    [name]: validateField(name, value, nextForm),
               }));
          }
          if (name === "role") {
               setErrors((prev) => ({
                    ...prev,
                    businessName: validateField(
                         "businessName",
                         nextForm.businessName,
                         nextForm,
                    ),
                    tradeLicense: validateField(
                         "tradeLicense",
                         nextForm.tradeLicense,
                         nextForm,
                    ),
                    district: validateField(
                         "district",
                         nextForm.district,
                         nextForm,
                    ),
               }));
          }
     };

     const handleBlur = (e) => {
          const { name, value } = e.target;
          setTouched((prev) => ({ ...prev, [name]: true }));
          setErrors((prev) => ({
               ...prev,
               [name]: validateField(name, value, form),
          }));
     };

     const runFullValidation = () => {
          const fieldsToCheck = [
               "name",
               "nid",
               "phone",
               "email",
               "password",
               "confirmPassword",
               ...(isDistributor
                    ? ["businessName", "tradeLicense", "district"]
                    : []),
          ];
          const nextErrors = {};
          fieldsToCheck.forEach((field) => {
               nextErrors[field] = validateField(field, form[field], form);
          });
          setErrors(nextErrors);
          setTouched(Object.fromEntries(fieldsToCheck.map((f) => [f, true])));
          return Object.values(nextErrors).every((msg) => !msg);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          setSubmitError("");

          if (!runFullValidation()) return;

          const { confirmPassword, ...payload } = form;

          if (!isDistributor) {
               delete payload.businessName;
               delete payload.tradeLicense;
               delete payload.district;
          }

          try {
               setSubmitting(true);
               await addUser(payload);
          } catch (err) {
               setSubmitError(
                    err?.message || "Something went wrong. Please try again.",
               );
          } finally {
               setSubmitting(false);
          }
     };

     return (
          <div className="glass-panel w-1/2 rounded-2xl p-7 mx-auto">
               <div className="mb-6">
                    <h1
                         className="font-display text-[20px] font-semibold"
                         style={{ color: "var(--text-primary)" }}
                    >
                         Create your account
                    </h1>
                    <p
                         className="mt-1 text-[12.5px]"
                         style={{ color: "var(--text-tertiary)" }}
                    >
                         Join Smart Representative as a distributor, delivery
                         man, or shopkeeper
                    </p>
               </div>

               <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-4"
               >
                    {/* Role selector */}
                    <div>
                         <label
                              className="mb-1.5 block text-[12.5px] font-medium"
                              style={{ color: "var(--text-secondary)" }}
                         >
                              I am a
                              <span style={{ color: "var(--thread-pink)" }}>
                                   {" "}
                                   *
                              </span>
                         </label>
                         <div className="grid grid-cols-3 gap-2">
                              {ROLES.map((r) => {
                                   const active = form.role === r.value;
                                   return (
                                        <button
                                             key={r.value}
                                             type="button"
                                             onClick={() =>
                                                  handleChange({
                                                       target: {
                                                            name: "role",
                                                            value: r.value,
                                                       },
                                                  })
                                             }
                                             className="rounded-xl px-3 py-2.5 text-[12.5px] font-medium transition-all duration-150"
                                             style={{
                                                  background: active
                                                       ? "var(--thread-soft)"
                                                       : "rgba(255,255,255,0.05)",
                                                  border: `1px solid ${active ? "var(--glass-border-strong)" : "var(--glass-border)"}`,
                                                  color: active
                                                       ? "var(--text-primary)"
                                                       : "var(--text-tertiary)",
                                             }}
                                        >
                                             {r.label}
                                        </button>
                                   );
                              })}
                         </div>
                    </div>

                    <TextField
                         icon={User}
                         label="Full Name"
                         name="name"
                         value={form.name}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={touched.name && errors.name}
                         placeholder="Rafiq Islam"
                         autoComplete="name"
                         required
                    />

                    {/* Distributor-only fields — required only when role === "distributor",
            exactly matching the schema's conditional `required` functions. */}
                    {isDistributor && (
                         <>
                              <TextField
                                   icon={Building2}
                                   label="Business Name"
                                   name="businessName"
                                   value={form.businessName}
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   error={
                                        touched.businessName &&
                                        errors.businessName
                                   }
                                   placeholder="Rafiq Distribution House"
                                   required
                              />
                              <div className="grid grid-cols-2 gap-3">
                                   <TextField
                                        icon={FileBadge2}
                                        label="Trade License"
                                        name="tradeLicense"
                                        value={form.tradeLicense}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                             touched.tradeLicense &&
                                             errors.tradeLicense
                                        }
                                        placeholder="TL-00123456"
                                        required
                                   />
                                   <TextField
                                        icon={MapPin}
                                        label="District"
                                        name="district"
                                        value={form.district}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                             touched.district && errors.district
                                        }
                                        placeholder="Dhaka"
                                        required
                                   />
                              </div>
                         </>
                    )}

                    <TextField
                         icon={IdCard}
                         label="NID Number"
                         name="nid"
                         value={form.nid}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={touched.nid && errors.nid}
                         placeholder="1234567890123"
                         required
                    />

                    <TextField
                         icon={Phone}
                         label="Phone Number"
                         name="phone"
                         value={form.phone}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={touched.phone && errors.phone}
                         placeholder="01712345678"
                         autoComplete="tel"
                         required
                    />

                    <TextField
                         icon={Mail}
                         label="Email (optional)"
                         name="email"
                         type="email"
                         value={form.email}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         error={touched.email && errors.email}
                         placeholder="you@example.com"
                         autoComplete="email"
                    />

                    {/* Password */}
                    <div>
                         <label
                              htmlFor="password"
                              className="mb-1.5 block text-[12.5px] font-medium"
                              style={{ color: "var(--text-secondary)" }}
                         >
                              Password
                              <span style={{ color: "var(--thread-pink)" }}>
                                   {" "}
                                   *
                              </span>
                         </label>
                         <div
                              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                              style={{
                                   background: "rgba(255,255,255,0.05)",
                                   border: `1px solid ${touched.password && errors.password ? "var(--danger)" : "var(--glass-border)"}`,
                              }}
                         >
                              <Lock
                                   size={16}
                                   className="shrink-0"
                                   style={{ color: "var(--text-tertiary)" }}
                                   strokeWidth={2}
                              />
                              <input
                                   id="password"
                                   name="password"
                                   type={showPassword ? "text" : "password"}
                                   value={form.password}
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   placeholder="At least 8 characters"
                                   autoComplete="new-password"
                                   className="w-full bg-transparent text-[13.5px] focus:outline-none"
                                   style={{ color: "var(--text-primary)" }}
                              />
                              <button
                                   type="button"
                                   onClick={() => setShowPassword((s) => !s)}
                                   aria-label={
                                        showPassword
                                             ? "Hide password"
                                             : "Show password"
                                   }
                                   className="shrink-0"
                                   style={{ color: "var(--text-tertiary)" }}
                              >
                                   {showPassword ? (
                                        <EyeOff size={16} />
                                   ) : (
                                        <Eye size={16} />
                                   )}
                              </button>
                         </div>
                         <FieldError
                              message={touched.password && errors.password}
                         />
                    </div>

                    {/* Confirm password — UI-only, not part of the schema */}
                    <div>
                         <label
                              htmlFor="confirmPassword"
                              className="mb-1.5 block text-[12.5px] font-medium"
                              style={{ color: "var(--text-secondary)" }}
                         >
                              Confirm Password
                              <span style={{ color: "var(--thread-pink)" }}>
                                   {" "}
                                   *
                              </span>
                         </label>
                         <div
                              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                              style={{
                                   background: "rgba(255,255,255,0.05)",
                                   border: `1px solid ${touched.confirmPassword && errors.confirmPassword ? "var(--danger)" : "var(--glass-border)"}`,
                              }}
                         >
                              <Lock
                                   size={16}
                                   className="shrink-0"
                                   style={{ color: "var(--text-tertiary)" }}
                                   strokeWidth={2}
                              />
                              <input
                                   id="confirmPassword"
                                   name="confirmPassword"
                                   type={showConfirm ? "text" : "password"}
                                   value={form.confirmPassword}
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   placeholder="Re-enter your password"
                                   autoComplete="new-password"
                                   className="w-full bg-transparent text-[13.5px] focus:outline-none"
                                   style={{ color: "var(--text-primary)" }}
                              />
                              <button
                                   type="button"
                                   onClick={() => setShowConfirm((s) => !s)}
                                   aria-label={
                                        showConfirm
                                             ? "Hide password"
                                             : "Show password"
                                   }
                                   className="shrink-0"
                                   style={{ color: "var(--text-tertiary)" }}
                              >
                                   {showConfirm ? (
                                        <EyeOff size={16} />
                                   ) : (
                                        <Eye size={16} />
                                   )}
                              </button>
                         </div>
                         <FieldError
                              message={
                                   touched.confirmPassword &&
                                   errors.confirmPassword
                              }
                         />
                    </div>

                    {submitError && (
                         <div
                              className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12.5px]"
                              style={{
                                   background: "var(--danger-bg)",
                                   color: "var(--danger)",
                              }}
                         >
                              <AlertCircle
                                   size={14}
                                   strokeWidth={2}
                                   className="shrink-0"
                              />
                              {submitError}
                         </div>
                    )}

                    <button
                         type="submit"
                         disabled={submitting}
                         className="mt-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[13.5px] font-semibold text-white transition-transform disabled:cursor-not-allowed disabled:opacity-60"
                         style={{ background: "var(--thread)" }}
                    >
                         {submitting && (
                              <Loader2 size={16} className="animate-spin" />
                         )}
                         {submitting ? "Creating account…" : "Create Account"}
                    </button>
               </form>
          </div>
     );
}
