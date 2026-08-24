"use client";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
     const { user, loading, isLoggedIn } = useAuth();
     const router = useRouter();

     useEffect(() => {
          if (!loading && !isLoggedIn) {
               //    router.push("/auth/login");
               console.log(`failed to login`);
               console.log(loading);
               console.log(isLoggedIn);
          }
     }, [loading, isLoggedIn, router]);

     if (loading) return <p>Loading...</p>;
     if (!isLoggedIn) return null;
     console.log(user);

     return (
          <div className="min-h-full p-6 text-white">
               <p className="text-2xl font-bold">Welcome, {user.name}</p>
          </div>
     );
}
