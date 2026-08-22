"use client";

import { useState } from "react";
import {
     LayoutGrid,
     Package,
     Building2,
     Tags,
     ClipboardList,
     Truck,
     Wallet,
     Users,
     Settings,
     ChevronsLeft,
     ChevronsRight,
     Boxes,
     LogOut,
} from "lucide-react";

const NAV_SECTIONS = [
     {
          label: "Overview",
          items: [
               {
                    id: "dashboard",
                    label: "Dashboard",
                    icon: LayoutGrid,
                    badge: null,
               },
          ],
     },
     {
          label: "Catalog",
          items: [
               {
                    id: "companies",
                    label: "Companies",
                    icon: Building2,
                    badge: null,
               },
               {
                    id: "categories",
                    label: "Categories",
                    icon: Tags,
                    badge: null,
               },
               {
                    id: "products",
                    label: "Company Products",
                    icon: Package,
                    badge: null,
               },
               { id: "my-store", label: "My Store", icon: Boxes, badge: "184" },
          ],
     },
     {
          label: "Operations",
          items: [
               {
                    id: "orders",
                    label: "Orders",
                    icon: ClipboardList,
                    badge: "12",
               },
               {
                    id: "delivery",
                    label: "Delivery Man",
                    icon: Truck,
                    badge: null,
               },
               { id: "expenses", label: "Expenses", icon: Wallet, badge: null },
          ],
     },
     {
          label: "Management",
          items: [
               { id: "users", label: "Shopkeepers", icon: Users, badge: null },
               {
                    id: "settings",
                    label: "Settings",
                    icon: Settings,
                    badge: null,
               },
          ],
     },
];

export default function Sidebar({ activeId = "dashboard", onNavigate }) {
     const [collapsed, setCollapsed] = useState(false);

     return (
          <aside
               className={`sticky top-0 h-screen shrink-0 transition-all duration-300 ease-out ${
                    collapsed ? "w-21" : "w-67"
               }`}
               style={{ zIndex: 20 }}
          >
               <div
                    className="glass-panel relative flex h-full flex-col rounded-r-3xl"
                    style={{
                         borderLeft: "none",
                         background:
                              "linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.03) 100%)",
                    }}
               >
                    {/* Signature thread edge */}
                    <div
                         className="absolute right-0 top-8 bottom-8 w-0.5 rounded-full opacity-70"
                         style={{ background: "var(--thread)" }}
                    />

                    {/* Brand */}
                    <div
                         className={`flex items-center gap-3 px-5 pt-6 pb-5 ${
                              collapsed ? "justify-center px-0" : ""
                         }`}
                    >
                         <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-display text-[15px] font-bold text-white"
                              style={{ background: "var(--thread)" }}
                         >
                              SR
                         </div>
                         {!collapsed && (
                              <div className="min-w-0">
                                   <p className="font-display truncate text-[15px] font-semibold text-[var(--text-primary)]">
                                        Smart Representative
                                   </p>
                                   <p className="truncate text-[11px] text-[var(--text-tertiary)]">
                                        Distributor Panel
                                   </p>
                              </div>
                         )}
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 overflow-y-auto scrollbar-none px-3 pb-4">
                         {NAV_SECTIONS.map((section) => (
                              <div key={section.label} className="mb-5">
                                   {!collapsed && (
                                        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                                             {section.label}
                                        </p>
                                   )}
                                   <div className="flex flex-col gap-1">
                                        {section.items.map((item) => {
                                             const Icon = item.icon;
                                             const active =
                                                  activeId === item.id;
                                             return (
                                                  <button
                                                       key={item.id}
                                                       onClick={() =>
                                                            onNavigate?.(
                                                                 item.id,
                                                            )
                                                       }
                                                       title={
                                                            collapsed
                                                                 ? item.label
                                                                 : undefined
                                                       }
                                                       className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium transition-all duration-200 ${
                                                            collapsed
                                                                 ? "justify-center px-0"
                                                                 : ""
                                                       } ${
                                                            active
                                                                 ? "text-white"
                                                                 : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                                       }`}
                                                       style={
                                                            active
                                                                 ? {
                                                                        background:
                                                                             "var(--thread-soft)",
                                                                        border: "1px solid var(--glass-border-strong)",
                                                                   }
                                                                 : {
                                                                        border: "1px solid transparent",
                                                                   }
                                                       }
                                                       onMouseEnter={(e) => {
                                                            if (!active)
                                                                 e.currentTarget.style.background =
                                                                      "var(--glass-fill-hover)";
                                                       }}
                                                       onMouseLeave={(e) => {
                                                            if (!active)
                                                                 e.currentTarget.style.background =
                                                                      "transparent";
                                                       }}
                                                  >
                                                       {active && (
                                                            <span
                                                                 className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
                                                                 style={{
                                                                      background:
                                                                           "var(--thread)",
                                                                 }}
                                                            />
                                                       )}
                                                       <Icon
                                                            size={18}
                                                            strokeWidth={2}
                                                            className="shrink-0"
                                                            style={
                                                                 active
                                                                      ? {
                                                                             color: "var(--thread-pink)",
                                                                        }
                                                                      : undefined
                                                            }
                                                       />
                                                       {!collapsed && (
                                                            <span className="flex-1 truncate">
                                                                 {item.label}
                                                            </span>
                                                       )}
                                                       {!collapsed &&
                                                            item.badge && (
                                                                 <span
                                                                      className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white"
                                                                      style={{
                                                                           background:
                                                                                "var(--thread)",
                                                                      }}
                                                                 >
                                                                      {
                                                                           item.badge
                                                                      }
                                                                 </span>
                                                            )}
                                                  </button>
                                             );
                                        })}
                                   </div>
                              </div>
                         ))}
                    </nav>

                    {/* Footer: collapse toggle + sign out */}
                    <div
                         className="border-t px-3 py-4"
                         style={{ borderColor: "var(--glass-border)" }}
                    >
                         <button
                              onClick={() => setCollapsed((c) => !c)}
                              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] ${
                                   collapsed ? "justify-center px-0" : ""
                              }`}
                              onMouseEnter={(e) =>
                                   (e.currentTarget.style.background =
                                        "var(--glass-fill-hover)")
                              }
                              onMouseLeave={(e) =>
                                   (e.currentTarget.style.background =
                                        "transparent")
                              }
                         >
                              {collapsed ? (
                                   <ChevronsRight size={18} />
                              ) : (
                                   <ChevronsLeft size={18} />
                              )}
                              {!collapsed && <span>Collapse</span>}
                         </button>
                         <button
                              className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--danger)] ${
                                   collapsed ? "justify-center px-0" : ""
                              }`}
                              onMouseEnter={(e) =>
                                   (e.currentTarget.style.background =
                                        "var(--danger-bg)")
                              }
                              onMouseLeave={(e) =>
                                   (e.currentTarget.style.background =
                                        "transparent")
                              }
                         >
                              <LogOut size={18} />
                              {!collapsed && <span>Sign out</span>}
                         </button>
                    </div>
               </div>
          </aside>
     );
}
