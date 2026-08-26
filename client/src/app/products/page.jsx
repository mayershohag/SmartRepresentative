"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
     ArrowUpRight,
     Barcode,
     Box,
     CheckCircle2,
     CircleAlert,
     Edit3,
     FolderOpen,
     LoaderCircle,
     Package,
     Plus,
     RefreshCw,
     Search,
     Tag,
     Trash2,
} from "lucide-react";
import { getProducts } from "@/apis/products/getProducts";
import { deleteProduct } from "@/apis/products/deleteProduct";

const normaliseProducts = (data) =>
     [
          data?.product,
          data?.products,
          data?.data?.product,
          data?.data?.products,
          data?.data,
          data?.results,
          data,
     ].find(Array.isArray) ?? [];

const UNIT_LABELS = {
     pcs: "pcs",
     box: "box",
     packet: "pkt",
     carton: "ctn",
     kg: "kg",
     gm: "gm",
     ltr: "ltr",
     ml: "mL",
};

export default function ProductsPage() {
     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");
     const [query, setQuery] = useState("");
     const [statusFilter, setStatusFilter] = useState("all");
     const [deletingId, setDeletingId] = useState("");
     const [actionError, setActionError] = useState("");
     const [actionSuccess, setActionSuccess] = useState("");

     const loadProducts = async () => {
          setLoading(true);
          setError("");
          try {
               const response = await getProducts();
               if (!response?.ok)
                    throw new Error(
                         response?.data?.message || "Unable to load products.",
                    );
               setProducts(normaliseProducts(response.data));
          } catch (err) {
               setError(
                    err?.message ||
                         "Products could not be loaded. Please try again.",
               );
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          loadProducts();
     }, []);

     const handleDelete = async (product) => {
          const id = product?._id || product?.id;
          if (!id) return;
          setDeletingId(id);
          setActionError("");
          setActionSuccess("");
          try {
               const response = await deleteProduct(id);
               if (!response?.ok)
                    throw new Error(
                         response?.data?.message || "Unable to delete product.",
                    );
               setProducts((prev) =>
                    prev.filter((p) => (p?._id || p?.id) !== id),
               );
               setActionSuccess(
                    response?.data?.message ||
                         `"${product.name}" was deleted successfully.`,
               );
          } catch (err) {
               setActionError(
                    err?.message ||
                         "The product could not be deleted. Please try again.",
               );
          } finally {
               setDeletingId("");
          }
     };

     const filtered = useMemo(() => {
          const term = query.trim().toLowerCase();
          return products.filter((p) => {
               const matchesSearch =
                    !term ||
                    [p?.name, p?.sku, p?.barcode, p?.description, p?._id, p?.id]
                         .filter(Boolean)
                         .join(" ")
                         .toLowerCase()
                         .includes(term);
               const matchesStatus =
                    statusFilter === "all" || p?.status === statusFilter;
               return matchesSearch && matchesStatus;
          });
     }, [products, query, statusFilter]);

     const activeCount = products.filter((p) => p?.status === "active").length;
     const inactiveCount = products.filter(
          (p) => p?.status === "inactive",
     ).length;

     return (
          <main className="relative min-h-screen flex-1 px-4 pb-10 sm:px-6 lg:px-8">
               <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -right-16 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
                    <div className="absolute bottom-0 left-[8%] h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
               </div>

               <div className="mx-auto max-w-[1600px]">
                    {/* page header */}
                    <section className="mb-6 flex flex-col gap-5 pt-1 lg:flex-row lg:items-end lg:justify-between">
                         <div>
                              <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-tertiary)">
                                   <span className="h-1.5 w-1.5 rounded-full bg-(--thread-pink)" />
                                   Product catalog
                              </p>
                              <h1 className="font-display text-3xl font-bold tracking-tight text-(--text-primary)">
                                   All products
                              </h1>
                              <p className="mt-2 text-[13.5px] leading-6 text-(--text-secondary)">
                                   A full view of every product registered
                                   across your companies.
                              </p>
                         </div>
                         <Link
                              href="/products/add"
                              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-semibold text-white shadow-lg shadow-fuchsia-950/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                              style={{ background: "var(--thread)" }}
                         >
                              <Plus size={17} strokeWidth={2.5} />
                              Add product
                         </Link>
                    </section>

                    {/* action notices */}
                    {actionError && <ActionNotice error text={actionError} />}
                    {actionSuccess && <ActionNotice text={actionSuccess} />}

                    {/* stat chips */}
                    <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                         <Stat
                              icon={Package}
                              label="Total products"
                              value={loading ? "—" : products.length}
                              tone="var(--thread-violet)"
                         />
                         <Stat
                              icon={ArrowUpRight}
                              label="Active"
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

                    {/* main panel */}
                    <section className="glass-panel overflow-hidden rounded-2xl">
                         {/* toolbar */}
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
                                        id="product-search"
                                        value={query}
                                        onChange={(e) =>
                                             setQuery(e.target.value)
                                        }
                                        placeholder="Search by name, SKU or barcode…"
                                        className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-4 text-[13px] text-(--text-primary)"
                                        style={{
                                             borderColor: "var(--glass-border)",
                                        }}
                                   />
                              </div>

                              <div className="flex items-center gap-2">
                                   {["all", "active", "inactive"].map((val) => (
                                        <button
                                             key={val}
                                             onClick={() =>
                                                  setStatusFilter(val)
                                             }
                                             className={`rounded-lg px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
                                                  statusFilter === val
                                                       ? "bg-white/10 text-(--text-primary)"
                                                       : "text-(--text-tertiary) hover:text-(--text-primary)"
                                             }`}
                                             style={
                                                  statusFilter === val
                                                       ? {
                                                              border: "1px solid var(--glass-border-strong)",
                                                         }
                                                       : {
                                                              border: "1px solid transparent",
                                                         }
                                             }
                                        >
                                             {val}
                                        </button>
                                   ))}
                              </div>
                         </div>

                         {/* body states */}
                         {loading ? (
                              <div className="flex min-h-80 flex-col items-center justify-center gap-3">
                                   <LoaderCircle
                                        size={27}
                                        className="animate-spin text-(--thread-pink)"
                                   />
                                   <p className="text-[13px] text-(--text-secondary)">
                                        Loading product catalog…
                                   </p>
                              </div>
                         ) : error ? (
                              <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                                   <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-(--danger-bg) text-(--danger)">
                                        <CircleAlert size={20} />
                                   </div>
                                   <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                                        Couldn't load products
                                   </h3>
                                   <p className="mt-1 max-w-sm text-[13px] text-(--text-secondary)">
                                        {error}
                                   </p>
                                   <button
                                        onClick={loadProducts}
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
                                        {products.length
                                             ? "No matches found"
                                             : "No products yet"}
                                   </h3>
                                   <p className="mt-1 max-w-sm text-[13px] text-(--text-secondary)">
                                        {products.length
                                             ? "Try a different search term or filter."
                                             : "Add your first product to get started."}
                                   </p>
                                   {!products.length && (
                                        <Link
                                             href="/products/add"
                                             className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white"
                                             style={{
                                                  background: "var(--thread)",
                                             }}
                                        >
                                             <Plus size={14} />
                                             Add first product
                                        </Link>
                                   )}
                              </div>
                         ) : (
                              <div className="overflow-x-auto">
                                   <table className="w-full border-collapse">
                                        <thead>
                                             <tr
                                                  className="border-b text-left text-[11px] uppercase tracking-wide text-(--text-tertiary)"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                  }}
                                             >
                                                  <th className="px-5 pb-3 pt-4 font-medium">
                                                       Product
                                                  </th>
                                                  <th className="px-3 pb-3 pt-4 font-medium">
                                                       SKU
                                                  </th>
                                                  <th className="px-3 pb-3 pt-4 font-medium">
                                                       Unit
                                                  </th>
                                                  <th className="px-3 pb-3 pt-4 font-medium">
                                                       Barcode
                                                  </th>
                                                  <th className="px-3 pb-3 pt-4 font-medium">
                                                       Status
                                                  </th>
                                                  <th className="px-3 pb-3 pt-4 font-medium text-right">
                                                       Actions
                                                  </th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {filtered.map((product, index) => (
                                                  <ProductRow
                                                       key={
                                                            product?._id ||
                                                            product?.id ||
                                                            `${product?.name}-${index}`
                                                       }
                                                       product={product}
                                                       deleting={
                                                            deletingId ===
                                                            (product?._id ||
                                                                 product?.id)
                                                       }
                                                       onDelete={handleDelete}
                                                  />
                                             ))}
                                        </tbody>
                                   </table>

                                   {/* footer count */}
                                   <div
                                        className="border-t px-5 py-3"
                                        style={{
                                             borderColor: "var(--glass-border)",
                                        }}
                                   >
                                        <p className="text-[12px] text-(--text-tertiary)">
                                             Showing{" "}
                                             <span className="font-semibold text-(--text-secondary)">
                                                  {filtered.length}
                                             </span>{" "}
                                             of{" "}
                                             <span className="font-semibold text-(--text-secondary)">
                                                  {products.length}
                                             </span>{" "}
                                             products
                                             {inactiveCount > 0 && (
                                                  <span className="ml-2 text-(--text-tertiary)">
                                                       ·{" "}
                                                       <span
                                                            style={{
                                                                 color: "var(--warn)",
                                                            }}
                                                       >
                                                            {inactiveCount}{" "}
                                                            inactive
                                                       </span>
                                                  </span>
                                             )}
                                        </p>
                                   </div>
                              </div>
                         )}
                    </section>
               </div>
          </main>
     );
}

/* ─── action notice ──────────────────────────────────────────── */
function ActionNotice({ error = false, text }) {
     const Icon = error ? CircleAlert : CheckCircle2;
     return (
          <div
               className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-[13px] ${
                    error
                         ? "border-(--danger)/20 bg-(--danger-bg) text-(--danger)"
                         : "border-(--ok)/20 bg-(--ok-bg) text-(--ok)"
               }`}
          >
               <Icon size={18} className="mt-0.5 shrink-0" />
               <p>{text}</p>
          </div>
     );
}

function ProductRow({ product, deleting, onDelete }) {
     const active = product?.status !== "inactive";
     const id = product?._id || product?.id;
     const unitLabel = UNIT_LABELS[product?.unit] ?? product?.unit ?? "—";
     const unitDisplay =
          product?.unitValue && product.unitValue !== 1
               ? `${product.unitValue} ${unitLabel}`
               : unitLabel;

     return (
          <tr
               className="group border-t text-[13px] transition-colors hover:bg-white/[0.025]"
               style={{ borderColor: "var(--glass-border)" }}
          >
               <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                         <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                              style={{
                                   background: "rgba(255,255,255,0.05)",
                                   border: "1px solid var(--glass-border)",
                              }}
                         >
                              {product?.image ? (
                                   <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                   />
                              ) : (
                                   <Box
                                        size={17}
                                        style={{
                                             color: "var(--thread-violet)",
                                        }}
                                   />
                              )}
                         </div>
                         <div className="min-w-0">
                              <p className="truncate font-medium text-(--text-primary)">
                                   {product?.name || "Untitled"}
                              </p>
                              {product?.description && (
                                   <p className="mt-0.5 truncate max-w-56 text-[11.5px] text-(--text-tertiary)">
                                        {product.description}
                                   </p>
                              )}
                         </div>
                    </div>
               </td>

               <td className="px-3 py-3.5">
                    {product?.sku ? (
                         <span
                              className="font-mono rounded-md px-2 py-0.5 text-[11.5px] text-(--text-secondary)"
                              style={{
                                   background: "rgba(255,255,255,0.05)",
                                   border: "1px solid var(--glass-border)",
                              }}
                         >
                              {product.sku}
                         </span>
                    ) : (
                         <span className="text-[12px] text-(--text-tertiary)">
                              —
                         </span>
                    )}
               </td>

               {/* unit */}
               <td className="px-3 py-3.5">
                    <span className="font-mono text-[12.5px] text-(--text-secondary)">
                         {unitDisplay}
                    </span>
               </td>

               {/* barcode */}
               <td className="px-3 py-3.5">
                    {product?.barcode ? (
                         <span className="font-mono flex items-center gap-1.5 text-[12px] text-(--text-secondary)">
                              <Barcode
                                   size={12}
                                   className="shrink-0 text-(--text-tertiary)"
                              />
                              {product.barcode}
                         </span>
                    ) : (
                         <span className="text-[12px] text-(--text-tertiary)">
                              —
                         </span>
                    )}
               </td>

               {/* status */}
               <td className="px-3 py-3.5">
                    <span
                         className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                         style={{
                              background: active
                                   ? "var(--ok-bg)"
                                   : "var(--warn-bg)",
                              color: active ? "var(--ok)" : "var(--warn)",
                         }}
                    >
                         <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                   background: active
                                        ? "var(--ok)"
                                        : "var(--warn)",
                              }}
                         />
                         {active ? "Active" : "Inactive"}
                    </span>
               </td>

               {/* actions */}
               <td className="px-3 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                         <Link
                              href={`/products/update`}
                              aria-label={`Edit ${product?.name || "product"}`}
                              className="rounded-lg p-2 text-(--text-tertiary) hover:bg-white/5 hover:text-(--text-primary) transition-colors"
                         >
                              <Edit3 size={15} />
                         </Link>
                         <button
                              type="button"
                              onClick={() => onDelete(product)}
                              disabled={deleting}
                              aria-label={`Delete ${product?.name || "product"}`}
                              className="rounded-lg p-2 text-(--text-tertiary) hover:bg-(--danger-bg) hover:text-(--danger) transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
               </td>
          </tr>
     );
}

/* ─── stat chip ───────────────────────────────────────────────── */
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
