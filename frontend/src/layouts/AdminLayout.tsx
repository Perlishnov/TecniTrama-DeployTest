import React from "react";
import AdminSidebar from "@/components/ForAdmin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-grow ml-72 bg-white">
        <main className="flex-grow p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
