"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
     ArrowUpRight,
     Building2,
     CheckCircle2,
     CircleAlert,
     Edit3,
     FolderOpen,
     LoaderCircle,
     Plus,
     RefreshCw,
     Search,
     Tag,
     Trash2,
} from "lucide-react";
import { getCategories } from "@/apis/category/getCategories";
import { deleteCategory } from "@/apis/category/deleteCategory";

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
const formatDate = (value) =>
     value
          ? new Intl.DateTimeFormat("en", {
                 day: "numeric",
                 month: "short",
                 year: "numeric",
            }).format(new Date(value))
          : "Not available";

export default function CategoriesPage() {
     const [categories, setCategories] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");
     const [query, setQuery] = useState("");
     const [deletingId, setDeletingId] = useState("");
     const [actionError, setActionError] = useState("");
     const [actionSuccess, setActionSuccess] = useState("");
     const loadCategories = async () => {
          setLoading(true);
          setError("");
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
                         "Categories could not be loaded. Please try again.",
               );
          } finally {
               setLoading(false);
          }
     };
     useEffect(() => {
          loadCategories();
     }, []);
     const handleDelete = async (category) => {
          const id = category?._id || category?.id;
          if (!id) {
               setActionError(
                    "This category does not have a valid ID to delete.",
               );
               return;
          }
          setDeletingId(id);
          setActionError("");
          setActionSuccess("");
          try {
               const response = await deleteCategory(id);
               if (!response?.ok)
                    throw new Error(
                         response?.data?.message ||
                              "Unable to delete category.",
                    );
               setCategories((items) =>
                    items.filter((item) => (item?._id || item?.id) !== id),
               );
               setActionSuccess(
                    response?.data?.message ||
                         `${category.name} was deleted successfully.`,
               );
          } catch (err) {
               setActionError(
                    err?.message ||
                         "The category could not be deleted. Please try again.",
               );
          } finally {
               setDeletingId("");
          }
     };
     const filtered = useMemo(() => {
          const term = query.trim().toLowerCase();
          return categories.filter(
               (category) =>
                    !term ||
                    [
                         category?.name,
                         category?.description,
                         category?._id,
                         category?.id,
                    ]
                         .filter(Boolean)
                         .join(" ")
                         .toLowerCase()
                         .includes(term),
          );
     }, [categories, query]);
     const activeCount = categories.filter(
          (category) =>
               category?.isActive !== false &&
               category?.isActive !== "inactive",
     ).length;

     return (
           <main className="relative min-h-screen flex-1 px-4 pb-10 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                     <div className="absolute -right-16 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
                     <div className="absolute bottom-0 left-[8%] h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
                </div>
                <div className="mx-auto max-w-[1600px]">
                <section className="mb-6 flex flex-col gap-5 pt-1 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                         <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-tertiary)">
                              <span className="h-1.5 w-1.5 rounded-full bg-(--thread-pink)" />
                              Catalog organization
                         </p>
                         <h2 className="font-display text-3xl font-bold tracking-tight text-(--text-primary)">
                              All categories
                         </h2>
                         <p className="mt-2 text-[13.5px] leading-6 text-(--text-secondary)">
                              A complete view of the groups that keep your
                              product catalog organized.
                         </p>
                    </div>
                    <Link
                         href="/category/add"
                         className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-semibold text-white shadow-lg shadow-fuchsia-950/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                         style={{ background: "var(--thread)" }}
                    >
                         <Plus size={17} strokeWidth={2.5} />
                         Add category
                    </Link>
               </section>
               <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Stat
                         icon={FolderOpen}
                         label="Total categories"
                         value={loading ? "—" : categories.length}
                         tone="var(--thread-violet)"
                    />
                    <Stat
                         icon={ArrowUpRight}
                         label="Active categories"
                         value={loading ? "—" : activeCount}
                         tone="var(--ok)"
                    />
                    <Stat
                         icon={Tag}
                         label="Search results"
                         value={loading ? "—" : filtered.length}
                         tone="var(--thread-pink)"
                    />
               </section>
               {actionError && <ActionNotice error text={actionError} />}
               {actionSuccess && <ActionNotice text={actionSuccess} />}
               <section className="glass-panel overflow-hidden rounded-2xl">
                    <div
                         className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"
                         style={{ borderColor: "var(--glass-border)" }}
                    >
                         <div className="relative w-full sm:max-w-sm">
                              <Search
                                   size={16}
                                   className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
                              />
                              <input
                                   value={query}
                                   onChange={(event) =>
                                        setQuery(event.target.value)
                                   }
                                   placeholder="Search categories or descriptions"
                                   className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-4 text-[13px] text-(--text-primary)"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              />
                         </div>
                         <p className="text-[12px] text-(--text-tertiary)">
                              {loading
                                   ? "Loading directory…"
                                   : `${filtered.length} ${filtered.length === 1 ? "category" : "categories"}`}
                         </p>
                    </div>
                    {loading ? (
                         <div className="flex min-h-80 flex-col items-center justify-center gap-3">
                              <LoaderCircle
                                   size={27}
                                   className="animate-spin text-(--thread-pink)"
                              />
                              <p className="text-[13px] text-(--text-secondary)">
                                   Loading category directory…
                              </p>
                         </div>
                    ) : error ? (
                         <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-(--danger-bg) text-(--danger)">
                                   <CircleAlert size={20} />
                              </div>
                              <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                                   Couldn’t load categories
                              </h3>
                              <p className="mt-1 max-w-sm text-[13px] text-(--text-secondary)">
                                   {error}
                              </p>
                              <button
                                   onClick={loadCategories}
                                   className="mt-5 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12.5px] font-semibold text-(--text-primary) hover:bg-white/5"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <RefreshCw size={14} />
                                   Try again
                              </button>
                         </div>
                    ) : filtered.length === 0 ? (
                         <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-(--thread-violet)">
                                   <FolderOpen size={21} />
                              </div>
                              <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                                   {categories.length
                                        ? "No matches found"
                                        : "No categories yet"}
                              </h3>
                              <p className="mt-1 max-w-sm text-[13px] text-(--text-secondary)">
                                   {categories.length
                                        ? "Try a different search term."
                                        : "Add your first category to organize the product catalog."}
                              </p>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 gap-px bg-(--glass-border) md:grid-cols-2 xl:grid-cols-3">
                              {filtered.map((category, index) => (
                                   <CategoryCard
                                        key={
                                             category?._id ||
                                             category?.id ||
                                             `${category?.name}-${index}`
                                        }
                                        category={category}
                                        deleting={
                                             deletingId ===
                                             (category?._id || category?.id)
                                        }
                                        onDelete={handleDelete}
                                   />
                              ))}
                         </div>
                     )}
                </section>
                </div>
           </main>
      );
}

function Stat({ icon: Icon, label, value, tone }) {
     return (
          <div className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3.5">
               <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5"
                    style={{ color: tone }}
               >
                    <Icon size={18} />
               </div>
               <div>
                    <p className="font-mono text-xl font-semibold leading-none text-(--text-primary)">
                         {value}
                    </p>
                    <p className="mt-1 text-[11.5px] text-(--text-tertiary)">
                         {label}
                    </p>
               </div>
          </div>
     );
}
function ActionNotice({ error = false, text }) {
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
function CategoryCard({ category, onDelete, deleting }) {
     const active =
          category?.isActive !== false && category?.isActive !== "inactive";
     const id = category?._id || category?.id;
     return (
          <article className="group bg-(--bg-deep) p-5 transition-colors hover:bg-white/4.5">
               <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/6 text-(--thread-violet)">
                              <Tag size={19} />
                         </div>
                         <div className="min-w-0">
                              <h3 className="truncate font-display text-[15px] font-semibold text-(--text-primary)">
                                   {category?.name || "Untitled category"}
                              </h3>
                              <span
                                   className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium"
                                   style={{
                                        color: active
                                             ? "var(--ok)"
                                             : "var(--text-tertiary)",
                                   }}
                              >
                                   <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{
                                             background: active
                                                  ? "var(--ok)"
                                                  : "var(--text-tertiary)",
                                        }}
                                   />
                                   {active ? "Active" : "Inactive"}
                              </span>
                         </div>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                         <Link
                              href="/category/update"
                              aria-label={`Update ${category?.name || "category"}`}
                              className="rounded-lg p-2 text-(--text-tertiary) hover:bg-white/5 hover:text-(--text-primary)"
                         >
                              <Edit3 size={15} />
                         </Link>
                         <button
                              onClick={() => onDelete(category)}
                              disabled={deleting}
                              type="button"
                              aria-label={`Delete ${category?.name || "category"}`}
                              className="rounded-lg p-2 text-(--text-tertiary) hover:bg-(--danger-bg) hover:text-(--danger) disabled:cursor-not-allowed disabled:opacity-50"
                         >
                              {deleting ? (
                                   <LoaderCircle
                                        size={15}
                                        className="animate-spin"
                                   />
                              ) : (
                                   <Trash2 size={15} />
                              )}
                         </button>
                    </div>
               </div>
               <p className="mt-5 line-clamp-3 min-h-15 text-[12.5px] leading-5 text-(--text-secondary)">
                    {category?.description ||
                         "No description has been added for this category."}
               </p>
               <div
                    className="mt-5 space-y-2 border-t pt-4"
                    style={{ borderColor: "var(--glass-border)" }}
               >
                    <p className="flex justify-between gap-3 text-[11px]">
                         <span className="text-(--text-tertiary)">Created</span>
                         <span className="text-right text-(--text-secondary)">
                              {formatDate(category?.createdAt)}
                         </span>
                    </p>
                    <p className="flex justify-between gap-3 text-[11px]">
                         <span className="text-(--text-tertiary)">
                              Category ID
                         </span>
                         <span
                              className="font-mono max-w-42 truncate text-right text-(--text-secondary)"
                              title={id}
                         >
                              {id || "Not available"}
                         </span>
                    </p>
               </div>
          </article>
     );
}
