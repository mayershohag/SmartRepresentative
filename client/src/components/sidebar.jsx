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
     ChevronDown,
     Boxes,
     LogOut,
     Plus,
     Pencil,
     Trash2,
     List,
     ShoppingCart,
} from "lucide-react";
import Link from "next/link";

const NAV_SECTIONS = [
     {
          label: "Overview",
          items: [{ id: "dashboard", label: "Dashboard", icon: LayoutGrid }],
     },
     {
          label: "Catalog",
          items: [
               {
                    id: "companies",
                    label: "Companies",
                    icon: Building2,
                    children: [
                         {
                              id: "companies:add",
                              label: "Add Company",
                              icon: Plus,
                              href: "/companies/add",
                         },
                         {
                              id: "companies:list",
                              label: "All Companies",
                              icon: List,
                              href: "/companies",
                         },
                         {
                              id: "companies:update",
                              label: "Update Company",
                              icon: Pencil,
                              href: "/companies/update",
                         },
                         {
                              id: "companies:delete",
                              label: "Delete Company",
                              icon: Trash2,
                              href: "/companies/delete",
                         },
                    ],
               },
               {
                    id: "categories",
                    label: "Categories",
                    icon: Tags,
                    children: [
                         {
                              id: "categories:add",
                              label: "Add Category",
                              icon: Plus,
                              href: "/add-category",
                         },
                         {
                              id: "categories:list",
                              label: "All Categories",
                              icon: List,
                              href: "/categories",
                         },
                         {
                              id: "categories:update",
                              label: "Update Category",
                              icon: Pencil,
                         },
                         {
                              id: "categories:delete",
                              label: "Delete Category",
                              icon: Trash2,
                         },
                    ],
               },
               {
                    id: "products",
                    label: "Company Products",
                    icon: Package,
                    children: [
                         {
                              id: "products:add",
                              label: "Add Product",
                              icon: Plus,
                         },
                         {
                              id: "products:list",
                              label: "All Products",
                              icon: List,
                         },
                         {
                              id: "products:update",
                              label: "Update Product",
                              icon: Pencil,
                         },
                         {
                              id: "products:delete",
                              label: "Delete Product",
                              icon: Trash2,
                         },
                    ],
               },
               {
                    id: "my-store",
                    label: "My Store",
                    icon: Boxes,
                    badge: null,
                    children: [
                         {
                              id: "my-store:add",
                              label: "Add to Store",
                              icon: Plus,
                         },
                         {
                              id: "my-store:cart",
                              label: "Cart / Stock",
                              icon: ShoppingCart,
                         },
                         {
                              id: "my-store:update",
                              label: "Update Product",
                              icon: Pencil,
                         },
                         {
                              id: "my-store:delete",
                              label: "Delete Product",
                              icon: Trash2,
                         },
                    ],
               },
          ],
     },
     {
          label: "Operations",
          items: [
               {
                    id: "orders",
                    label: "Orders",
                    icon: ClipboardList,
                    badge: null,
                    children: [
                         {
                              id: "orders:add",
                              label: "New Order",
                              icon: Plus,
                         },
                         {
                              id: "orders:cart",
                              label: "Order List",
                              icon: ShoppingCart,
                         },
                         {
                              id: "orders:update",
                              label: "Update Order",
                              icon: Pencil,
                         },
                         {
                              id: "orders:delete",
                              label: "Delete Order",
                              icon: Trash2,
                         },
                    ],
               },
               {
                    id: "delivery",
                    label: "Delivery Man",
                    icon: Truck,
                    children: [
                         {
                              id: "delivery:add",
                              label: "Add Delivery Man",
                              icon: Plus,
                         },
                         {
                              id: "delivery:list",
                              label: "All Delivery Men",
                              icon: List,
                         },
                         {
                              id: "delivery:update",
                              label: "Update Delivery Man",
                              icon: Pencil,
                         },
                         {
                              id: "delivery:delete",
                              label: "Delete Delivery Man",
                              icon: Trash2,
                         },
                    ],
               },
               { id: "expenses", label: "Expenses", icon: Wallet },
          ],
     },
     {
          label: "Management",
          items: [
               {
                    id: "users",
                    label: "Shopkeepers",
                    icon: Users,
                    children: [
                         {
                              id: "users:add",
                              label: "Add Shopkeeper",
                              icon: Plus,
                         },
                         {
                              id: "users:list",
                              label: "All Shopkeepers",
                              icon: List,
                         },
                         {
                              id: "users:update",
                              label: "Update Shopkeeper",
                              icon: Pencil,
                         },
                         {
                              id: "users:delete",
                              label: "Delete Shopkeeper",
                              icon: Trash2,
                         },
                    ],
               },
               { id: "settings", label: "Settings", icon: Settings },
          ],
     },
];

function containsActive(item, activeId) {
     if (item.id === activeId) return true;
     return item.children?.some((child) => child.id === activeId) ?? false;
}

function NavBadge({ children }) {
     return (
          <span
               className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white"
               style={{ background: "var(--thread)" }}
          >
               {children}
          </span>
     );
}

function NavItem({ item, collapsed, activeId, onNavigate, openId, setOpenId }) {
     const Icon = item.icon;
     const hasChildren = Boolean(item.children?.length);
     const isOpen = openId === item.id;
     const isActive = activeId === item.id;
     const parentHighlighted = hasChildren && containsActive(item, activeId);
     const rowIsHighlighted = isActive || parentHighlighted;

     const handleTrigger = () => {
          if (hasChildren) {
               setOpenId(isOpen ? null : item.id);
               return;
          }
          onNavigate?.(item.id);
     };

     return (
          <>
               <button
                    type="button"
                    onClick={handleTrigger}
                    aria-expanded={hasChildren ? isOpen : undefined}
                    title={collapsed ? item.label : undefined}
                    className={`group cursor-pointer relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium transition-all duration-200 ${
                         collapsed ? "justify-center px-0" : ""
                    }`}
                    style={{
                         color: rowIsHighlighted
                              ? "#FFFFFF"
                              : "var(--text-secondary)",
                         background: rowIsHighlighted
                              ? "var(--thread-soft)"
                              : "transparent",
                         border: rowIsHighlighted
                              ? "1px solid var(--glass-border-strong)"
                              : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                         if (!rowIsHighlighted)
                              e.currentTarget.style.background =
                                   "var(--glass-fill-hover)";
                         if (!rowIsHighlighted)
                              e.currentTarget.style.color =
                                   "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                         if (!rowIsHighlighted)
                              e.currentTarget.style.background = "transparent";
                         if (!rowIsHighlighted)
                              e.currentTarget.style.color =
                                   "var(--text-secondary)";
                    }}
               >
                    {isActive && (
                         <span
                              className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-full"
                              style={{ background: "var(--thread)" }}
                         />
                    )}

                    <Icon
                         size={18}
                         strokeWidth={2}
                         className="shrink-0"
                         style={
                              rowIsHighlighted
                                   ? { color: "var(--thread-pink)" }
                                   : undefined
                         }
                    />

                    {!collapsed && (
                         <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                         <NavBadge>{item.badge}</NavBadge>
                    )}

                    {!collapsed && hasChildren && (
                         <ChevronDown
                              size={15}
                              strokeWidth={2}
                              className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                         />
                    )}
               </button>

               {/* Submenus logic*/}
               {hasChildren && !collapsed && (
                    <div
                         className="grid transition-all duration-200 ease-out"
                         style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                         <div className="overflow-hidden">
                              <div
                                   className="relative ml-5.5 mt-1 flex flex-col gap-0.5 border-l pb-1 pl-4"
                                   style={{
                                        borderColor: "var(--glass-border)",
                                   }}
                              >
                                   {item.children.map((child) => {
                                        const ChildIcon = child.icon;
                                        const childActive =
                                             activeId === child.id;
                                        return (
                                             <Link
                                                  href={child.href || "/"}
                                                  key={child.id}
                                                  type="button"
                                                  onClick={() =>
                                                       onNavigate?.(child.id)
                                                  }
                                                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium transition-colors duration-150"
                                                  style={{
                                                       color: childActive
                                                            ? "var(--text-primary)"
                                                            : "var(--text-tertiary)",
                                                       background: childActive
                                                            ? "var(--glass-fill-hover)"
                                                            : "transparent",
                                                  }}
                                                  onMouseEnter={(e) => {
                                                       if (!childActive)
                                                            e.currentTarget.style.background =
                                                                 "var(--glass-fill)";
                                                  }}
                                                  onMouseLeave={(e) => {
                                                       if (!childActive)
                                                            e.currentTarget.style.background =
                                                                 "transparent";
                                                  }}
                                             >
                                                  <ChildIcon
                                                       size={14}
                                                       strokeWidth={2}
                                                       style={{
                                                            color: childActive
                                                                 ? "var(--thread-pink)"
                                                                 : "currentColor",
                                                       }}
                                                  />
                                                  <span className="truncate">
                                                       {child.label}
                                                  </span>
                                             </Link>
                                        );
                                   })}
                              </div>
                         </div>
                    </div>
               )}
          </>
     );
}

export default function Sidebar({ activeId = "dashboard", onNavigate }) {
     const [collapsed, setCollapsed] = useState(false);
     const [openId, setOpenId] = useState(null);

     const handleCollapseToggle = () => {
          setCollapsed((prev) => !prev);
          setOpenId(null);
     };

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
                    <div
                         className="absolute right-0 top-8 bottom-8 w-0.5 rounded-full opacity-70"
                         style={{ background: "var(--thread)" }}
                    />

                    {/* Brand */}
                    <div
                         className={`flex items-center gap-3 px-5 pt-6 pb-5 ${collapsed ? "justify-center px-0" : ""}`}
                    >
                         <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-display text-[15px] font-bold text-white"
                              style={{ background: "var(--thread)" }}
                         >
                              SR
                         </div>
                         {!collapsed && (
                              <div className="min-w-0">
                                   <p
                                        className="font-display truncate text-[15px] font-semibold"
                                        style={{ color: "var(--text-primary)" }}
                                   >
                                        Smart Representative
                                   </p>
                                   <p
                                        className="truncate text-[11px]"
                                        style={{
                                             color: "var(--text-tertiary)",
                                        }}
                                   >
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
                                        <p
                                             className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em]"
                                             style={{
                                                  color: "var(--text-tertiary)",
                                             }}
                                        >
                                             {section.label}
                                        </p>
                                   )}
                                   <div className="flex flex-col gap-1">
                                        {section.items.map((item) => (
                                             <NavItem
                                                  key={item.id}
                                                  item={item}
                                                  collapsed={collapsed}
                                                  activeId={activeId}
                                                  onNavigate={onNavigate}
                                                  openId={openId}
                                                  setOpenId={setOpenId}
                                             />
                                        ))}
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
                              type="button"
                              onClick={handleCollapseToggle}
                              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                                   collapsed ? "justify-center px-0" : ""
                              }`}
                              style={{ color: "var(--text-secondary)" }}
                              onMouseEnter={(e) => {
                                   e.currentTarget.style.background =
                                        "var(--glass-fill-hover)";
                                   e.currentTarget.style.color =
                                        "var(--text-primary)";
                              }}
                              onMouseLeave={(e) => {
                                   e.currentTarget.style.background =
                                        "transparent";
                                   e.currentTarget.style.color =
                                        "var(--text-secondary)";
                              }}
                         >
                              {collapsed ? (
                                   <ChevronsRight size={18} />
                              ) : (
                                   <ChevronsLeft size={18} />
                              )}
                              {!collapsed && <span>Collapse</span>}
                         </button>

                         <button
                              type="button"
                              className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                                   collapsed ? "justify-center px-0" : ""
                              }`}
                              style={{ color: "var(--text-secondary)" }}
                              onMouseEnter={(e) => {
                                   e.currentTarget.style.background =
                                        "var(--danger-bg)";
                                   e.currentTarget.style.color =
                                        "var(--danger)";
                              }}
                              onMouseLeave={(e) => {
                                   e.currentTarget.style.background =
                                        "transparent";
                                   e.currentTarget.style.color =
                                        "var(--text-secondary)";
                              }}
                         >
                              <LogOut size={18} />
                              {!collapsed && <span>Sign out</span>}
                         </button>
                    </div>
               </div>
          </aside>
     );
}
