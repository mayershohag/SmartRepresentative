import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/appShell";
import { AuthProvider } from "@/context/authContext";

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
          icon: "/logo/logo.svg",
     },
};

export default function RootLayout({ children }) {
     return (
          <html
               lang="en"
               className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
          >
               <body className="min-h-full">
                    <AuthProvider>
                         <AppShell>{children}</AppShell>
                    </AuthProvider>
               </body>
          </html>
     );
}
