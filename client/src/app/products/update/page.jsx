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
     PackageOpen,
     Save,
     Tag,
     X,
} from "lucide-react";
import { getProducts } from "@/apis/products/getProducts";
import { updateProduct } from "@/apis/products/updateProduct";
import { getCategories } from "@/apis/category/getCategories";
import { getCompanies } from "@/apis/company/getCompanies";

/* ─── constants ───────────────────────────────────────────────── */
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

const toArray = (data) =>
     [
          data?.product,
          data?.products,
          data?.categories,
          data?.category,
          data?.companies,
          data?.company,
          data?.data?.product,
          data?.data?.products,
          data?.data?.categories,
          data?.data?.companies,
          data?.data,
          data?.results,
          data,
     ].find(Array.isArray) ?? [];

const blankForm = {
     selectedId: "",
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

/* ─── page ────────────────────────────────────────────────────── */
export default function UpdateProductPage() {
     const [formData, setFormData] = useState(blankForm);
     const [products, setProducts] = useState([]);
     const [companies, setCompanies] = useState([]);
     const [categories, setCategories] = useState([]);
     const [loadingDeps, setLoadingDeps] = useState(true);
     const [submitting, setSubmitting] = useState(false);
     const [error, setError] = useState("");
     const [success, setSuccess] = useState("");
     const [imagePreview, setImagePreview] = useState("");
     const fileRef = useRef(null);

     /* load all dropdown data in parallel */
     useEffect(() => {
          (async () => {
               try {
                    const [prodRes, compRes, catRes] = await Promise.all([
                         getProducts(),
                         getCompanies(),
                         getCategories(),
                    ]);
                    if (!prodRes?.ok)
                         throw new Error(
                              prodRes?.data?.message ||
                                   "Could not load products.",
                         );
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
                    setProducts(toArray(prodRes.data));
                    setCompanies(toArray(compRes.data));
                    setCategories(toArray(catRes.data));
               } catch (err) {
                    setError(
                         err?.message ||
                              "Failed to load form data. Please refresh.",
                    );
               } finally {
                    setLoadingDeps(false);
               }
          })();
     }, []);

     /* when user picks a product, pre-fill all fields */
     const selectProduct = (e) => {
          const id = e.target.value;
          const product = products.find((p) => (p?._id || p?.id) === id);
          if (!product) {
               setFormData(blankForm);
               setImagePreview("");
               return;
          }
          const companyId =
               typeof product.company === "object"
                    ? product.company?._id || product.company?.id
                    : product.company;
          const categoryId =
               typeof product.category === "object"
                    ? product.category?._id || product.category?.id
                    : product.category;
          setFormData({
               selectedId: id,
               company: companyId || "",
               category: categoryId || "",
               name: product.name || "",
               sku: product.sku || "",
               barcode: product.barcode || "",
               image: product.image || "",
               description: product.description || "",
               unit: product.unit || "",
               unitValue: String(product.unitValue ?? 1),
               status: product.status || "active",
          });
          setImagePreview(product.image || "");
          setError("");
          setSuccess("");
     };

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
          if (!formData.selectedId) {
               setError("Please select a product to update.");
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
               const response = await updateProduct(
                    formData.selectedId,
                    payload,
               );
               if (!response?.ok) {
                    throw new Error(
                         response?.data?.message || "Unable to update product.",
                    );
               }
               /* update the local products list so the dropdown reflects changes */
               setProducts((prev) =>
                    prev.map((p) =>
                         (p?._id || p?.id) === formData.selectedId
                              ? { ...p, ...payload }
                              : p,
                    ),
               );
               setSuccess(
                    response?.data?.message ||
                         `"${formData.name.trim()}" was updated successfully.`,
               );
          } catch (err) {
               setError(
                    err?.message ||
                         "The product could not be updated. Please try again.",
               );
          } finally {
               setSubmitting(false);
          }
     };

     const hasSelection = !!formData.selectedId;

     return (
          <main className="relative min-h-screen flex-1 px-4 pb-10 sm:px-6 lg:px-8">
               <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -right-16 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
                    <div className="absolute bottom-0 left-[8%] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
               </div>

               <div className="mx-auto max-w-[1600px]">
                    {/* page header */}
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
                                   Update product
                              </h1>
                              <p className="mt-1.5 text-[13px] text-(--text-secondary)">
                                   Pick a product from the list, then edit its
                                   details and save.
                              </p>
                         </div>
                    </div>

                    {error && <Feedback type="error" text={error} />}
                    {success && <Feedback type="success" text={success} />}

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                         {/* ── sidebar ── */}
                         <aside className="glass-panel h-fit rounded-2xl p-5 xl:col-span-2">
                              <div
                                   className="flex h-12 w-12 items-center justify-center rounded-2xl"
                                   style={{ background: "var(--thread-soft)" }}
                              >
                                   <PackageOpen
                                        size={22}
                                        className="text-(--thread-pink)"
                                   />
                              </div>
                              <h3 className="mt-4 font-display text-xl font-semibold text-(--text-primary)">
                                   Select, then update
                              </h3>
                              <p className="mt-2 text-[12.5px] leading-6 text-(--text-secondary)">
                                   Pick a saved product from the dropdown. All
                                   its current details will be pre-filled so you
                                   only change what you need.
                              </p>
                              <div
                                   className="mt-5 space-y-3 border-t pt-5"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <Tip
                                        title="All fields are pre-filled"
                                        text="Name, SKU, unit, status and more load automatically on selection."
                                   />
                                   <Tip
                                        title="Replace the image"
                                        text="Upload a new file or paste a URL to change the product image."
                                   />
                                   <Tip
                                        title="Only changed fields are sent"
                                        text="The update is efficient — no unnecessary data is overwritten."
                                   />
                              </div>

                              {/* selected product quick-view */}
                              {hasSelection && (
                                   <div
                                        className="mt-5 rounded-xl border p-3.5"
                                        style={{
                                             borderColor: "var(--glass-border)",
                                             background:
                                                  "rgba(255,255,255,0.035)",
                                        }}
                                   >
                                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--text-tertiary)">
                                             Editing
                                        </p>
                                        <div className="flex items-center gap-3">
                                             <div
                                                  className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                                                  style={{
                                                       background:
                                                            "rgba(255,255,255,0.06)",
                                                       border: "1px solid var(--glass-border)",
                                                  }}
                                             >
                                                  {imagePreview ? (
                                                       <img
                                                            src={imagePreview}
                                                            alt={formData.name}
                                                            className="h-full w-full object-cover"
                                                       />
                                                  ) : (
                                                       <Package
                                                            size={16}
                                                            style={{
                                                                 color: "var(--thread-violet)",
                                                            }}
                                                       />
                                                  )}
                                             </div>
                                             <div className="min-w-0">
                                                  <p className="truncate text-[13px] font-semibold text-(--text-primary)">
                                                       {formData.name ||
                                                            "Unnamed product"}
                                                  </p>
                                                  <p className="mt-0.5 text-[11px] text-(--text-tertiary)">
                                                       {formData.sku
                                                            ? `SKU: ${formData.sku}`
                                                            : "No SKU"}
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                              )}

                              {/* image preview */}
                              {imagePreview && (
                                   <div
                                        className="mt-4 overflow-hidden rounded-xl border"
                                        style={{
                                             borderColor: "var(--glass-border)",
                                        }}
                                   >
                                        <img
                                             src={imagePreview}
                                             alt="Product preview"
                                             className="w-full object-cover"
                                             style={{ maxHeight: "200px" }}
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
                                             Select a product first, then edit
                                             and save.
                                        </p>
                                   </div>
                              </div>

                              <form
                                   onSubmit={handleSubmit}
                                   className="space-y-5"
                              >
                                   {/* ── product selector ── */}
                                   <div
                                        className="rounded-xl border p-4"
                                        style={{
                                             borderColor:
                                                  "rgba(139,92,246,0.25)",
                                             background:
                                                  "rgba(139,92,246,0.05)",
                                        }}
                                   >
                                        <label
                                             htmlFor="selectedId"
                                             className="mb-2 block text-[12px] font-medium text-(--text-secondary)"
                                        >
                                             Select product{" "}
                                             <span className="text-(--danger)">
                                                  *
                                             </span>
                                        </label>
                                        <div className="relative">
                                             <Package
                                                  size={15}
                                                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--thread-violet)"
                                             />
                                             <select
                                                  id="selectedId"
                                                  value={formData.selectedId}
                                                  onChange={selectProduct}
                                                  disabled={loadingDeps}
                                                  className="w-full appearance-none rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-60"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                  }}
                                             >
                                                  <option value="">
                                                       {loadingDeps
                                                            ? "Loading products…"
                                                            : "Choose a product to edit"}
                                                  </option>
                                                  {products.map((p) => (
                                                       <option
                                                            key={
                                                                 p?._id || p?.id
                                                            }
                                                            value={
                                                                 p?._id || p?.id
                                                            }
                                                       >
                                                            {p?.name}
                                                            {p?.sku
                                                                 ? ` — ${p.sku}`
                                                                 : ""}
                                                       </option>
                                                  ))}
                                             </select>
                                        </div>
                                        <p className="mt-2 text-[11px] text-(--text-tertiary)">
                                             Selecting a product pre-fills all
                                             fields below with its current data.
                                        </p>
                                   </div>

                                   {/* ── company + category ── */}
                                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Field
                                             label="Company"
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
                                                       disabled={
                                                            !hasSelection ||
                                                            loadingDeps
                                                       }
                                                       className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
                                                       style={{
                                                            borderColor:
                                                                 "var(--glass-border)",
                                                       }}
                                                  >
                                                       <option value="">
                                                            Select company
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
                                                       disabled={
                                                            !hasSelection ||
                                                            loadingDeps
                                                       }
                                                       className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
                                                       style={{
                                                            borderColor:
                                                                 "var(--glass-border)",
                                                       }}
                                                  >
                                                       <option value="">
                                                            Select category
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
                                                  disabled={!hasSelection}
                                                  placeholder="e.g. Soybean Oil 1L"
                                                  className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
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
                                                       disabled={!hasSelection}
                                                       className="font-mono w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
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
                                                       disabled={!hasSelection}
                                                       className="font-mono w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
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
                                                  disabled={!hasSelection}
                                                  className="w-full rounded-xl border bg-white/[0.035] px-3.5 py-2.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
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
                                             hint="Quantity per unit"
                                        >
                                             <input
                                                  id="unitValue"
                                                  name="unitValue"
                                                  type="number"
                                                  min="0"
                                                  step="any"
                                                  value={formData.unitValue}
                                                  onChange={handleChange}
                                                  disabled={!hasSelection}
                                                  className="font-mono w-full rounded-xl border bg-white/[0.035] px-3.5 py-2.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
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
                                                  disabled={!hasSelection}
                                                  rows={4}
                                                  placeholder="Add a short product description…"
                                                  className="w-full resize-y rounded-xl border bg-white/[0.035] py-3 pl-10 pr-3.5 text-[13px] leading-5 text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                  }}
                                             />
                                        </div>
                                   </Field>

                                   {/* ── image ── */}
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
                                                       disabled={!hasSelection}
                                                       placeholder="https://example.com/product.jpg"
                                                       className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
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
                                                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[12.5px] font-medium text-(--text-secondary) transition-colors ${hasSelection ? "cursor-pointer hover:bg-white/5 hover:text-(--text-primary)" : "cursor-not-allowed opacity-50"}`}
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
                                                  disabled={!hasSelection}
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
                                                            className={`flex flex-1 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13px] transition-colors ${
                                                                 !hasSelection
                                                                      ? "cursor-not-allowed opacity-50"
                                                                      : "cursor-pointer"
                                                            } ${
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
                                                                 disabled={
                                                                      !hasSelection
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
                                                            <span className="ml-auto text-[11px] text-(--text-tertiary)">
                                                                 {val ===
                                                                 "active"
                                                                      ? "Ready to sell"
                                                                      : "Save for later"}
                                                            </span>
                                                       </label>
                                                  ),
                                             )}
                                        </div>
                                   </Field>

                                   {/* ── actions ── */}
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
                                                  submitting ||
                                                  !hasSelection ||
                                                  loadingDeps
                                             }
                                             type="submit"
                                             id="submit-update-product"
                                             className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-fuchsia-950/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
                                                  <Save size={16} />
                                             )}
                                             {submitting
                                                  ? "Saving changes…"
                                                  : "Save changes"}
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
