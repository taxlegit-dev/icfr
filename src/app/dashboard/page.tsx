"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [status, router, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          <div className="bg-slate-800 rounded-lg shadow-md p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-2">
              My Profile
            </h3>
            <p className="text-3xl font-bold text-purple-400">--</p>
            <p className="text-sm text-gray-300 mt-2">Profile information</p>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-md p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-2">
              Recent Activity
            </h3>
            <p className="text-3xl font-bold text-green-400">--</p>
            <p className="text-sm text-gray-300 mt-2">Your recent actions</p>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-md p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-2">
              Account Status
            </h3>
            <p className="text-3xl font-bold text-green-400">Active</p>
            <p className="text-sm text-gray-300 mt-2">Account is active</p>
          </div>
        </div>

        <div className="mt-8 bg-slate-800 rounded-lg shadow-md p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <div>
                <p className="text-sm font-medium text-white">Update Profile</p>
                <p className="text-xs text-gray-400">
                  Manage your account details
                </p>
              </div>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <div>
                <p className="text-sm font-medium text-white">View Settings</p>
                <p className="text-xs text-gray-400">
                  Customize your preferences
                </p>
              </div>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
