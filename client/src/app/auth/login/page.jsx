"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
     Phone,
     Lock,
     Eye,
     EyeOff,
     Loader2,
     AlertCircle,
     CircleCheck,
     ArrowRight,
     ShieldCheck,
     Check,
} from "lucide-react";
import { loginUser } from "@/apis/loginUser";

const PHONE_REGEX = /^(\+8801|01)[3-9]\d{8}$/;

const REMEMBER_KEY = "sr.rememberedPhone";

const INITIAL_FORM = {
     phone: "",
     password: "",
};

function validateField(name, value) {
     switch (name) {
          case "phone":
               if (!value.trim()) return "Phone number is required";
               if (!PHONE_REGEX.test(value.trim()))
                    return "Enter a valid BD number, e.g. 01712345678";
               return "";

          case "password":
               if (!value) return "Password is required";
               if (value.length < 8)
                    return "Password must be at least 8 characters";
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
               <AlertCircle size={12} strokeWidth={2} className="shrink-0" />
               {message}
          </p>
     );
}

function FieldShell({ focused, invalid, children }) {
     return (
          <div
               className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 transition-all duration-150"
               style={{
                    background: focused
                         ? "rgba(255,255,255,0.075)"
                         : "rgba(255,255,255,0.05)",
                    border: `1px solid ${
                         invalid
                              ? "var(--danger)"
                              : focused
                                ? "var(--glass-border-strong)"
                                : "var(--glass-border)"
                    }`,
                    boxShadow:
                         focused && !invalid
                              ? "0 0 0 3px rgba(139, 92, 246, 0.14)"
                              : "none",
               }}
          >
               {children}
          </div>
     );
}

export default function Login() {
     const navigate = useRouter();
     const [form, setForm] = useState(INITIAL_FORM);
     const [errors, setErrors] = useState({});
     const [touched, setTouched] = useState({});
     const [focused, setFocused] = useState("");
     const [showPassword, setShowPassword] = useState(false);
     const [capsLock, setCapsLock] = useState(false);
     const [remember, setRemember] = useState(false);
     const [submitting, setSubmitting] = useState(false);
     const [status, setStatus] = useState(null);

     useEffect(() => {
          const saved = window.localStorage.getItem(REMEMBER_KEY);
          if (saved) {
               setForm((prev) => ({ ...prev, phone: saved }));
               setRemember(true);
          }
     }, []);

     const handleChange = (e) => {
          const { name, value } = e.target;
          setForm((prev) => ({ ...prev, [name]: value }));
          setStatus(null);

          if (touched[name]) {
               setErrors((prev) => ({
                    ...prev,
                    [name]: validateField(name, value),
               }));
          }
     };

     const handleBlur = (e) => {
          const { name, value } = e.target;
          setFocused("");
          setTouched((prev) => ({ ...prev, [name]: true }));
          setErrors((prev) => ({
               ...prev,
               [name]: validateField(name, value),
          }));
     };

     const runFullValidation = () => {
          const fields = ["phone", "password"];
          const nextErrors = {};
          fields.forEach((field) => {
               nextErrors[field] = validateField(field, form[field]);
          });
          setErrors(nextErrors);
          setTouched(Object.fromEntries(fields.map((f) => [f, true])));
          return Object.values(nextErrors).every((msg) => !msg);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          setStatus(null);

          if (!runFullValidation()) return;

          const payload = {
               phone: form.phone.trim(),
               password: form.password,
          };

          try {
               setSubmitting(true);
               const res = await loginUser(payload);

               if (!res.ok) {
                    setStatus({
                         type: "error",
                         message:
                              res.data?.message ||
                              "Incorrect phone number or password",
                    });
                    return;
               }

               if (remember) {
                    window.localStorage.setItem(REMEMBER_KEY, payload.phone);
               } else {
                    window.localStorage.removeItem(REMEMBER_KEY);
               }

               setStatus({ type: "ok", message: "Loggin in. Redirecting…" });
               setForm((prev) => ({ ...prev, password: "" }));
               setTimeout(() => navigate.push("/auth/profile"), 1200);
               console.log(`login successfully!`);
          } catch (err) {
               setStatus({
                    type: "error",
                    message:
                         err?.message ||
                         "Something went wrong. Please try again.",
               });
          } finally {
               setSubmitting(false);
          }
     };

     const phoneInvalid = Boolean(touched.phone && errors.phone);
     const passwordInvalid = Boolean(touched.password && errors.password);

     return (
          <div className="relative mx-auto w-full max-w-110 px-4 py-10 sm:py-16">
               <div className="glass-panel relative overflow-hidden rounded-2xl p-7">
                    <div className="mb-6">
                         <div
                              className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                              style={{
                                   background: "var(--thread-soft)",
                                   border: "1px solid var(--glass-border-strong)",
                              }}
                         >
                              <ShieldCheck
                                   size={18}
                                   strokeWidth={2}
                                   style={{ color: "var(--thread-violet)" }}
                              />
                         </div>

                         <h1
                              className="font-display text-[20px] font-semibold"
                              style={{ color: "var(--text-primary)" }}
                         >
                              Welcome back
                         </h1>
                         <p
                              className="mt-1 text-[12.5px]"
                              style={{ color: "var(--text-tertiary)" }}
                         >
                              Sign in to Smart Representative with your phone
                              number and password
                         </p>
                    </div>

                    <form
                         onSubmit={handleSubmit}
                         noValidate
                         className="flex flex-col gap-4"
                    >
                         {/* Phone */}
                         <div>
                              <label
                                   htmlFor="phone"
                                   className="mb-1.5 block text-[12.5px] font-medium"
                                   style={{ color: "var(--text-secondary)" }}
                              >
                                   Phone Number
                                   <span
                                        style={{ color: "var(--thread-pink)" }}
                                   >
                                        {" "}
                                        *
                                   </span>
                              </label>
                              <FieldShell
                                   focused={focused === "phone"}
                                   invalid={phoneInvalid}
                              >
                                   <Phone
                                        size={16}
                                        className="shrink-0"
                                        strokeWidth={2}
                                        style={{
                                             color:
                                                  focused === "phone"
                                                       ? "var(--text-secondary)"
                                                       : "var(--text-tertiary)",
                                        }}
                                   />
                                   <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={14}
                                        value={form.phone}
                                        onChange={handleChange}
                                        onFocus={() => setFocused("phone")}
                                        onBlur={handleBlur}
                                        placeholder="01712345678"
                                        autoComplete="tel"
                                        autoFocus
                                        aria-invalid={phoneInvalid}
                                        className="font-mono w-full bg-transparent text-[13.5px] tracking-[0.02em]"
                                        style={{
                                             color: "var(--text-primary)",
                                        }}
                                   />
                              </FieldShell>
                              <FieldError
                                   message={touched.phone && errors.phone}
                              />
                         </div>

                         {/* Password */}
                         <div>
                              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                                   <label
                                        htmlFor="password"
                                        className="block text-[12.5px] font-medium"
                                        style={{
                                             color: "var(--text-secondary)",
                                        }}
                                   >
                                        Password
                                        <span
                                             style={{
                                                  color: "var(--thread-pink)",
                                             }}
                                        >
                                             {" "}
                                             *
                                        </span>
                                   </label>
                                   <Link
                                        href="/auth/forgot-password"
                                        className="text-[11.5px] font-medium transition-colors hover:opacity-80"
                                        style={{
                                             color: "var(--thread-violet)",
                                        }}
                                   >
                                        Forgot password?
                                   </Link>
                              </div>

                              <FieldShell
                                   focused={focused === "password"}
                                   invalid={passwordInvalid}
                              >
                                   <Lock
                                        size={16}
                                        className="shrink-0"
                                        strokeWidth={2}
                                        style={{
                                             color:
                                                  focused === "password"
                                                       ? "var(--text-secondary)"
                                                       : "var(--text-tertiary)",
                                        }}
                                   />
                                   <input
                                        id="password"
                                        name="password"
                                        type={
                                             showPassword ? "text" : "password"
                                        }
                                        value={form.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocused("password")}
                                        onBlur={(e) => {
                                             setCapsLock(false);
                                             handleBlur(e);
                                        }}
                                        onKeyUp={(e) =>
                                             setCapsLock(
                                                  e.getModifierState?.(
                                                       "CapsLock",
                                                  ) ?? false,
                                             )
                                        }
                                        placeholder="Your password"
                                        autoComplete="current-password"
                                        aria-invalid={passwordInvalid}
                                        className="w-full bg-transparent text-[13.5px]"
                                        style={{
                                             color: "var(--text-primary)",
                                        }}
                                   />
                                   <button
                                        type="button"
                                        onClick={() =>
                                             setShowPassword((s) => !s)
                                        }
                                        aria-label={
                                             showPassword
                                                  ? "Hide password"
                                                  : "Show password"
                                        }
                                        className="shrink-0 cursor-pointer transition-colors hover:opacity-80"
                                        style={{
                                             color: "var(--text-tertiary)",
                                        }}
                                   >
                                        {showPassword ? (
                                             <EyeOff size={16} />
                                        ) : (
                                             <Eye size={16} />
                                        )}
                                   </button>
                              </FieldShell>

                              {capsLock && !passwordInvalid && (
                                   <p
                                        className="mt-1.5 flex items-center gap-1 text-[11.5px]"
                                        style={{ color: "var(--warn)" }}
                                   >
                                        <AlertCircle
                                             size={12}
                                             strokeWidth={2}
                                             className="shrink-0"
                                        />
                                        Caps Lock is on
                                   </p>
                              )}
                              <FieldError
                                   message={touched.password && errors.password}
                              />
                         </div>

                         {/* Remember my number */}
                         <button
                              type="button"
                              onClick={() => setRemember((r) => !r)}
                              aria-pressed={remember}
                              className="-ml-0.5 flex w-fit cursor-pointer items-center gap-2.5 text-[12.5px]"
                              style={{ color: "var(--text-secondary)" }}
                         >
                              <span
                                   className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md transition-all duration-150"
                                   style={{
                                        background: remember
                                             ? "var(--thread-soft)"
                                             : "rgba(255,255,255,0.05)",
                                        border: `1px solid ${remember ? "var(--glass-border-strong)" : "var(--glass-border)"}`,
                                   }}
                              >
                                   {remember && (
                                        <Check
                                             size={12}
                                             strokeWidth={3}
                                             style={{
                                                  color: "var(--thread-violet)",
                                             }}
                                        />
                                   )}
                              </span>
                              Remember my number
                         </button>

                         {status && (
                              <div
                                   role="status"
                                   aria-live="polite"
                                   className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12.5px]"
                                   style={
                                        status.type === "ok"
                                             ? {
                                                    background: "var(--ok-bg)",
                                                    color: "var(--ok)",
                                               }
                                             : {
                                                    background:
                                                         "var(--danger-bg)",
                                                    color: "var(--danger)",
                                               }
                                   }
                              >
                                   {status.type === "ok" ? (
                                        <CircleCheck
                                             size={14}
                                             strokeWidth={2}
                                             className="shrink-0"
                                        />
                                   ) : (
                                        <AlertCircle
                                             size={14}
                                             strokeWidth={2}
                                             className="shrink-0"
                                        />
                                   )}
                                   {status.message}
                              </div>
                         )}

                         <button
                              type="submit"
                              disabled={submitting}
                              className="group mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                              style={{ background: "var(--thread)" }}
                         >
                              {submitting ? (
                                   <>
                                        <Loader2
                                             size={16}
                                             className="animate-spin"
                                        />
                                        Loading...
                                   </>
                              ) : (
                                   <>
                                        Login
                                        <ArrowRight
                                             size={16}
                                             strokeWidth={2.25}
                                             className="transition-transform duration-150 group-hover:translate-x-0.5"
                                        />
                                   </>
                              )}
                         </button>
                    </form>

                    <div className="mt-6 flex items-center gap-3">
                         <span
                              className="h-px flex-1"
                              style={{ background: "var(--glass-border)" }}
                         />
                         <span
                              className="text-[11px] font-medium tracking-wide uppercase"
                              style={{ color: "var(--text-tertiary)" }}
                         >
                              New here
                         </span>
                         <span
                              className="h-px flex-1"
                              style={{ background: "var(--glass-border)" }}
                         />
                    </div>

                    <Link
                         href="/auth/register"
                         className="mt-4 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-medium transition-colors"
                         style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid var(--glass-border)",
                              color: "var(--text-secondary)",
                         }}
                    >
                         Create a distributor account
                         <ArrowRight size={13} strokeWidth={2.25} />
                    </Link>
               </div>

               <p
                    className="mt-5 text-center text-[11.5px]"
                    style={{ color: "var(--text-tertiary)" }}
               >
                    Trouble signing in? Contact your distribution admin.
               </p>
          </div>
     );
}
