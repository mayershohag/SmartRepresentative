"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
     ArrowLeft,
     CheckCircle2,
     CircleAlert,
     FileText,
     FolderCog,
     LoaderCircle,
     Save,
     Tag,
} from "lucide-react";
import { getCategories } from "@/apis/category/getCategories";
import { updateCategory } from "@/apis/category/updateCategory";

const initialForm = {
     originalName: "",
     name: "",
     description: "",
     isActive: "",
};
const normaliseCategories = (data) =>
     [
          data?.category,
          data?.categories,
          data?.data?.category,
          data?.data?.categories,
          data?.data,
          data?.results,
          data,
     ].find(Array.isArray) ?? [];

export default function UpdateCategory() {
     const [formData, setFormData] = useState(initialForm);
     const [categories, setCategories] = useState([]);
     const [categoriesLoading, setCategoriesLoading] = useState(true);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState("");
     const [success, setSuccess] = useState("");

     useEffect(() => {
          const loadCategories = async () => {
               try {
                    const response = await getCategories();
                    if (!response?.ok)
                         throw new Error(
                              response?.data?.message ||
                                   "Unable to load categories.",
                         );
                    setCategories(normaliseCategories(response.data));
               } catch (err) {
                    setError(
                         err?.message ||
                              "Categories could not be loaded. Refresh and try again.",
                    );
               } finally {
                    setCategoriesLoading(false);
               }
          };
          loadCategories();
     }, []);

     const selectCategory = (event) => {
          const originalName = event.target.value;
          const category = categories.find(
               (item) => item?.name === originalName,
          );
          setFormData({
               originalName,
               name: category?.name || "",
               description: category?.description || "",
               isActive: category
                    ? category.isActive === false ||
                      category.isActive === "inactive"
                         ? "inactive"
                         : "active"
                    : "",
          });
          setError("");
          setSuccess("");
     };
     const handleChange = (event) => {
          const { name, value } = event.target;
          setFormData((current) => ({ ...current, [name]: value }));
          setError("");
          setSuccess("");
     };
     const handleSubmit = async (event) => {
          event.preventDefault();
          const originalName = formData.originalName.trim();
          if (!originalName) return setError("Choose a category to update.");
          const categoryData = {};
          if (formData.name.trim() && formData.name.trim() !== originalName)
               categoryData.name = formData.name.trim();
          if (formData.description.trim())
               categoryData.description = formData.description.trim();
          if (formData.isActive) categoryData.isActive = formData.isActive;
          if (!Object.keys(categoryData).length)
               return setError("Make at least one change before saving.");
          setLoading(true);
          setError("");
          try {
               const response = await updateCategory(
                    originalName,
                    categoryData,
               );
               if (!response?.ok)
                    throw new Error(
                         response?.data?.message ||
                              "Unable to update category.",
                    );
               const newName =
                    response?.data?.category?.name ||
                    formData.name.trim() ||
                    originalName;
               setSuccess(
                    response?.data?.message ||
                         `${originalName} was updated successfully.`,
               );
               setCategories((items) =>
                    items.map((item) =>
                         item?.name === originalName
                              ? { ...item, ...categoryData, name: newName }
                              : item,
                    ),
               );
               setFormData((current) => ({
                    ...initialForm,
                    originalName: newName,
               }));
          } catch (err) {
               setError(
                    err?.message ||
                         "The category could not be updated. Please try again.",
               );
          } finally {
               setLoading(false);
          }
     };

     return (
           <main className="relative min-h-screen flex-1 px-4 pb-10 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                     <div className="absolute -right-16 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
                     <div className="absolute bottom-0 left-[10%] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
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
                              Update category
                         </h2>
                         <p className="mt-1.5 text-[13px] text-(--text-secondary)">
                              Choose an existing category, then refine its
                              details.
                         </p>
                    </div>
               </div>
               {error && <Feedback error text={error} />}
               {success && <Feedback text={success} />}
               <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                    <aside className="glass-panel h-fit rounded-2xl p-5 xl:col-span-2">
                         <div
                              className="flex h-12 w-12 items-center justify-center rounded-2xl"
                              style={{ background: "var(--thread-soft)" }}
                         >
                              <FolderCog
                                   size={22}
                                   className="text-(--thread-pink)"
                              />
                         </div>
                         <h3 className="mt-4 font-display text-xl font-semibold text-(--text-primary)">
                              Choose, then edit
                         </h3>
                         <p className="mt-2 text-[12.5px] leading-6 text-(--text-secondary)">
                              Pick a saved category from the dropdown. Its
                              current details are loaded so you can edit without
                              remembering or retyping them.
                         </p>
                         <div
                              className="mt-5 space-y-3 border-t pt-5"
                              style={{ borderColor: "var(--glass-border)" }}
                         >
                              <Tip
                                   title="Details are pre-filled"
                                   text="The name, description, and status are ready to edit after selection."
                              />
                              <Tip
                                   title="Clearer updates"
                                   text="Your selected category name is used safely in the backend update route."
                              />
                         </div>
                    </aside>
                    <section className="glass-panel rounded-2xl p-5 sm:p-6 xl:col-span-3">
                         <div
                              className="mb-6 flex items-center gap-3 border-b pb-4"
                              style={{ borderColor: "var(--glass-border)" }}
                         >
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-(--thread-violet)">
                                   <Tag size={18} />
                              </div>
                              <div>
                                   <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                                        Category details
                                   </h3>
                                   <p className="mt-0.5 text-[12px] text-(--text-tertiary)">
                                        Select a category first, then save your
                                        changes.
                                   </p>
                              </div>
                         </div>
                         <form onSubmit={handleSubmit} className="space-y-5">
                              <div className="rounded-xl border border-(--thread-violet)/20 bg-white/2.5 p-4">
                                   <label
                                        htmlFor="originalName"
                                        className="mb-2 block text-[12px] font-medium text-(--text-secondary)"
                                   >
                                        Select category{" "}
                                        <span className="text-(--danger)">
                                             *
                                        </span>
                                   </label>
                                   <div className="relative">
                                        <Tag
                                             size={15}
                                             className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--thread-violet)"
                                        />
                                        <select
                                             id="originalName"
                                             value={formData.originalName}
                                             onChange={selectCategory}
                                             required
                                             disabled={categoriesLoading}
                                             className="w-full appearance-none rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-60"
                                             style={{
                                                  borderColor:
                                                       "var(--glass-border)",
                                             }}
                                        >
                                             <option value="">
                                                  {categoriesLoading
                                                       ? "Loading categories…"
                                                       : "Choose an existing category"}
                                             </option>
                                             {categories.map((category) => (
                                                  <option
                                                       key={
                                                            category?._id ||
                                                            category?.id ||
                                                            category?.name
                                                       }
                                                       value={
                                                            category?.name || ""
                                                       }
                                                  >
                                                       {category?.name}
                                                  </option>
                                             ))}
                                        </select>
                                   </div>
                                   <p className="mt-2 text-[11px] text-(--text-tertiary)">
                                        This selection identifies the category
                                        for your backend update route.
                                   </p>
                              </div>
                              <div>
                                   <label
                                        htmlFor="name"
                                        className="mb-2 block text-[12px] font-medium text-(--text-secondary)"
                                   >
                                        Category name
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
                                             disabled={!formData.originalName}
                                             className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-3.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
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
                                        Description
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
                                             rows={4}
                                             disabled={!formData.originalName}
                                             className="w-full resize-y rounded-xl border bg-white/[0.035] py-3 pl-10 pr-3.5 text-[13px] leading-5 text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
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
                                        disabled={!formData.originalName}
                                        className="w-full rounded-xl border bg-white/[0.035] px-3.5 py-2.5 text-[13px] text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-55"
                                        style={{
                                             borderColor: "var(--glass-border)",
                                        }}
                                   >
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                             Inactive
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
                                        disabled={
                                             loading || !formData.originalName
                                        }
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
                                             <Save size={16} />
                                        )}
                                        {loading
                                             ? "Saving changes"
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
function Feedback({ error = false, text }) {
     const Icon = error ? CircleAlert : CheckCircle2;
     return (
          <div
               className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-[13px] ${error ? "border-(--danger)/20 bg-(--danger-bg) text-(--danger)" : "border-(--ok)/20 bg-(--ok-bg) text-(--ok)"}`}
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
