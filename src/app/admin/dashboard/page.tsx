"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    // Initialize from localStorage
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("adminUser");
      return storedAdmin ? JSON.parse(storedAdmin) : null;
    }
    return null;
  });

  useEffect(() => {
    console.log("Session data:", session);
    console.log("Auth status:", status);
    if (status !== "loading" && !adminUser) {
      router.push("/admin/login");
    }
  }, [status, router, adminUser]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("Fetch response status:", res);

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setAdminUser(data.user); 
        localStorage.setItem("adminUser", JSON.stringify(data.user));
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/admin/login");
      }
    };

    if (status === "authenticated") {
      fetchUser();
    }
  }, [status, router]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    setAdminUser(null);
    router.push("/admin/login");
  };

  if (status === "loading" && !adminUser) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null; // Will redirect
  }

  const user = adminUser;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-blue-600">--</p>
            <p className="text-sm text-gray-600 mt-2">Registered users</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Active Sessions
            </h3>
            <p className="text-3xl font-bold text-green-600">--</p>
            <p className="text-sm text-gray-600 mt-2">
              Current active sessions
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              System Status
            </h3>
            <p className="text-3xl font-bold text-green-600">Online</p>
            <p className="text-sm text-gray-600 mt-2">
              All systems operational
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Admin login</p>
                <p className="text-xs text-gray-600">Just now</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Success
              </span>
            </div>
            {/* Add more activity items as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
