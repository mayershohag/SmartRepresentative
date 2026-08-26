"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
     ArrowUpRight,
     Building2,
     ChevronDown,
     CircleAlert,
     ExternalLink,
     Globe2,
     LoaderCircle,
     Mail,
     Phone,
     Plus,
     RefreshCw,
     Search,
     SlidersHorizontal,
} from "lucide-react";
import { getCompanies } from "@/apis/getCompanies";
import Image from "next/image";

const getInitials = (name = "Company") =>
     name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((word) => word[0])
          .join("")
          .toUpperCase();

const normaliseCompanies = (payload) => {
     const candidates = [
          payload?.data,
          payload?.companies,
          payload?.results,
          payload?.items,
          payload,
     ];
     const list = candidates.find(Array.isArray);
     return list ?? [];
};

const getStatus = (company) => {
     const value = company?.isActive ?? company?.status ?? company?.active;
     if (value === false || String(value).toLowerCase() === "inactive") {
          return { label: "Inactive", active: false };
     }
     return { label: "Active", active: true };
};

export default function CompaniesPage() {
     const [companies, setCompanies] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");
     const [query, setQuery] = useState("");
     const [statusFilter, setStatusFilter] = useState("all");

     const loadCompanies = async () => {
          setLoading(true);
          setError("");
          try {
               const response = await getCompanies();
               if (!response?.ok) {
                    throw new Error(
                         response?.data?.message || "Unable to load companies.",
                    );
               }
               setCompanies(normaliseCompanies(response.data));
          } catch (err) {
               setError(
                    err?.message ||
                         "We could not load your companies. Please try again.",
               );
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          loadCompanies();
     }, []);

     const filteredCompanies = useMemo(() => {
          const term = query.trim().toLowerCase();
          return companies.filter((company) => {
               const status = getStatus(company);
               const searchable = [
                    company?.name,
                    company?.email,
                    company?.phone,
                    company?.website,
               ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
               return (
                    (!term || searchable.includes(term)) &&
                    (statusFilter === "all" ||
                         (statusFilter === "active"
                              ? status.active
                              : !status.active))
               );
          });
     }, [companies, query, statusFilter]);

     const activeCount = companies.filter(
          (company) => getStatus(company).active,
     ).length;

     return (
          <main className="relative min-h-screen flex-1 px-6 pb-10">
               <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-28 right-[8%] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
                    <div className="absolute bottom-12 left-[8%] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
               </div>

               <section className="mb-6 flex flex-col gap-5 pt-1 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                         <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-tertiary)">
                              <span className="h-1.5 w-1.5 rounded-full bg-(--thread-pink)" />
                              Partner directory
                         </div>
                         <h2 className="font-display text-3xl font-bold tracking-tight text-(--text-primary)">
                              Your companies
                         </h2>
                         <p className="mt-2 max-w-xl text-[13.5px] leading-6 text-(--text-secondary)">
                              A clear view of every brand and supplier in your
                              distribution network.
                         </p>
                    </div>
                    <Link
                         href="/companies/add"
                         className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-semibold text-white shadow-lg shadow-fuchsia-950/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                         style={{ background: "var(--thread)" }}
                    >
                         <Plus size={17} strokeWidth={2.5} />
                         Add company
                    </Link>
               </section>

               <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                         {
                              label: "Total companies",
                              value: companies.length,
                              icon: Building2,
                              tone: "var(--thread-violet)",
                         },
                         {
                              label: "Active partners",
                              value: activeCount,
                              icon: ArrowUpRight,
                              tone: "var(--ok)",
                         },
                         {
                              label: "Need attention",
                              value: companies.length - activeCount,
                              icon: CircleAlert,
                              tone: "var(--warn)",
                         },
                    ].map(({ label, value, icon: Icon, tone }) => (
                         <div
                              key={label}
                              className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3.5"
                         >
                              <div
                                   className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5"
                                   style={{ color: tone }}
                              >
                                   <Icon size={18} />
                              </div>
                              <div>
                                   <p className="font-mono text-xl font-semibold leading-none text-(--text-primary)">
                                        {loading ? "—" : value}
                                   </p>
                                   <p className="mt-1 text-[11.5px] text-(--text-tertiary)">
                                        {label}
                                   </p>
                              </div>
                         </div>
                    ))}
               </section>

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
                                   placeholder="Search by name, email, or phone"
                                   className="w-full rounded-xl border bg-white/[0.035] py-2.5 pl-10 pr-4 text-[13px] text-(--text-primary)"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              />
                         </div>
                         <div className="flex items-center gap-2">
                              <SlidersHorizontal
                                   size={15}
                                   className="text-(--text-tertiary)"
                              />
                              <label
                                   className="sr-only"
                                   htmlFor="company-status"
                              >
                                   Filter companies by status
                              </label>
                              <div className="relative">
                                   <select
                                        id="company-status"
                                        value={statusFilter}
                                        onChange={(event) =>
                                             setStatusFilter(event.target.value)
                                        }
                                        className="appearance-none rounded-xl border bg-white/[0.035] py-2.5 pl-3 pr-9 text-[12.5px] font-medium text-(--text-secondary)"
                                        style={{
                                             borderColor: "var(--glass-border)",
                                        }}
                                   >
                                        <option value="all">
                                             All statuses
                                        </option>
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                             Inactive
                                        </option>
                                   </select>
                                   <ChevronDown
                                        size={14}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
                                   />
                              </div>
                         </div>
                    </div>

                    {loading ? (
                         <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-center">
                              <LoaderCircle
                                   size={27}
                                   className="animate-spin text-(--thread-pink)"
                              />
                              <p className="text-[13px] text-(--text-secondary)">
                                   Loading your company directory…
                              </p>
                         </div>
                    ) : error ? (
                         <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-(--danger-bg) text-(--danger)">
                                   <CircleAlert size={20} />
                              </div>
                              <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                                   Couldn’t load companies
                              </h3>
                              <p className="mt-1 max-w-sm text-[13px] text-(--text-secondary)">
                                   {error}
                              </p>
                              <button
                                   onClick={loadCompanies}
                                   className="mt-5 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12.5px] font-semibold text-(--text-primary) hover:bg-white/5"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <RefreshCw size={14} /> Try again
                              </button>
                         </div>
                    ) : filteredCompanies.length === 0 ? (
                         <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-(--thread-violet)">
                                   <Building2 size={21} />
                              </div>
                              <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                                   {companies.length
                                        ? "No matches found"
                                        : "No companies yet"}
                              </h3>
                              <p className="mt-1 max-w-sm text-[13px] text-(--text-secondary)">
                                   {companies.length
                                        ? "Try a different search term or status filter."
                                        : "Add your first partner to start building your company directory."}
                              </p>
                              {!companies.length && (
                                   <Link
                                        href="/companies/add"
                                        className="mt-5 text-[13px] font-semibold text-(--thread-pink)"
                                   >
                                        Add a company{" "}
                                        <span aria-hidden="true">→</span>
                                   </Link>
                              )}
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 gap-px bg-(--glass-border) md:grid-cols-2 xl:grid-cols-3">
                              {filteredCompanies.map((company, index) => {
                                   const status = getStatus(company);
                                   const name =
                                        company?.name || "Untitled company";
                                   return (
                                        <article
                                             key={
                                                  company?._id ||
                                                  company?.id ||
                                                  `${name}-${index}`
                                             }
                                             className="group relative bg-(--bg-deep) p-5 transition-colors hover:bg-white/4.5"
                                        >
                                             <div className="mb-5 flex items-start justify-between gap-3">
                                                  <div className="flex min-w-0 items-center gap-3">
                                                       <div
                                                            className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white/6 text-[12px] font-bold text-(--text-primary)"
                                                            style={{
                                                                 borderColor:
                                                                      "var(--glass-border)",
                                                            }}
                                                       >
                                                            {company?.avatar ? (
                                                                 <Image
                                                                      src={
                                                                           company.avatar
                                                                      }
                                                                      alt=""
                                                                      width={
                                                                           100
                                                                      }
                                                                      height={
                                                                           100
                                                                      }
                                                                      className="h-full w-full object-cover"
                                                                      onError={(
                                                                           event,
                                                                      ) => {
                                                                           event.currentTarget.style.display =
                                                                                "none";
                                                                      }}
                                                                 />
                                                            ) : (
                                                                 getInitials(
                                                                      name,
                                                                 )
                                                            )}
                                                       </div>
                                                       <div className="min-w-0">
                                                            <h3 className="truncate font-display text-[15px] font-semibold text-(--text-primary)">
                                                                 {name}
                                                            </h3>
                                                            <span
                                                                 className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium"
                                                                 style={{
                                                                      color: status.active
                                                                           ? "var(--ok)"
                                                                           : "var(--text-tertiary)",
                                                                 }}
                                                            >
                                                                 <span
                                                                      className="h-1.5 w-1.5 rounded-full"
                                                                      style={{
                                                                           background:
                                                                                status.active
                                                                                     ? "var(--ok)"
                                                                                     : "var(--text-tertiary)",
                                                                      }}
                                                                 />
                                                                 {status.label}
                                                            </span>
                                                       </div>
                                                  </div>
                                                  {company?.website && (
                                                       <a
                                                            href={
                                                                 company.website.startsWith(
                                                                      "http",
                                                                 )
                                                                      ? company.website
                                                                      : `https://${company.website}`
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            aria-label={`Visit ${name} website`}
                                                            className="rounded-lg p-2 text-(--text-tertiary) opacity-0 transition-all hover:bg-white/5 hover:text-(--text-primary) group-hover:opacity-100"
                                                       >
                                                            <ExternalLink
                                                                 size={16}
                                                            />
                                                       </a>
                                                  )}
                                             </div>
                                             <p className="line-clamp-2 min-h-10 text-[12.5px] leading-5 text-(--text-secondary)">
                                                  {company?.description ||
                                                       "No company description has been added yet."}
                                             </p>
                                             <div
                                                  className="mt-5 space-y-2 border-t pt-4 text-[11.5px]"
                                                  style={{
                                                       borderColor:
                                                            "var(--glass-border)",
                                                  }}
                                             >
                                                  {company?.email && (
                                                       <a
                                                            href={`mailto:${company.email}`}
                                                            className="flex items-center gap-2 truncate text-(--text-tertiary) transition-colors hover:text-(--text-primary)"
                                                       >
                                                            <Mail
                                                                 size={13}
                                                                 className="shrink-0 text-(--thread-pink)"
                                                            />
                                                            {company.email}
                                                       </a>
                                                  )}
                                                  {company?.phone && (
                                                       <a
                                                            href={`tel:${company.phone}`}
                                                            className="flex items-center gap-2 truncate text-(--text-tertiary) transition-colors hover:text-(--text-primary)"
                                                       >
                                                            <Phone
                                                                 size={13}
                                                                 className="shrink-0 text-(--thread-violet)"
                                                            />
                                                            {company.phone}
                                                       </a>
                                                  )}
                                                  {!company?.email &&
                                                       !company?.phone && (
                                                            <div className="flex items-center gap-2 text-(--text-tertiary)">
                                                                 <Globe2
                                                                      size={13}
                                                                      className="text-(--thread-blue)"
                                                                 />
                                                                 Contact details
                                                                 unavailable
                                                            </div>
                                                       )}
                                             </div>
                                        </article>
                                   );
                              })}
                         </div>
                    )}
               </section>
          </main>
     );
}
