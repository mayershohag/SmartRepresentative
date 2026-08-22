"use client";

import { useState } from "react";

import Header from "../components/header";
import MainContent from "../components/mainContent";
import Sidebar from "../components/sidebar";

export default function Home() {
     const [activeId, setActiveId] = useState("dashboard");

     const distributor = {
          name: "Rafiq Distribution House",
          role: "Distributor",
          district: "Dhaka",
          avatarInitials: "RD",
     };

     return (
          <div
               className="relative flex min-h-screen"
               style={{ background: "var(--bg-void)" }}
          >
               <div className="ambient-glow" />

               <div className="relative z-1 flex min-w-0 flex-1">
                    <MainContent distributorName={distributor.name} />
               </div>
          </div>
     );
}
