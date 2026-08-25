"use client";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
     const { user, loading, isLoggedIn } = useAuth();
     const router = useRouter();

     useEffect(() => {
          if (!loading && !isLoggedIn) {
               router.replace("/auth/login");
          }
     }, [loading, isLoggedIn, router]);

     if (loading) return <p className="p-6 text-white">Loading...</p>;
     if (!isLoggedIn)
          return <p className="p-6 text-white">Redirecting to login...</p>;

     return (
          <div className="min-h-full p-6 text-white">
               <p className="text-2xl font-bold">Welcome, {user.name}</p>
          </div>
     );
}
