"use client";

import { useState } from "react";
import Link from "next/link";
import {
     ArrowLeft,
     Building2,
     CheckCircle2,
     CircleAlert,
     Globe2,
     Image as ImageIcon,
     LoaderCircle,
     Mail,
     PenLine,
     Phone,
     Search,
     Save,
} from "lucide-react";
import { getCompany } from "@/apis/getCompany";
import { updateCompany } from "@/apis/updateCompany";
import Image from "next/image";

const EMPTY_FORM = {
     name: "",
     logo: "",
     description: "",
     website: "",
     phone: "",
     email: "",
     isActive: "active",
};

const extractCompany = (data) =>
     data?.company ?? data?.data?.company ?? data?.data ?? data;

export default function UpdateCompany() {
     const [searchName, setSearchName] = useState("");
     const [originalName, setOriginalName] = useState("");
     const [formData, setFormData] = useState(EMPTY_FORM);
     const [lookupLoading, setLookupLoading] = useState(false);
     const [saving, setSaving] = useState(false);
     const [error, setError] = useState("");
     const [success, setSuccess] = useState("");

     const handleSearch = async (event) => {
          event.preventDefault();
          const name = searchName.trim();
          if (!name) {
               setError("Enter the company name to load its details.");
               return;
          }

          setLookupLoading(true);
          setError("");
          setSuccess("");
          try {
               const response = await getCompany(name);
               if (!response?.ok) {
                    throw new Error(
                         response?.data?.message || "Company not found.",
                    );
               }
               const company = extractCompany(response.data);
               if (!company || typeof company !== "object") {
                    throw new Error("The company details could not be read.");
               }
               setOriginalName(company.name || name);
               setSearchName(company.name || name);
               setFormData({
                    name: company.name || "",
                    logo: company.logo || "",
                    description: company.description || "",
                    website: company.website || "",
                    phone: company.phone || "",
                    email: company.email || "",
                    isActive:
                         company.isActive === false ||
                         company.isActive === "inactive"
                              ? "inactive"
                              : "active",
               });
          } catch (err) {
               setOriginalName("");
               setFormData(EMPTY_FORM);
               setError(
                    err?.message ||
                         "We could not find that company. Check the name and try again.",
               );
          } finally {
               setLookupLoading(false);
          }
     };

     const handleChange = (event) => {
          const { name, value } = event.target;
          setFormData((current) => ({ ...current, [name]: value }));
          setSuccess("");
     };

     const handleSubmit = async (event) => {
          event.preventDefault();
          if (!originalName) return;
          if (!formData.name.trim() || !formData.phone.trim()) {
               setError("Company name and phone number are required.");
               return;
          }

          setSaving(true);
          setError("");
          setSuccess("");
          try {
               const response = await updateCompany(originalName, {
                    ...formData,
                    name: formData.name.trim(),
                    logo: formData.logo.trim(),
                    description: formData.description.trim(),
                    website: formData.website.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim(),
               });
               if (!response?.ok) {
                    throw new Error(
                         response?.data?.message || "Unable to update company.",
                    );
               }
               const updatedCompany = extractCompany(response.data);
               setOriginalName(updatedCompany?.name || formData.name.trim());
               setSearchName(updatedCompany?.name || formData.name.trim());
               setSuccess(
                    response?.data?.message ||
                         "Company details updated successfully.",
               );
          } catch (err) {
               setError(
                    err?.message ||
                         "Your changes could not be saved. Please try again.",
               );
          } finally {
               setSaving(false);
          }
     };

     const hasCompany = Boolean(originalName);

     return (
          <main className="relative min-h-screen flex-1 px-6 pb-10">
               <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -right-20 top-8 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
                    <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
               </div>

               <div className="mb-6 flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                         <Link
                              href="/companies"
                              aria-label="Back to companies"
                              className="glass-panel mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-(--text-secondary) transition-colors hover:bg-white/5 hover:text-(--text-primary)"
                         >
                              <ArrowLeft size={18} />
                         </Link>
                         <div>
                              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-tertiary)">
                                   Company directory
                              </p>
                              <h2 className="font-display text-3xl font-bold tracking-tight text-(--text-primary)">
                                   Update company
                              </h2>
                              <p className="mt-1.5 text-[13px] text-(--text-secondary)">
                                   Find a partner first, then edit its business
                                   details with confidence.
                              </p>
                         </div>
                    </div>
               </div>

               <section className="glass-panel mb-5 rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                         <div>
                              <div className="flex items-center gap-2 text-[13px] font-semibold text-(--text-primary)">
                                   <Search
                                        size={16}
                                        className="text-(--thread-pink)"
                                   />{" "}
                                   Find a company
                              </div>
                              <p className="mt-1 text-[12px] text-(--text-tertiary)">
                                   Your API searches by company name. Enter the
                                   saved name to load it.
                              </p>
                         </div>
                         <form
                              onSubmit={handleSearch}
                              className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
                         >
                              <label
                                   className="sr-only"
                                   htmlFor="company-search"
                              >
                                   Company name
                              </label>
                              <input
                                   id="company-search"
                                   value={searchName}
                                   onChange={(event) =>
                                        setSearchName(event.target.value)
                                   }
                                   placeholder="e.g. ACI Foods Ltd."
                                   className="min-w-0 flex-1 rounded-xl border bg-white/[0.035] px-3.5 py-2.5 text-[13px] text-(--text-primary)"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              />
                              <button
                                   disabled={lookupLoading}
                                   type="submit"
                                   className="inline-flex cursor-pointer shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
                                   style={{ background: "var(--thread)" }}
                              >
                                   {lookupLoading ? (
                                        <LoaderCircle
                                             size={16}
                                             className="animate-spin"
                                        />
                                   ) : (
                                        <Search size={16} />
                                   )}{" "}
                                   {lookupLoading ? "Searching" : "Search"}
                              </button>
                         </form>
                    </div>
               </section>

               {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-(--danger)/20 bg-(--danger-bg) px-4 py-3 text-[13px] text-(--danger)">
                         <CircleAlert size={18} className="mt-0.5 shrink-0" />
                         <p>{error}</p>
                    </div>
               )}
               {success && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-(--ok)/20 bg-(--ok-bg) px-4 py-3 text-[13px] text-(--ok)">
                         <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                         <p>{success}</p>
                    </div>
               )}

               {hasCompany ? (
                    <form
                         onSubmit={handleSubmit}
                         className="grid grid-cols-1 gap-5 xl:grid-cols-3"
                    >
                         <aside className="glass-panel h-fit rounded-2xl p-5 xl:col-span-1">
                              <div
                                   className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border bg-white/6 text-xl font-bold text-(--text-primary)"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   {formData.avatar ? (
                                        <Image
                                             src={formData.avatar}
                                             width={100}
                                             height={100}
                                             alt="Company logo preview"
                                             className="h-full w-full object-cover"
                                             onError={(event) => {
                                                  event.currentTarget.style.display =
                                                       "none";
                                             }}
                                        />
                                   ) : (
                                        <Building2
                                             size={27}
                                             className="text-(--thread-violet)"
                                        />
                                   )}
                              </div>
                              <h3 className="mt-4 font-display text-lg font-semibold text-(--text-primary)">
                                   {formData.name || "Untitled company"}
                              </h3>
                              <p className="mt-1 text-[12px] leading-5 text-(--text-tertiary)">
                                   Editing the record originally saved as{" "}
                                   <span className="font-medium text-(--text-secondary)">
                                        {originalName}
                                   </span>
                                   .
                              </p>
                              <div
                                   className="mt-5 border-t pt-4"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-(--text-tertiary)">
                                        Update note
                                   </p>
                                   <p className="mt-2 text-[12px] leading-5 text-(--text-secondary)">
                                        Changing the name is supported. Future
                                        searches will use the updated name after
                                        saving.
                                   </p>
                              </div>
                         </aside>

                         <section className="glass-panel rounded-2xl p-5 sm:p-6 xl:col-span-2">
                              <div
                                   className="mb-6 flex items-center justify-between gap-4 border-b pb-4"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <div>
                                        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-(--text-primary)">
                                             <PenLine
                                                  size={17}
                                                  className="text-(--thread-pink)"
                                             />{" "}
                                             Company details
                                        </h3>
                                        <p className="mt-1 text-[12px] text-(--text-tertiary)">
                                             Keep partner information accurate
                                             for your team.
                                        </p>
                                   </div>
                                   <span className="rounded-full bg-(--ok-bg) px-2.5 py-1 text-[11px] font-semibold text-(--ok)">
                                        Loaded
                                   </span>
                              </div>

                              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                   <Field
                                        label="Company name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        icon={Building2}
                                        placeholder="Company name"
                                   />
                                   <Field
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        icon={Phone}
                                        placeholder="+880 1XXX-XXXXXX"
                                   />
                                   <Field
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        icon={Mail}
                                        placeholder="team@company.com"
                                   />
                                   <Field
                                        label="Website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        icon={Globe2}
                                        placeholder="https://company.com"
                                   />
                                   <Field
                                        label="Logo URL"
                                        name="logo"
                                        value={formData.logo}
                                        onChange={handleChange}
                                        icon={ImageIcon}
                                        placeholder="https://…"
                                   />
                                   <div>
                                        <label
                                             htmlFor="isActive"
                                             className="mb-2 block text-[12px] font-medium text-(--text-secondary)"
                                        >
                                             Status
                                        </label>
                                        <select
                                             id="isActive"
                                             name="isActive"
                                             value={formData.isActive}
                                             onChange={handleChange}
                                             className="w-full rounded-xl border bg-white/[0.035] px-3.5 py-2.5 text-[13px] text-(--text-primary)"
                                             style={{
                                                  borderColor:
                                                       "var(--glass-border)",
                                             }}
                                        >
                                             <option value="active">
                                                  Active
                                             </option>
                                             <option value="inactive">
                                                  Inactive
                                             </option>
                                        </select>
                                   </div>
                                   <div className="md:col-span-2">
                                        <label
                                             htmlFor="description"
                                             className="mb-2 block text-[12px] font-medium text-(--text-secondary)"
                                        >
                                             Description
                                        </label>
                                        <textarea
                                             id="description"
                                             name="description"
                                             value={formData.description}
                                             onChange={handleChange}
                                             rows={4}
                                             placeholder="A short description of this company…"
                                             className="w-full resize-y rounded-xl border bg-white/[0.035] px-3.5 py-3 text-[13px] leading-5 text-(--text-primary)"
                                             style={{
                                                  borderColor:
                                                       "var(--glass-border)",
                                             }}
                                        />
                                   </div>
                              </div>

                              <div
                                   className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <button
                                        type="button"
                                        onClick={() => {
                                             setFormData(EMPTY_FORM);
                                             setOriginalName("");
                                             setSuccess("");
                                        }}
                                        className="text-left text-[12.5px] font-medium text-(--text-tertiary) hover:text-(--text-primary)"
                                   >
                                        Search for another company
                                   </button>
                                   <button
                                        disabled={saving}
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                                        style={{ background: "var(--thread)" }}
                                   >
                                        {saving ? (
                                             <LoaderCircle
                                                  size={16}
                                                  className="animate-spin"
                                             />
                                        ) : (
                                             <Save size={16} />
                                        )}{" "}
                                        {saving
                                             ? "Saving changes"
                                             : "Save changes"}
                                   </button>
                              </div>
                         </section>
                    </form>
               ) : (
                    <section className="glass-panel flex min-h-80 flex-col items-center justify-center rounded-2xl px-6 text-center">
                         <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-(--thread-violet)">
                              <Building2 size={26} />
                         </div>
                         <h3 className="mt-4 font-display text-xl font-semibold text-(--text-primary)">
                              Ready when you are
                         </h3>
                         <p className="mt-2 max-w-sm text-[13px] leading-6 text-(--text-secondary)">
                              Search for a company by name above. Its current
                              details will appear here for editing.
                         </p>
                    </section>
               )}
          </main>
     );
}

function Field({
     label,
     name,
     value,
     onChange,
     icon: Icon,
     type = "text",
     placeholder,
     required = false,
}) {
     return (
          <div>
               <label
                    htmlFor={name}
                    className="mb-2 block text-[12px] font-medium text-(--text-secondary)"
               >
                    {label}
                    {required && (
                         <span className="ml-1 text-(--danger)">*</span>
                    )}
               </label>
               <div className="relative">
                    <Icon
                         size={15}
                         className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
                    />
                    <input
                         id={name}
                         name={name}
                         type={type}
                         value={value}
                         onChange={onChange}
                         placeholder={placeholder}
                         required={required}
                         className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary)"
                         style={{ borderColor: "var(--glass-border)" }}
                    />
               </div>
          </div>
     );
}
