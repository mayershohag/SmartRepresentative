"use client";

import { useState } from "react";
import Link from "next/link";
import {
     ArrowLeft,
     CheckCircle2,
     CircleAlert,
     FileText,
     FolderPlus,
     LoaderCircle,
     Plus,
     Tag,
} from "lucide-react";
import { addCategory } from "@/apis/category/addCategory";

const initialForm = { name: "", description: "", isActive: "active" };

export default function AddCategory() {
     const [formData, setFormData] = useState(initialForm);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState("");
     const [success, setSuccess] = useState("");

     const handleChange = (event) => {
          const { name, value } = event.target;
          setFormData((current) => ({ ...current, [name]: value }));
          setError("");
          setSuccess("");
     };

     const handleSubmit = async (event) => {
          event.preventDefault();
          if (!formData.name.trim()) {
               setError("Category name is required.");
               return;
          }

          setLoading(true);
          setError("");
          try {
               const response = await addCategory({
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    isActive: formData.isActive,
               });
               if (!response?.ok) {
                    throw new Error(
                         response?.data?.message ||
                              "Unable to create category.",
                    );
               }
               setSuccess(
                    response?.data?.message ||
                         `${formData.name.trim()} was added successfully.`,
               );
               setFormData(initialForm);
          } catch (err) {
               setError(
                    err?.message ||
                         "The category could not be created. Please try again.",
               );
          } finally {
               setLoading(false);
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
                         href="/category"
                         aria-label="Back to categories"
                         className="glass-panel mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-(--text-secondary) transition-colors hover:bg-white/5 hover:text-(--text-primary)"
                    >
                         <ArrowLeft size={18} />
                    </Link>
                    <div>
                         <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-tertiary)">
                              Catalog organization
                         </p>
                         <h2 className="font-display text-3xl font-bold tracking-tight text-(--text-primary)">
                              Add a category
                         </h2>
                         <p className="mt-1.5 text-[13px] text-(--text-secondary)">
                              Create clear groups that make your product catalog
                              easier to browse.
                         </p>
                    </div>
               </div>

               {error && <Feedback type="error" text={error} />}
               {success && <Feedback type="success" text={success} />}

               <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                    <aside className="glass-panel h-fit rounded-2xl p-5 xl:col-span-2">
                         <div
                              className="flex h-12 w-12 items-center justify-center rounded-2xl"
                              style={{ background: "var(--thread-soft)" }}
                         >
                              <Tag size={22} className="text-(--thread-pink)" />
                         </div>
                         <h3 className="mt-4 font-display text-xl font-semibold text-(--text-primary)">
                              Keep categories focused
                         </h3>
                         <p className="mt-2 text-[12.5px] leading-6 text-(--text-secondary)">
                              A good category name is short, recognizable, and
                              useful to the people managing products every day.
                         </p>
                         <div
                              className="mt-5 space-y-3 border-t pt-5"
                              style={{ borderColor: "var(--glass-border)" }}
                         >
                              <Tip
                                   title="Use a clear name"
                                   text="Examples: Beverages, Personal Care, or Cooking Essentials."
                              />
                              <Tip
                                   title="Avoid duplicates"
                                   text="A unique name keeps filtering and reporting reliable."
                              />
                         </div>
                    </aside>

                    <section className="glass-panel rounded-2xl p-5 sm:p-6 xl:col-span-3">
                         <div
                              className="mb-6 flex items-center gap-3 border-b pb-4"
                              style={{ borderColor: "var(--glass-border)" }}
                         >
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-(--thread-violet)">
                                   <FolderPlus size={18} />
                              </div>
                              <div>
                                   <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                                        Category details
                                   </h3>
                                   <p className="mt-0.5 text-[12px] text-(--text-tertiary)">
                                        Only the name is required to create a
                                        category.
                                   </p>
                              </div>
                         </div>

                         <form onSubmit={handleSubmit} className="space-y-5">
                              <div>
                                   <label
                                        htmlFor="name"
                                        className="mb-2 block text-[12px] font-medium text-(--text-secondary)"
                                   >
                                        Category name{" "}
                                        <span className="text-(--danger)">
                                             *
                                        </span>
                                   </label>
                                   <div className="relative">
                                        <Tag
                                             size={15}
                                             className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
                                        />
                                        <input
                                             id="name"
                                             name="name"
                                             value={formData.name}
                                             onChange={handleChange}
                                             placeholder="e.g. Household Essentials"
                                             required
                                             className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary)"
                                             style={{
                                                  borderColor:
                                                       "var(--glass-border)",
                                             }}
                                        />
                                   </div>
                              </div>
                              <div>
                                   <label
                                        htmlFor="description"
                                        className="mb-2 block text-[12px] font-medium text-(--text-secondary)"
                                   >
                                        Description{" "}
                                        <span className="text-(--text-tertiary)">
                                             (optional)
                                        </span>
                                   </label>
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
                                             rows={5}
                                             placeholder="Add a short note describing what products belong in this category…"
                                             className="w-full resize-y rounded-xl border bg-white/[0.035] py-3 pl-10 pr-3.5 text-[13px] leading-5 text-(--text-primary)"
                                             style={{
                                                  borderColor:
                                                       "var(--glass-border)",
                                             }}
                                        />
                                   </div>
                              </div>
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
                                             borderColor: "var(--glass-border)",
                                        }}
                                   >
                                        <option value="active">
                                             Active — ready to use
                                        </option>
                                        <option value="inactive">
                                             Inactive — save for later
                                        </option>
                                   </select>
                              </div>
                              <div
                                   className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <Link
                                        href="/category"
                                        className="text-[12.5px] font-medium text-(--text-tertiary) transition-colors hover:text-(--text-primary)"
                                   >
                                        Cancel and return
                                   </Link>
                                   <button
                                        disabled={loading}
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                                        style={{ background: "var(--thread)" }}
                                   >
                                        {loading ? (
                                             <LoaderCircle
                                                  size={16}
                                                  className="animate-spin"
                                             />
                                        ) : (
                                             <Plus size={16} />
                                        )}
                                        {loading
                                             ? "Creating category"
                                             : "Create category"}
                                   </button>
                              </div>
                         </form>
                     </section>
                </div>
                </div>
           </main>
      );
}

function Feedback({ type, text }) {
     const isError = type === "error";
     const Icon = isError ? CircleAlert : CheckCircle2;
     return (
          <div
               className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-[13px] ${isError ? "border-(--danger)/20 bg-(--danger-bg) text-(--danger)" : "border-(--ok)/20 bg-(--ok-bg) text-(--ok)"}`}
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
