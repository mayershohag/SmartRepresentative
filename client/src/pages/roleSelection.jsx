"use client";
import { useState } from "react";
import Link from "next/link";
import {
     Users,
     Truck,
     Store,
     ShieldCheck,
     ArrowRight,
     Sparkles,
} from "lucide-react";

export default function RoleSelection() {
     const [selectedRole, setSelectedRole] = useState("distributor");

     const roles = [
          {
               id: "distributor",
               title: "Distributor",
               href: `${selectedRole}/auth/login`,
               icon: Users,
               badge: "Sales & Logistics",
               description:
                    "Manage distribution channels, oversee regional sales, track live product inventories, and optimize delivery pipelines.",
               metrics: [
                    { label: "Active Retailers", val: "1,240" },
                    { label: "Today Orders", val: "184" },
                    { label: "Revenue (MTD)", val: "$48.5k" },
               ],
          },
          {
               id: "delivery",
               title: "Delivery Man",
               href: `${selectedRole}/auth/login`,
               icon: Truck,
               badge: "Fulfillment",
               description:
                    "Access real-time delivery routes, confirm shopkeeper drop-offs, track cash collection, and update package statuses.",
               metrics: [
                    { label: "Pending Shipments", val: "28" },
                    { label: "Success Rate", val: "99.2%" },
                    { label: "Avg Time/Drop", val: "14 min" },
               ],
          },
          {
               id: "shopkeeper",
               title: "Shopkeeper",
               href: `${selectedRole}/auth/login`,
               icon: Store,
               badge: "Retail Portal",
               description:
                    "Browse digital wholesale catalogs, place instant bulk orders, receive live delivery ETA updates, and track invoices.",
               metrics: [
                    { label: "Stock Health", val: "94%" },
                    { label: "Active Orders", val: "3" },
                    { label: "Credit Balance", val: "$2,400" },
               ],
          },
          {
               id: "super-admin",
               title: "Super Admin",
               href: `${selectedRole}/auth/login`,
               icon: ShieldCheck,
               badge: "Full Operations",
               description:
                    "Complete platform authority: Execute CRUD operations across companies, manage user security scopes, and export global analytics.",
               metrics: [
                    { label: "Total Companies", val: "42" },
                    { label: "System Health", val: "99.9%" },
                    { label: "Active Users", val: "8.4k" },
               ],
          },
     ];

     const activeRoleData =
          roles.find((r) => r.id === selectedRole) || roles[0];

     return (
          <div className="min-h-screen bg-[#111]/5 flex items-center justify-center p-4 sm:p-8 font-sans antialiased select-none">
               {/* Main Curved Canvas Container */}
               <div className="w-full max-w-7xl bg-white/80 backdrop-blur-[5px] rounded-4xl border border-black/9 shadow-2xl shadow-slate-300/60 p-6 sm:p-10 flex flex-col justify-between min-h-[85vh] relative overflow-hidden">
                    {/* Subtle Background Accent Gradient */}
                    {/* <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" /> */}

                    {/* 1. Header Section */}
                    <header className="flex items-center justify-between border-b border-slate-100 pb-6 relative z-10">
                         <div className="flex items-center gap-3">
                              <div className="bg-orange-600 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-600/30">
                                   <Sparkles className="w-5 h-5" />
                              </div>
                              <div>
                                   <h1 className="font-bold text-slate-900 text-lg tracking-tight">
                                        Smart Representative
                                   </h1>
                                   <p className="text-[11px] font-semibold text-slate-400">
                                        Enterprise FMCG & Distribution Portal
                                   </p>
                              </div>
                         </div>

                         <div className="flex items-center gap-4">
                              <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 px-3.5 py-1.5 rounded-xl border border-slate-200/50">
                                   <span className="text-xs font-semibold text-slate-600">
                                        System Live
                                   </span>
                                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              </div>
                         </div>
                    </header>

                    {/* 2. Main Content Grid */}
                    <main className="my-5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                         {/* Left Column: Role Cards Selection */}
                         <div className="lg:col-span-7 space-y-4">
                              <div>
                                   <h2 className="text-2xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                                        Choose your portal role
                                   </h2>
                                   <p className="text-xs sm:text-sm text-slate-500 mt-3">
                                        Select an authorized profile to launch
                                        your tailored workspace & controls.
                                   </p>
                              </div>

                              {/* 4 Role Cards List */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                                   {roles.map((role) => {
                                        const Icon = role.icon;
                                        const isSelected =
                                             selectedRole === role.id;

                                        return (
                                             <div
                                                  key={role.id}
                                                  onClick={() =>
                                                       setSelectedRole(role.id)
                                                  }
                                                  className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                                                       isSelected
                                                            ? "bg-orange-500 border-orange-600 text-white shadow-xl shadow-blue-600/25 scale-[1.02]"
                                                            : "bg-white border-slate-200/80 hover:border-blue-400/50 hover:bg-slate-50/50 text-slate-700"
                                                  }`}
                                             >
                                                  <div>
                                                       <div className="flex items-center justify-between mb-3">
                                                            <div
                                                                 className={`p-2.5 rounded-xl ${isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600 group-hover:text-blue-600"}`}
                                                            >
                                                                 <Icon className="w-5 h-5" />
                                                            </div>
                                                            <span
                                                                 className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                                                            >
                                                                 {role.badge}
                                                            </span>
                                                       </div>
                                                       <h3
                                                            className={`font-bold text-sm ${isSelected ? "text-white" : "text-slate-800"}`}
                                                       >
                                                            {role.title}
                                                       </h3>
                                                       <p
                                                            className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? "text-blue-100" : "text-slate-400"}`}
                                                       >
                                                            {role.description}
                                                       </p>
                                                  </div>

                                                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                                       <span
                                                            className={`text-[11px] font-semibold ${isSelected ? "text-white" : "text-slate-400"}`}
                                                       >
                                                            Preview Workspace
                                                       </span>
                                                       <ArrowRight
                                                            className={`w-3.5 h-3.5 transition-transform ${isSelected ? "translate-x-1 text-white" : "text-slate-400"}`}
                                                       />
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         </div>

                         {/* Right Column: Live Interactive Workspace Preview Box */}
                         <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-95">
                              {/* Glowing Graphic Details inside right box */}
                              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

                              <div className="relative z-10 space-y-4">
                                   <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                        <div className="flex items-center gap-2">
                                             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                             <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                                                  Live Portal Overview
                                             </span>
                                        </div>
                                        <span className="text-[10px] font-bold bg-slate-800 text-blue-400 px-2.5 py-1 rounded-full border border-slate-700">
                                             {activeRoleData.badge}
                                        </span>
                                   </div>

                                   <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                             {activeRoleData.title} Workspace
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                             {activeRoleData.description}
                                        </p>
                                   </div>

                                   {/* Dynamic Stats Metrics inside Preview */}
                                   <div className="grid grid-cols-3 gap-2 pt-2">
                                        {activeRoleData.metrics.map((m, i) => (
                                             <div
                                                  key={i}
                                                  className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-xl text-center"
                                             >
                                                  <p className="text-[10px] font-medium text-slate-400">
                                                       {m.label}
                                                  </p>
                                                  <p className="text-sm font-bold text-white mt-0.5">
                                                       {m.val}
                                                  </p>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              {/* Direct Link CTA Button */}
                              <div className="relative z-10 pt-6">
                                   <Link
                                        href={activeRoleData.href}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-600/40 transition-all duration-200 active:scale-95 group"
                                   >
                                        <span>
                                             Enter Workspace as{" "}
                                             {activeRoleData.title}
                                        </span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                   </Link>
                              </div>
                         </div>
                    </main>
               </div>
          </div>
     );
}
