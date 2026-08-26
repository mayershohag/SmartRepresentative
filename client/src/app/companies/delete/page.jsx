"use client";

import { useState } from "react";
import Link from "next/link";
import {
     AlertTriangle,
     ArrowLeft,
     Building2,
     CheckCircle2,
     Globe2,
     LoaderCircle,
     Mail,
     Phone,
     Search,
     ShieldAlert,
     Trash2,
} from "lucide-react";
import { getCompany } from "@/apis/company/getCompany";
import { deleteCompany } from "@/apis/company/deleteCompany";
import Image from "next/image";

const extractCompany = (data) =>
     data?.company ?? data?.data?.company ?? data?.data ?? data;

export default function DeleteCompany() {
     const [searchName, setSearchName] = useState("");
     const [company, setCompany] = useState(null);
     const [loading, setLoading] = useState(false);
     const [deleting, setDeleting] = useState(false);
     const [confirmation, setConfirmation] = useState("");
     const [error, setError] = useState("");
     const [success, setSuccess] = useState("");

     const findCompany = async (event) => {
          event.preventDefault();
          const name = searchName.trim();
          if (!name)
               return setError("Enter the company name to find its record.");
          setLoading(true);
          setError("");
          setSuccess("");
          setCompany(null);
          setConfirmation("");
          try {
               const response = await getCompany(name);
               if (!response?.ok)
                    throw new Error(
                         response?.data?.message || "Company not found.",
                    );
               const found = extractCompany(response.data);
               if (!found || typeof found !== "object")
                    throw new Error("The company details could not be read.");
               setCompany(found);
               setSearchName(found.name || name);
          } catch (err) {
               setError(
                    err?.message ||
                         "We could not find that company. Check the name and try again.",
               );
          } finally {
               setLoading(false);
          }
     };

     const removeCompany = async (event) => {
          event.preventDefault();
          if (!company?.name || confirmation !== company.name) return;
          setDeleting(true);
          setError("");
          try {
               const response = await deleteCompany(company.name);
               if (!response?.ok)
                    throw new Error(
                         response?.data?.message || "Unable to delete company.",
                    );
               setSuccess(
                    response?.data?.message ||
                         `${company.name} was deleted successfully.`,
               );
               setCompany(null);
               setConfirmation("");
          } catch (err) {
               setError(
                    err?.message ||
                         "The company could not be deleted. Please try again.",
               );
          } finally {
               setDeleting(false);
          }
     };

     const matches = confirmation === company?.name;
     return (
           <main className="relative min-h-screen flex-1 px-4 pb-10 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                     <div className="absolute -right-16 top-4 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
                     <div className="absolute bottom-0 left-[10%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
                </div>
                <div className="mx-auto max-w-[1600px]">
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
                              Delete company
                         </h2>
                         <p className="mt-1.5 text-[13px] text-(--text-secondary)">
                              Remove a company carefully. This action cannot be
                              undone.
                         </p>
                     </div>
                <section className="glass-panel mb-5 rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                         <div>
                              <div className="flex items-center gap-2 text-[13px] font-semibold text-(--text-primary)">
                                   <Search
                                        size={16}
                                        className="text-(--thread-pink)"
                                   />{" "}
                                   Locate a company
                              </div>
                              <p className="mt-1 text-[12px] text-(--text-tertiary)">
                                   Search by the company name used in your
                                   records.
                              </p>
                         </div>
                         <form
                              onSubmit={findCompany}
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
                                   disabled={loading}
                                   type="submit"
                                   className="inline-flex cursor-pointer shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
                                   style={{ background: "var(--thread)" }}
                              >
                                   {loading ? (
                                        <LoaderCircle
                                             size={16}
                                             className="animate-spin"
                                        />
                                   ) : (
                                        <Search size={16} />
                                   )}
                                   {loading ? "Searching" : "Find company"}
                              </button>
                         </form>
                    </div>
               </section>
               {error && <Notice icon={AlertTriangle} danger text={error} />}
               {success && <Notice icon={CheckCircle2} text={success} />}
               {company ? (
                    <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                         <article className="glass-panel rounded-2xl p-5 xl:col-span-3">
                              <div
                                   className="mb-5 flex items-center gap-2 border-b pb-4"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <Building2
                                        size={17}
                                        className="text-(--thread-violet)"
                                   />
                                   <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                                        Company to be removed
                                   </h3>
                              </div>
                              <div className="flex items-start gap-4">
                                   <div
                                        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white/6"
                                        style={{
                                             borderColor: "var(--glass-border)",
                                        }}
                                   >
                                        {company.avatar ? (
                                             <Image
                                                  src={company.avatar}
                                                  alt={company.name}
                                                  width={60}
                                                  height={60}
                                                  className="h-full w-full object-cover"
                                                  onError={(event) => {
                                                       event.currentTarget.style.display =
                                                            "none";
                                                  }}
                                             />
                                        ) : (
                                             <Building2
                                                  size={24}
                                                  className="text-(--thread-violet)"
                                             />
                                        )}
                                   </div>
                                   <div className="min-w-0">
                                        <h4 className="font-display text-xl font-semibold text-(--text-primary)">
                                             {company.name}
                                        </h4>
                                        <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-(--text-secondary)">
                                             <span className="h-1.5 w-1.5 rounded-full bg-(--danger)" />
                                             Marked for deletion
                                        </span>
                                        <p className="mt-3 max-w-xl text-[12.5px] leading-5 text-(--text-secondary)">
                                             {company.description ||
                                                  "No company description has been added."}
                                        </p>
                                   </div>
                              </div>
                              <div
                                   className="mt-6 grid grid-cols-1 gap-3 border-t pt-5 sm:grid-cols-2"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   <Info
                                        icon={Mail}
                                        label="Email"
                                        value={company.email || "Not available"}
                                   />
                                   <Info
                                        icon={Phone}
                                        label="Phone"
                                        value={company.phone || "Not available"}
                                   />
                                   <Info
                                        icon={Globe2}
                                        label="Website"
                                        value={
                                             company.website || "Not available"
                                        }
                                   />
                              </div>
                         </article>
                         <form
                              onSubmit={removeCompany}
                              className="rounded-2xl border border-(--danger)/25 bg-(--danger-bg) p-5 xl:col-span-2"
                         >
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--danger)/15 text-(--danger)">
                                   <ShieldAlert size={20} />
                              </div>
                              <h3 className="mt-4 font-display text-lg font-semibold text-(--text-primary)">
                                   Final confirmation
                              </h3>
                              <p className="mt-2 text-[12.5px] leading-5 text-(--text-secondary)">
                                   This permanently deletes the company record.
                                   To continue, type{" "}
                                   <span className="font-semibold text-(--text-primary)">
                                        {company.name}
                                   </span>{" "}
                                   exactly below.
                              </p>
                              <label
                                   className="sr-only"
                                   htmlFor="delete-confirmation"
                              >
                                   Type company name to confirm
                              </label>
                              <input
                                   id="delete-confirmation"
                                   value={confirmation}
                                   onChange={(event) =>
                                        setConfirmation(event.target.value)
                                   }
                                   placeholder={company.name}
                                   className="mt-5 w-full rounded-xl border border-(--danger)/30 bg-(--bg-deep)/60 px-3.5 py-2.5 text-[13px] text-(--text-primary)"
                              />
                              <button
                                   disabled={!matches || deleting}
                                   type="submit"
                                   className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--danger) px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                   {deleting ? (
                                        <LoaderCircle
                                             size={16}
                                             className="animate-spin"
                                        />
                                   ) : (
                                        <Trash2 size={16} />
                                   )}
                                   {deleting
                                        ? "Deleting company"
                                        : "Permanently delete"}
                              </button>
                              {!matches && confirmation && (
                                   <p className="mt-2 text-[11px] text-(--danger)">
                                        The name must match exactly before
                                        deletion is enabled.
                                   </p>
                              )}
                         </form>
                    </section>
               ) : (
                    !success && (
                         <section className="glass-panel flex min-h-80 flex-col items-center justify-center rounded-2xl px-6 text-center">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--danger-bg) text-(--danger)">
                                   <Trash2 size={25} />
                              </div>
                              <h3 className="mt-4 font-display text-xl font-semibold text-(--text-primary)">
                                   A deliberate delete flow
                              </h3>
                              <p className="mt-2 max-w-sm text-[13px] leading-6 text-(--text-secondary)">
                                   Search for the company first so you can
                                   verify its details before taking this
                                   permanent action.
                              </p>
                         </section>
                     )
                )}
                </div>
           </main>
      );
}
function Notice({ icon: Icon, danger = false, text }) {
     return (
          <div
               className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-[13px] ${danger ? "border-(--danger)/20 bg-(--danger-bg) text-(--danger)" : "border-(--ok)/20 bg-(--ok-bg) text-(--ok)"}`}
          >
               <Icon size={18} className="mt-0.5 shrink-0" />
               <p>{text}</p>
          </div>
     );
}
function Info({ icon: Icon, label, value }) {
     return (
          <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-white/[0.035] px-3 py-2.5">
               <Icon size={14} className="shrink-0 text-(--text-tertiary)" />
               <div className="min-w-0">
                    <p className="text-[10.5px] font-medium uppercase tracking-wide text-(--text-tertiary)">
                         {label}
                    </p>
                    <p className="truncate text-[12px] text-(--text-secondary)">
                         {value}
                    </p>
               </div>
          </div>
     );
}
