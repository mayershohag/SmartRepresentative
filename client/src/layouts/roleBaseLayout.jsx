"use client";
import DeliverymanLayout from "@/app/deliveryman/layout";
import DistributorLayout from "@/app/distributor/layout";
import ShopkeeperLayout from "@/app/shopkeeper/layout";
import SuperAdminLayout from "@/app/super-admin/layout";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

const RoleBasedLayout = () => {
     const { user, isLogin, loading } = useUserContext();

     if (loading) {
          return null;
     }

     if (!isLogin || !user) {
          return null;
     }

     switch (user.role) {
          case "super-admin":
               return <SuperAdminLayout />;

          case "distributor":
               return <DistributorLayout />;

          case "shopkeeper":
               return <ShopkeeperLayout />;

          case "deliveryman":
               return <DeliverymanLayout />;

          default:
               return null;
     }
};

export default RoleBasedLayout;
