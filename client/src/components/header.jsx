"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/authContext";

const PAGE_META = {
     dashboard: {
          title: "Dashboard",
          subtitle: "Your distribution activity, today",
     },
     companies: {
          title: "Companies",
          subtitle: "Manage your collaborated companies",
     },
     categories: {
          title: "Categories",
          subtitle: "Organize your product catalog",
     },
     products: {
          title: "Products",
          subtitle: "Browse products from your companies",
     },
     "my-store": {
          title: "My Store",
          subtitle: "Products you sell to shopkeepers",
     },
     orders: { title: "Orders", subtitle: "Incoming orders from shopkeepers" },
     delivery: {
          title: "Delivery Man",
          subtitle: "Track delivery performance",
     },
     expenses: { title: "Expenses", subtitle: "Costs, pricing, and totals" },
     users: { title: "Shopkeepers", subtitle: "Everyone who orders from you" },
     settings: {
          title: "Settings",
          subtitle: "Account and business preferences",
     },
};

export default function Header({
     activeId = "dashboard",
     distributor,
     onMenuClick,
}) {
     const [notifOpen, setNotifOpen] = useState(false);
     const meta = PAGE_META[activeId] ?? PAGE_META.dashboard;
     const { user } = useAuth();

     const person = distributor ?? {
          ...user,
          name: user?.name || "Name",
          role: user?.role || "Role",
          district: user?.district || "District",
          avatarInitials: user?.avatarInitials || "A",
     };

     const notifications = [
          {
               id: 1,
               text: "Shop Nur Traders placed a new order",
               time: "4m ago",
               tone: "ok",
          },
          {
               id: 2,
               text: "Rice — 5kg is running low on stock",
               time: "38m ago",
               tone: "warn",
          },
          {
               id: 3,
               text: "Delivery man Kabir marked 6 orders delivered",
               time: "1h ago",
               tone: "ok",
          },
     ];

     return (
          <header className="sticky top-0 z-10 px-4 pt-6 pb-4 sm:px-6 lg:px-8">
               <div className="glass-panel backdrop-blur-[3px] flex items-center gap-3 rounded-2xl px-3.5 py-3.5 sm:gap-4 sm:px-5">
                    <button
                         type="button"
                         onClick={onMenuClick}
                         className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-(--text-secondary) transition-colors hover:bg-white/5 hover:text-(--text-primary) sm:hidden"
                         style={{ borderColor: "var(--glass-border)" }}
                         aria-label="Open navigation menu"
                    >
                         <Menu size={19} />
                    </button>
                    {/* Page title */}
                    <div className="min-w-0 flex-1">
                         <h1 className="font-display truncate text-[19px] font-semibold leading-none text-(--text-primary">
                              {meta.title}
                         </h1>
                         <p className="mt-1.5 truncate text-[12.5px] text-(--text-tertiary">
                              {meta.subtitle}
                         </p>
                    </div>

                    {/* Search */}
                    <div className="hidden sm:block">
                         <div
                              className="flex w-65 items-center gap-2 rounded-xl px-3.5 py-2.5"
                              style={{
                                   background: "rgba(255,255,255,0.05)",
                                   border: "1px solid var(--glass-border)",
                              }}
                         >
                              <Search
                                   size={16}
                                   className="text-(--text-tertiary)"
                                   strokeWidth={2}
                              />
                              <input
                                   type="text"
                                   placeholder="Search orders, products, shops…"
                                   className="w-full bg-transparent outline-none text-[13px] text-(--text-primary)"
                              />
                         </div>
                    </div>

                    {/* Quick add */}
                    <Link
                         href="/products/add"
                         className="hidden items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98] md:flex"
                         style={{ background: "var(--thread)" }}
                    >
                         <Plus size={16} strokeWidth={2.5} />
                         New Product
                    </Link>

                    {/* Notifications */}
                    <div className="relative">
                         <button
                              onClick={() => setNotifOpen((o) => !o)}
                              className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
                              style={{
                                   background: "rgba(255,255,255,0.05)",
                                   border: "1px solid var(--glass-border)",
                              }}
                              aria-label="Notifications"
                         >
                              <Bell
                                   size={17}
                                   className="text-(--text-secondary)"
                                   strokeWidth={2}
                              />
                              <span
                                   className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                                   style={{ background: "var(--thread-pink)" }}
                              >
                                   3
                              </span>
                         </button>

                         {notifOpen && (
                              <div
                                   className="glass-panel absolute right-0 top-12 w-75 rounded-2xl p-2 shadow-2xl"
                                   style={{ background: "rgba(21,15,38,0.97)" }}
                              >
                                   <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-(--text-tertiary)">
                                        Notifications
                                   </p>
                                   <div className="flex flex-col gap-1">
                                        {notifications.map((n) => (
                                             <div
                                                  key={n.id}
                                                  className="flex items-start gap-2.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                                             >
                                                  <span
                                                       className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                                                       style={{
                                                            background:
                                                                 n.tone ===
                                                                 "warn"
                                                                      ? "var(--warn)"
                                                                      : "var(--ok)",
                                                       }}
                                                  />
                                                  <div className="min-w-0">
                                                       <p className="text-[12.5px] leading-snug text-(--text-primary)">
                                                            {n.text}
                                                       </p>
                                                       <p className="mt-0.5 text-[11px] text-(--text-tertiary)">
                                                            {n.time}
                                                       </p>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         )}
                    </div>

                    {/* Profile */}
                    <Link
                         href="/auth/profile"
                         className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 transition-colors hover:bg-white/5"
                         style={{ border: "1px solid var(--glass-border)" }}
                    >
                         <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                              style={{ background: "var(--thread)" }}
                         >
                              {person.avatarInitials}
                         </div>
                         <div className="hidden text-left sm:block">
                              <p className="text-[12.5px] font-semibold leading-none text-(--text-primary)">
                                   {person.name}
                              </p>
                              <p className="mt-1 text-[11px] leading-none text-(--text-tertiary)">
                                   {person.role} · {person.district}
                              </p>
                         </div>
                         <ChevronDown
                              size={14}
                              className="hidden text-(--text-tertiary) sm:block"
                         />
                    </Link>
               </div>
          </header>
     );
}
