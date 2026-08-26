"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
     ArrowLeft,
     Barcode,
     Box,
     Building2,
     CheckCircle2,
     CircleAlert,
     FileText,
     Hash,
     ImagePlus,
     LoaderCircle,
     Package,
     PackagePlus,
     Tag,
     X,
} from "lucide-react";
import { addProduct } from "@/apis/products/addProduct";
import { getCategories } from "@/apis/category/getCategories";
import { getCompanies } from "@/apis/company/getCompanies";

const toArray = (data) =>
     [
          data?.products,
          data?.product,
          data?.categories,
          data?.category,
          data?.companies,
          data?.company,
          data?.data?.products,
          data?.data?.categories,
          data?.data?.companies,
          data?.data,
          data?.results,
          data,
     ].find(Array.isArray) ?? [];

const UNITS = [
     { value: "pcs", label: "Pcs — pieces" },
     { value: "box", label: "Box" },
     { value: "packet", label: "Packet" },
     { value: "carton", label: "Carton" },
     { value: "kg", label: "Kg — kilogram" },
     { value: "gm", label: "Gm — gram" },
     { value: "ltr", label: "Ltr — litre" },
     { value: "ml", label: "mL — millilitre" },
];

const initialForm = {
     company: "",
     category: "",
     name: "",
     sku: "",
     barcode: "",
     image: "",
     description: "",
     unit: "",
     unitValue: "1",
     status: "active",
};

export default function AddProductPage() {
     const [formData, setFormData] = useState(initialForm);
     const [companies, setCompanies] = useState([]);
     const [categories, setCategories] = useState([]);
     const [loadingDeps, setLoadingDeps] = useState(true);
     const [depsError, setDepsError] = useState("");
     const [submitting, setSubmitting] = useState(false);
     const [error, setError] = useState("");
     const [success, setSuccess] = useState("");
     const [imagePreview, setImagePreview] = useState("");
     const fileRef = useRef(null);

     useEffect(() => {
          (async () => {
               try {
                    const [compRes, catRes] = await Promise.all([
                         getCompanies(),
                         getCategories(),
                    ]);
                    if (!compRes?.ok)
                         throw new Error(
                              compRes?.data?.message ||
                                   "Could not load companies.",
                         );
                    if (!catRes?.ok)
                         throw new Error(
                              catRes?.data?.message ||
                                   "Could not load categories.",
                         );
                    setCompanies(toArray(compRes.data));
                    setCategories(toArray(catRes.data));
               } catch (err) {
                    setDepsError(
                         err?.message ||
                              "Failed to load form options. Please refresh.",
                    );
               } finally {
                    setLoadingDeps(false);
               }
          })();
     }, []);

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
          setError("");
          setSuccess("");
     };

     const handleImageFile = (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
               const src = ev.target.result;
               setImagePreview(src);
               setFormData((prev) => ({ ...prev, image: src }));
          };
          reader.readAsDataURL(file);
     };

     const clearImage = () => {
          setImagePreview("");
          setFormData((prev) => ({ ...prev, image: "" }));
          if (fileRef.current) fileRef.current.value = "";
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!formData.company) {
               setError("Please select a company.");
               return;
          }
          if (!formData.category) {
               setError("Please select a category.");
               return;
          }
          if (!formData.name.trim()) {
               setError("Product name is required.");
               return;
          }
          if (!formData.unit) {
               setError("Please choose a unit.");
               return;
          }

          setSubmitting(true);
          setError("");
          setSuccess("");
          try {
               const payload = {
                    company: formData.company,
                    category: formData.category,
                    name: formData.name.trim(),
                    sku: formData.sku.trim(),
                    barcode: formData.barcode.trim(),
                    image: formData.image,
                    description: formData.description.trim(),
                    unit: formData.unit,
                    unitValue: Number(formData.unitValue) || 1,
                    status: formData.status,
               };
               const response = await addProduct(payload);
               if (!response?.ok) {
                    throw new Error(
                         response?.data?.message || "Unable to create product.",
                    );
               }
               setSuccess(
                    response?.data?.message ||
                         `"${formData.name.trim()}" was added successfully.`,
               );
               setFormData(initialForm);
               setImagePreview("");
          } catch (err) {
               setError(
                    err?.message ||
                         "The product could not be created. Please try again.",
               );
          } finally {
               setSubmitting(false);
          }
     };

     return (
          <main className="relative min-h-screen flex-1 px-4 pb-10 sm:px-6 lg:px-8">
               <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -right-16 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
                    <div className="absolute bottom-0 left-[8%] h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
               </div>

               <div className="mx-auto max-w-[1600px]">
                    <div className="mb-7 flex items-start gap-3 pt-1">
                         <Link
                              href="/products"
                              aria-label="Back to products"
                              className="glass-panel mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-(--text-secondary) transition-colors hover:bg-white/5 hover:text-(--text-primary)"
                         >
                              <ArrowLeft size={18} />
                         </Link>
                         <div>
                              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-tertiary)">
                                   Product catalog
                              </p>
                              <h1 className="font-display text-3xl font-bold tracking-tight text-(--text-primary)">
                                   Add a product
                              </h1>
                              <p className="mt-1.5 text-[13px] text-(--text-secondary)">
                                   Fill in the details below to register a new
                                   product in the catalog.
                              </p>
                         </div>
                    </div>

                    {loadingDeps && (
                         <div className="mb-6 flex items-center gap-2 text-[13px] text-(--text-tertiary)">
                              <LoaderCircle
                                   size={16}
                                   className="animate-spin text-(--thread-pink)"
                              />
                              Loading companies and categories…
                         </div>
                    )}

                    {depsError && <Feedback type="error" text={depsError} />}

                    {error && <Feedback type="error" text={error} />}
                    {success && <Feedback type="success" text={success} />}

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                         <aside className="glass-panel h-fit rounded-2xl p-5 xl:col-span-2">
                              <div
                                   className="flex h-12 w-12 items-center justify-center rounded-2xl"
                                   style={{ background: "var(--thread-soft)" }}
                              >
                                   <PackagePlus
                                        size={22}
                                        className="text-(--thread-pink)"
                                   />
                              </div>
                              <h3 className="mt-4 font-display text-xl font-semibold text-(--text-primary)">
                                   What makes a great product entry?
                              </h3>
                              <p className="mt-2 text-[12.5px] leading-6 text-(--text-secondary)">
                                   Accurate product data keeps orders, stock
                                   alerts, and reporting reliable for everyone
                                   on your team.
                              </p>
                              <div
                                   className="mt-5 space-y-3 border-t pt-5"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <Tip
                                        title="Use a specific name"
                                        text="Include the variant — e.g. 'Soybean Oil 1L' instead of just 'Oil'."
                                   />
                                   <Tip
                                        title="Set a unique SKU"
                                        text="Your SKU ties this product to orders and stock records. Keep it consistent."
                                   />
                                   <Tip
                                        title="Pick the right unit"
                                        text="Unit and unit value define how quantities are displayed in orders."
                                   />
                                   <Tip
                                        title="Add a barcode"
                                        text="If your product has a barcode, entering it enables quick scanning in the field."
                                   />
                              </div>

                              {imagePreview && (
                                   <div
                                        className="mt-5 overflow-hidden rounded-xl border"
                                        style={{
                                             borderColor: "var(--glass-border)",
                                        }}
                                   >
                                        <img
                                             src={imagePreview}
                                             alt="Product preview"
                                             className="w-full object-cover"
                                             style={{ maxHeight: "220px" }}
                                        />
                                        <div className="flex items-center justify-between px-3 py-2">
                                             <p className="text-[11px] text-(--text-tertiary)">
                                                  Image preview
                                             </p>
                                             <button
                                                  type="button"
                                                  onClick={clearImage}
                                                  className="rounded p-1 text-(--danger) hover:bg-(--danger-bg)"
                                             >
                                                  <X size={13} />
                                             </button>
                                        </div>
                                   </div>
                              )}
                         </aside>

                         {/* ── main form ── */}
                         <section className="glass-panel rounded-2xl p-5 sm:p-6 xl:col-span-3">
                              {/* form header */}
                              <div
                                   className="mb-6 flex items-center gap-3 border-b pb-4"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-(--thread-violet)">
                                        <Package size={18} />
                                   </div>
                                   <div>
                                        <h2 className="font-display text-lg font-semibold text-(--text-primary)">
                                             Product details
                                        </h2>
                                        <p className="mt-0.5 text-[12px] text-(--text-tertiary)">
                                             Fields marked{" "}
                                             <span className="text-(--danger)">
                                                  *
                                             </span>{" "}
                                             are required.
                                        </p>
                                   </div>
                              </div>

                              <form
                                   onSubmit={handleSubmit}
                                   className="space-y-5"
                              >
                                   {/* ── row 1: company + category ── */}
                                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Field
                                             label="Company"
                                             required
                                             htmlFor="company"
                                        >
                                             <div className="relative">
                                                  <Building2
                                                       size={15}
                                                       className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
                                                  />
                                                  <select
                                                       id="company"
                                                       name="company"
                                                       value={formData.company}
                                                       onChange={handleChange}
                                                       disabled={loadingDeps}
                                                       className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:opacity-50"
                                                       style={{
                                                            borderColor:
                                                                 "var(--glass-border)",
                                                       }}
                                                  >
                                                       <option value="">
                                                            {loadingDeps
                                                                 ? "Loading…"
                                                                 : "Select company"}
                                                       </option>
                                                       {companies.map((c) => (
                                                            <option
                                                                 key={
                                                                      c._id ||
                                                                      c.id
                                                                 }
                                                                 value={
                                                                      c._id ||
                                                                      c.id
                                                                 }
                                                            >
                                                                 {c.name}
                                                            </option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </Field>

                                        <Field
                                             label="Category"
                                             required
                                             htmlFor="category"
                                        >
                                             <div className="relative">
                                                  <Tag
                                                       size={15}
                                                       className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
                                                  />
                                                  <select
                                                       id="category"
                                                       name="category"
                                                       value={formData.category}
                                                       onChange={handleChange}
                                                       disabled={loadingDeps}
                                                       className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:opacity-50"
                                                       style={{
                                                            borderColor:
                                                                 "var(--glass-border)",
                                                       }}
                                                  >
                                                       <option value="">
                                                            {loadingDeps
                                                                 ? "Loading…"
                                                                 : "Select category"}
                                                       </option>
                                                       {categories.map((c) => (
                                                            <option
                                                                 key={
                                                                      c._id ||
                                                                      c.id
                                                                 }
                                                                 value={
                                                                      c._id ||
                                                                      c.id
                                                                 }
                                                            >
                                                                 {c.name}
                                                            </option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </Field>
                                   </div>

                                   {/* ── product name ── */}
                                   <Field
                                        label="Product name"
                                        required
                                        htmlFor="name"
                                   >
                                        <div className="relative">
                                             <Box
                                                  size={15}
                                                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
                                             />
                                             <input
                                                  id="name"
                                                  name="name"
                                                  value={formData.name}
                                                  onChange={handleChange}
                                                  placeholder="e.g. Soybean Oil 1L"
                                                  required
                                                  className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary)"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                  }}
                                             />
                                        </div>
                                   </Field>

                                   {/* ── SKU + barcode ── */}
                                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Field label="SKU" htmlFor="sku">
                                             <div className="relative">
                                                  <Hash
                                                       size={15}
                                                       className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
                                                  />
                                                  <input
                                                       id="sku"
                                                       name="sku"
                                                       value={formData.sku}
                                                       onChange={handleChange}
                                                       placeholder="e.g. RUP-OIL-1L"
                                                       className="font-mono w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary)"
                                                       style={{
                                                            borderColor:
                                                                 "var(--glass-border)",
                                                       }}
                                                  />
                                             </div>
                                        </Field>

                                        <Field
                                             label="Barcode"
                                             htmlFor="barcode"
                                        >
                                             <div className="relative">
                                                  <Barcode
                                                       size={15}
                                                       className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
                                                  />
                                                  <input
                                                       id="barcode"
                                                       name="barcode"
                                                       value={formData.barcode}
                                                       onChange={handleChange}
                                                       placeholder="e.g. 8901234567890"
                                                       className="font-mono w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary)"
                                                       style={{
                                                            borderColor:
                                                                 "var(--glass-border)",
                                                       }}
                                                  />
                                             </div>
                                        </Field>
                                   </div>

                                   {/* ── unit + unitValue ── */}
                                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Field
                                             label="Unit"
                                             required
                                             htmlFor="unit"
                                        >
                                             <select
                                                  id="unit"
                                                  name="unit"
                                                  value={formData.unit}
                                                  onChange={handleChange}
                                                  className="w-full rounded-xl border bg-white/[0.035] px-3.5 py-2.5 text-[13px] text-(--text-primary)"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                  }}
                                             >
                                                  <option value="">
                                                       Select unit
                                                  </option>
                                                  {UNITS.map((u) => (
                                                       <option
                                                            key={u.value}
                                                            value={u.value}
                                                       >
                                                            {u.label}
                                                       </option>
                                                  ))}
                                             </select>
                                        </Field>

                                        <Field
                                             label="Unit value"
                                             htmlFor="unitValue"
                                             hint="Quantity per unit (default 1)"
                                        >
                                             <input
                                                  id="unitValue"
                                                  name="unitValue"
                                                  type="number"
                                                  min="0"
                                                  step="any"
                                                  value={formData.unitValue}
                                                  onChange={handleChange}
                                                  placeholder="1"
                                                  className="font-mono w-full rounded-xl border bg-white/[0.035] px-3.5 py-2.5 text-[13px] text-(--text-primary)"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                  }}
                                             />
                                        </Field>
                                   </div>

                                   {/* ── description ── */}
                                   <Field
                                        label="Description"
                                        optional
                                        htmlFor="description"
                                   >
                                        <div className="relative">
                                             <FileText
                                                  size={15}
                                                  className="pointer-events-none absolute left-3.5 top-3.5 text-(--text-tertiary)"
                                             />
                                             <textarea
                                                  id="description"
                                                  name="description"
                                                  value={formData.description}
                                                  onChange={handleChange}
                                                  rows={4}
                                                  placeholder="Add a short product description…"
                                                  className="w-full resize-y rounded-xl border bg-white/[0.035] py-3 pl-10 pr-3.5 text-[13px] leading-5 text-(--text-primary)"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                  }}
                                             />
                                        </div>
                                   </Field>

                                   {/* ── image URL + upload ── */}
                                   <Field
                                        label="Product image"
                                        optional
                                        htmlFor="image"
                                   >
                                        <div className="space-y-2">
                                             <div className="relative">
                                                  <ImagePlus
                                                       size={15}
                                                       className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
                                                  />
                                                  <input
                                                       id="image"
                                                       name="image"
                                                       value={
                                                            formData.image.startsWith(
                                                                 "data:",
                                                            )
                                                                 ? ""
                                                                 : formData.image
                                                       }
                                                       onChange={(e) => {
                                                            handleChange(e);
                                                            if (
                                                                 !e.target.value.startsWith(
                                                                      "data:",
                                                                 )
                                                            )
                                                                 setImagePreview(
                                                                      e.target
                                                                           .value,
                                                                 );
                                                       }}
                                                       placeholder="https://example.com/product.jpg"
                                                       className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary)"
                                                       style={{
                                                            borderColor:
                                                                 "var(--glass-border)",
                                                       }}
                                                  />
                                             </div>
                                             <div className="flex items-center gap-3">
                                                  <div
                                                       className="h-px flex-1"
                                                       style={{
                                                            background:
                                                                 "var(--glass-border)",
                                                       }}
                                                  />
                                                  <span className="text-[11px] text-(--text-tertiary)">
                                                       or upload
                                                  </span>
                                                  <div
                                                       className="h-px flex-1"
                                                       style={{
                                                            background:
                                                                 "var(--glass-border)",
                                                       }}
                                                  />
                                             </div>
                                             <label
                                                  htmlFor="imageFile"
                                                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-[12.5px] font-medium text-(--text-secondary) transition-colors hover:bg-white/5 hover:text-(--text-primary)"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                       borderStyle: "dashed",
                                                  }}
                                             >
                                                  <ImagePlus size={14} />
                                                  {imagePreview
                                                       ? "Replace image"
                                                       : "Choose a file…"}
                                             </label>
                                             <input
                                                  id="imageFile"
                                                  type="file"
                                                  accept="image/*"
                                                  ref={fileRef}
                                                  onChange={handleImageFile}
                                                  className="sr-only"
                                             />
                                        </div>
                                   </Field>

                                   {/* ── status ── */}
                                   <Field label="Status" htmlFor="status">
                                        <div className="flex gap-3">
                                             {["active", "inactive"].map(
                                                  (val) => (
                                                       <label
                                                            key={val}
                                                            className={`flex flex-1 cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13px] transition-colors ${
                                                                 formData.status ===
                                                                 val
                                                                      ? "border-violet-500/40 bg-violet-500/10 text-(--text-primary)"
                                                                      : "border-(--glass-border) bg-white/[0.035] text-(--text-secondary)"
                                                            }`}
                                                       >
                                                            <input
                                                                 type="radio"
                                                                 name="status"
                                                                 value={val}
                                                                 checked={
                                                                      formData.status ===
                                                                      val
                                                                 }
                                                                 onChange={
                                                                      handleChange
                                                                 }
                                                                 className="sr-only"
                                                            />
                                                            <span
                                                                 className="h-2 w-2 rounded-full"
                                                                 style={{
                                                                      background:
                                                                           val ===
                                                                           "active"
                                                                                ? "var(--ok)"
                                                                                : "var(--text-tertiary)",
                                                                 }}
                                                            />
                                                            <span className="capitalize font-medium">
                                                                 {val}
                                                            </span>
                                                            {val ===
                                                                 "active" && (
                                                                 <span className="ml-auto text-[11px] text-(--text-tertiary)">
                                                                      Ready to
                                                                      sell
                                                                 </span>
                                                            )}
                                                            {val ===
                                                                 "inactive" && (
                                                                 <span className="ml-auto text-[11px] text-(--text-tertiary)">
                                                                      Save for
                                                                      later
                                                                 </span>
                                                            )}
                                                       </label>
                                                  ),
                                             )}
                                        </div>
                                   </Field>

                                   {/* ── form actions ── */}
                                   <div
                                        className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
                                        style={{
                                             borderColor: "var(--glass-border)",
                                        }}
                                   >
                                        <Link
                                             href="/products"
                                             className="text-[12.5px] font-medium text-(--text-tertiary) transition-colors hover:text-(--text-primary)"
                                        >
                                             Cancel and return
                                        </Link>
                                        <button
                                             disabled={
                                                  submitting || loadingDeps
                                             }
                                             type="submit"
                                             id="submit-add-product"
                                             className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-fuchsia-950/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                                             style={{
                                                  background: "var(--thread)",
                                             }}
                                        >
                                             {submitting ? (
                                                  <LoaderCircle
                                                       size={16}
                                                       className="animate-spin"
                                                  />
                                             ) : (
                                                  <PackagePlus size={16} />
                                             )}
                                             {submitting
                                                  ? "Adding product…"
                                                  : "Add product"}
                                        </button>
                                   </div>
                              </form>
                         </section>
                    </div>
               </div>
          </main>
     );
}

function Field({ label, htmlFor, required, optional, hint, children }) {
     return (
          <div>
               <label
                    htmlFor={htmlFor}
                    className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-(--text-secondary)"
               >
                    {label}
                    {required && <span className="text-(--danger)">*</span>}
                    {optional && (
                         <span className="text-(--text-tertiary)">
                              (optional)
                         </span>
                    )}
                    {hint && (
                         <span className="ml-auto text-[11px] font-normal text-(--text-tertiary)">
                              {hint}
                         </span>
                    )}
               </label>
               {children}
          </div>
     );
}

function Feedback({ type, text }) {
     const isError = type === "error";
     const Icon = isError ? CircleAlert : CheckCircle2;
     return (
          <div
               className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-[13px] ${
                    isError
                         ? "border-(--danger)/20 bg-(--danger-bg) text-(--danger)"
                         : "border-(--ok)/20 bg-(--ok-bg) text-(--ok)"
               }`}
          >
               <Icon size={18} className="mt-0.5 shrink-0" />
               <p>{text}</p>
          </div>
     );
}

function Tip({ title, text }) {
     return (
          <div className="flex gap-2.5">
               <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--thread-pink)" />
               <div>
                    <p className="text-[12px] font-semibold text-(--text-primary)">
                         {title}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-5 text-(--text-tertiary)">
                         {text}
                    </p>
               </div>
          </div>
     );
}
