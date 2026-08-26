"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function AppShell({ children }) {
     const [mobileNavOpen, setMobileNavOpen] = useState(false);

     useEffect(() => {
          if (mobileNavOpen) {
               const originalOverflow = document.body.style.overflow;
               const originalTouchAction = document.body.style.touchAction;
               document.body.style.overflow = "hidden";
               document.body.style.touchAction = "none";
               return () => {
                    document.body.style.overflow = originalOverflow;
                    document.body.style.touchAction = originalTouchAction;
               };
          }
     }, [mobileNavOpen]);

     return (
          <div className="min-h-screen sm:flex">
               <div className="hidden sm:block">
                    <Sidebar />
               </div>

               <div className="flex-1 min-w-0">
                    <Header onMenuClick={() => setMobileNavOpen(true)} />
                    {children}
               </div>

               <div
                    aria-hidden="true"
                    onClick={() => setMobileNavOpen(false)}
                    className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[20px] transition-opacity sm:hidden ${mobileNavOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
               />
               <Sidebar
                    mobile
                    isOpen={mobileNavOpen}
                    onClose={() => setMobileNavOpen(false)}
               />
          </div>
     );
}
