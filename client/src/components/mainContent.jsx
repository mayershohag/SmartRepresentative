"use client";

import {
     Wallet,
     Package,
     ClipboardList,
     Truck,
     ArrowUpRight,
     ArrowDownRight,
     MoreHorizontal,
     MapPin,
     TrendingUp,
} from "lucide-react";

/* ---------- Mock data (swap for API data) ---------- */

const STATS = [
     {
          id: "cost",
          label: "Total Pricing Cost",
          value: "৳ 4,82,600",
          delta: "+8.2%",
          up: true,
          icon: Wallet,
     },
     {
          id: "products",
          label: "Total Products",
          value: "184",
          delta: "+12",
          up: true,
          icon: Package,
     },
     {
          id: "orders",
          label: "Orders Today",
          value: "37",
          delta: "+5.1%",
          up: true,
          icon: ClipboardList,
     },
     {
          id: "delivery",
          label: "Total Delivery Cost",
          value: "৳ 6,400",
          delta: "-2.4%",
          up: false,
          icon: Truck,
     },
];

const ORDERS = [
     {
          id: "ORD-2214",
          shop: "Nur Traders",
          district: "Mirpur",
          items: 14,
          total: "৳ 8,400",
          status: "pending",
     },
     {
          id: "ORD-2213",
          shop: "Karim Store",
          district: "Badda",
          items: 6,
          total: "৳ 2,150",
          status: "delivered",
     },
     {
          id: "ORD-2212",
          shop: "Popular Bazar",
          district: "Uttara",
          items: 22,
          total: "৳ 15,900",
          status: "delivered",
     },
     {
          id: "ORD-2211",
          shop: "City Mart",
          district: "Dhanmondi",
          items: 9,
          total: "৳ 4,720",
          status: "pending",
     },
     {
          id: "ORD-2210",
          shop: "Amin Grocery",
          district: "Mohammadpur",
          items: 3,
          total: "৳ 1,080",
          status: "cancelled",
     },
];

const STOCK_ALERTS = [
     { name: "Rice — 5kg Pack", company: "ACI Foods", stock: 6, min: 20 },
     { name: "Soybean Oil — 1L", company: "Rupchanda", stock: 11, min: 30 },
     { name: "Detergent Powder — 500g", company: "Keya", stock: 4, min: 15 },
];

const DELIVERY_MEN = [
     { name: "Kabir Hossain", done: 18, pending: 3, initials: "KH" },
     { name: "Sohel Rana", done: 14, pending: 5, initials: "SR" },
     { name: "Jahid Islam", done: 21, pending: 1, initials: "JI" },
];

const STATUS_STYLES = {
     pending: { bg: "var(--warn-bg)", color: "var(--warn)", label: "Pending" },
     delivered: { bg: "var(--ok-bg)", color: "var(--ok)", label: "Delivered" },
     cancelled: {
          bg: "var(--danger-bg)",
          color: "var(--danger)",
          label: "Cancelled",
     },
};

/* ---------- Component ---------- */

export default function MainContent({
     distributorName = "Rafiq Distribution House",
}) {
     return (
          <main className="relative flex-1 px-6 pb-8">
               {/* Stat cards */}
               <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {STATS.map((stat) => {
                         const Icon = stat.icon;
                         return (
                              <div
                                   key={stat.id}
                                   className="glass-panel group relative overflow-hidden rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
                              >
                                   <div
                                        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                                        style={{ background: "var(--thread)" }}
                                   />
                                   <div className="flex items-start justify-between">
                                        <div
                                             className="flex h-10 w-10 items-center justify-center rounded-xl"
                                             style={{
                                                  background:
                                                       "var(--thread-soft)",
                                                  border: "1px solid var(--glass-border)",
                                             }}
                                        >
                                             <Icon
                                                  size={18}
                                                  style={{
                                                       color: "var(--thread-pink)",
                                                  }}
                                                  strokeWidth={2}
                                             />
                                        </div>
                                        <span
                                             className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                                             style={{
                                                  background: stat.up
                                                       ? "var(--ok-bg)"
                                                       : "var(--danger-bg)",
                                                  color: stat.up
                                                       ? "var(--ok)"
                                                       : "var(--danger)",
                                             }}
                                        >
                                             {stat.up ? (
                                                  <ArrowUpRight size={12} />
                                             ) : (
                                                  <ArrowDownRight size={12} />
                                             )}
                                             {stat.delta}
                                        </span>
                                   </div>
                                   <p className="font-mono font-display mt-4 text-[26px] font-semibold leading-none text-[var(--text-primary)]">
                                        {stat.value}
                                   </p>
                                   <p className="mt-2 text-[12.5px] text-[var(--text-tertiary)]">
                                        {stat.label}
                                   </p>
                              </div>
                         );
                    })}
               </section>

               {/* Middle: Orders (2/3) + Stock alerts (1/3) */}
               <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
                    {/* Orders table */}
                    <div className="glass-panel rounded-2xl p-5 xl:col-span-2">
                         <div className="mb-4 flex items-center justify-between">
                              <div>
                                   <h2 className="font-display text-[15px] font-semibold text-[var(--text-primary)]">
                                        Recent Orders
                                   </h2>
                                   <p className="mt-0.5 text-[12px] text-[var(--text-tertiary)]">
                                        Which shops ordered your products today
                                   </p>
                              </div>
                              <button
                                   className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                   style={{
                                        border: "1px solid var(--glass-border)",
                                   }}
                              >
                                   View all
                              </button>
                         </div>

                         <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                   <thead>
                                        <tr className="text-left text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
                                             <th className="pb-3 pr-3 font-medium">
                                                  Order
                                             </th>
                                             <th className="pb-3 pr-3 font-medium">
                                                  Shop
                                             </th>
                                             <th className="pb-3 pr-3 font-medium">
                                                  Items
                                             </th>
                                             <th className="pb-3 pr-3 font-medium">
                                                  Total
                                             </th>
                                             <th className="pb-3 pr-3 font-medium">
                                                  Status
                                             </th>
                                             <th className="pb-3 font-medium"></th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {ORDERS.map((order) => {
                                             const status =
                                                  STATUS_STYLES[order.status];
                                             return (
                                                  <tr
                                                       key={order.id}
                                                       className="border-t text-[13px]"
                                                       style={{
                                                            borderColor:
                                                                 "var(--glass-border)",
                                                       }}
                                                  >
                                                       <td className="font-mono py-3 pr-3 text-[var(--text-secondary)]">
                                                            {order.id}
                                                       </td>
                                                       <td className="py-3 pr-3">
                                                            <p className="font-medium text-[var(--text-primary)]">
                                                                 {order.shop}
                                                            </p>
                                                            <p className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
                                                                 <MapPin
                                                                      size={10}
                                                                 />{" "}
                                                                 {
                                                                      order.district
                                                                 }
                                                            </p>
                                                       </td>
                                                       <td className="py-3 pr-3 text-[var(--text-secondary)]">
                                                            {order.items}
                                                       </td>
                                                       <td className="font-mono py-3 pr-3 font-medium text-[var(--text-primary)]">
                                                            {order.total}
                                                       </td>
                                                       <td className="py-3 pr-3">
                                                            <span
                                                                 className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                                                                 style={{
                                                                      background:
                                                                           status.bg,
                                                                      color: status.color,
                                                                 }}
                                                            >
                                                                 {status.label}
                                                            </span>
                                                       </td>
                                                       <td className="py-3 text-right">
                                                            <button
                                                                 className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
                                                                 aria-label="More options"
                                                            >
                                                                 <MoreHorizontal
                                                                      size={16}
                                                                 />
                                                            </button>
                                                       </td>
                                                  </tr>
                                             );
                                        })}
                                   </tbody>
                              </table>
                         </div>
                    </div>

                    {/* Stock alerts */}
                    <div className="glass-panel rounded-2xl p-5">
                         <div className="mb-4">
                              <h2 className="font-display text-[15px] font-semibold text-[var(--text-primary)]">
                                   Low Stock
                              </h2>
                              <p className="mt-0.5 text-[12px] text-[var(--text-tertiary)]">
                                   Products your shopkeepers need soon
                              </p>
                         </div>

                         <div className="flex flex-col gap-3">
                              {STOCK_ALERTS.map((product) => {
                                   const ratio = Math.min(
                                        product.stock / product.min,
                                        1,
                                   );
                                   return (
                                        <div
                                             key={product.name}
                                             className="rounded-xl p-3.5"
                                             style={{
                                                  background:
                                                       "rgba(255,255,255,0.035)",
                                                  border: "1px solid var(--glass-border)",
                                             }}
                                        >
                                             <div className="flex items-start justify-between gap-2">
                                                  <div className="min-w-0">
                                                       <p className="truncate text-[12.5px] font-medium text-[var(--text-primary)]">
                                                            {product.name}
                                                       </p>
                                                       <p className="truncate text-[11px] text-[var(--text-tertiary)]">
                                                            {product.company}
                                                       </p>
                                                  </div>
                                                  <span
                                                       className="font-mono shrink-0 text-[12px] font-semibold"
                                                       style={{
                                                            color: "var(--warn)",
                                                       }}
                                                  >
                                                       {product.stock} left
                                                  </span>
                                             </div>
                                             <div
                                                  className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full"
                                                  style={{
                                                       background:
                                                            "rgba(255,255,255,0.07)",
                                                  }}
                                             >
                                                  <div
                                                       className="h-full rounded-full"
                                                       style={{
                                                            width: `${ratio * 100}%`,
                                                            background:
                                                                 ratio < 0.3
                                                                      ? "var(--danger)"
                                                                      : "var(--warn)",
                                                       }}
                                                  />
                                             </div>
                                        </div>
                                   );
                              })}
                         </div>
                    </div>
               </section>

               {/* Bottom: Delivery men performance */}
               <section className="mt-5">
                    <div className="glass-panel rounded-2xl p-5">
                         <div className="mb-4 flex items-center justify-between">
                              <div>
                                   <h2 className="font-display text-[15px] font-semibold text-[var(--text-primary)]">
                                        Delivery Man Reports
                                   </h2>
                                   <p className="mt-0.5 text-[12px] text-[var(--text-tertiary)]">
                                        Deliveries scheduled for tomorrow
                                   </p>
                              </div>
                              <span
                                   className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                                   style={{
                                        background: "var(--ok-bg)",
                                        color: "var(--ok)",
                                   }}
                              >
                                   <TrendingUp size={12} /> 84% on-time this
                                   week
                              </span>
                         </div>

                         <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                              {DELIVERY_MEN.map((man) => (
                                   <div
                                        key={man.name}
                                        className="flex items-center gap-3 rounded-xl p-3.5"
                                        style={{
                                             background:
                                                  "rgba(255,255,255,0.035)",
                                             border: "1px solid var(--glass-border)",
                                        }}
                                   >
                                        <div
                                             className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                                             style={{
                                                  background: "var(--thread)",
                                             }}
                                        >
                                             {man.initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                             <p className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                                                  {man.name}
                                             </p>
                                             <p className="mt-0.5 text-[11.5px] text-[var(--text-tertiary)]">
                                                  <span
                                                       style={{
                                                            color: "var(--ok)",
                                                       }}
                                                  >
                                                       {man.done} delivered
                                                  </span>
                                                  {"  ·  "}
                                                  <span
                                                       style={{
                                                            color: "var(--warn)",
                                                       }}
                                                  >
                                                       {man.pending} pending
                                                  </span>
                                             </p>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>
          </main>
     );
}
