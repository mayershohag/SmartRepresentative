import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
     variable: "--font-geist-sans",
     subsets: ["latin"],
});

const geistMono = Geist_Mono({
     variable: "--font-geist-mono",
     subsets: ["latin"],
});

export const metadata = {
     title: "Smart Representative",
     description:
          "The App which is works as a Representative of yours in your constituence",
     icons: {
          icon: "/fevicon.jpg",
     },
};

export default function RootLayout({ children }) {
     return (
          <html
               lang="en"
               className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
          >
               <body className="min-h-full grid grid-cols-12 grid-rows-auto">
                    <div className="col-span-2">
                         <Sidebar />
                    </div>

                    <div className="col-span-10">
                         <Header />
                         {children}
                    </div>
               </body>
          </html>
     );
}
