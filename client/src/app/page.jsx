"use client";

import { useState } from "react";

import MainContent from "../components/mainContent";

export default function Home() {
     const [activeId, setActiveId] = useState("dashboard");

     return (
          <div
               className="relative flex min-h-screen"
               style={{ background: "var(--bg-void)" }}
          >
               <div className="ambient-glow" />

               <div className="relative z-1 flex min-w-0 flex-1">
                    <MainContent />
               </div>
          </div>
     );
}
