'use client';
import { useEffect, useState, useMemo } from "react";
import { User, Mail, Phone, Shield, Clock, Search } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const getRoleBadgeColor = (role: string) => {
    return role === "ADMIN"
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  // ✅ Filtered users based on search
  const filteredUsers = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return users.filter((user) =>
      [user.firstName, user.lastName, user.email, user.phone]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [users, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 border-b pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <User className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  Users Management
                </h1>
                <p className="text-sm text-gray-500">
                  Manage user accounts, roles, and access permissions
                </p>
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
              Total Users:{" "}
              <span className="font-semibold">{filteredUsers.length}</span>
            </div>
          </div>

          {/* ✅ Search Bar */}
          <div className="mt-6 relative max-w-sm">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Role
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      } hover:bg-indigo-50 transition-colors duration-150`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-sm">
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {user.email || (
                          <span className="text-gray-400 italic">
                            Not provided
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {user.phone || (
                          <span className="text-gray-400 italic">
                            Not provided
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No users found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
