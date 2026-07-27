"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  User as UserIcon,
  Mail,
  Calendar,
  MoreVertical,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { User } from "../../../types";
import { userApi } from "../../../services/userApi";
import { LoadingSpinner } from "../../../components/ui/Loading";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getAllUsers();
      console.log("Fetched users:", data); // Debug log
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
  };

  const toggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`,
      )
    )
      return;

    try {
      await userApi.updateUserProfile(userId, { role: newRole });
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.uid?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper function to format date safely
  const formatDate = (date: any) => {
    if (!date) return "N/A";
    if (date?.toDate) {
      return date.toDate().toLocaleDateString("en-GB");
    }
    if (date instanceof Date) {
      return date.toLocaleDateString("en-GB");
    }
    return "N/A";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <LoadingSpinner />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gold animate-pulse">
          Fetching customer records...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-lg font-display text-near-black">
          Error Loading Users
        </h3>
        <p className="text-gray-400 text-sm max-w-md">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 bg-near-black text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-10 px-4 sm:px-6 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display text-near-black uppercase tracking-tight">
            Customers
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage your boutique's growing community.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-warm-beige text-[10px] font-bold uppercase tracking-widest hover:bg-cream transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-mint-50 text-mint-700 border border-mint-200 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
              {users.length} Active Records
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-warm-beige rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-warm-beige flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or account ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream border-none py-2.5 sm:py-3 pl-9 sm:pl-12 pr-4 text-sm focus:ring-1 focus:ring-gold outline-none rounded"
            />
          </div>
          <button className="w-full sm:w-auto bg-white border border-warm-beige px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cream transition-colors rounded">
            <Filter className="w-3.5 h-3.5" /> Filter by Segment
          </button>
        </div>

        {/* Users Table - Responsive */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-cream/50">
                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Identity
                </th>
                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Communication
                </th>
                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Joined
                </th>
                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-left text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Authority
                </th>
                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-right text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-beige">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 sm:px-6 py-12 sm:py-16 text-center"
                  >
                    <EmptyState
                      icon={Users}
                      title="No customers found"
                      description={
                        searchQuery
                          ? "No results match your search criteria"
                          : "No users have registered yet"
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.uid}
                    className="hover:bg-cream/20 transition-colors"
                  >
                    <td className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cream rounded-full flex items-center justify-center border border-warm-beige text-near-black flex-shrink-0">
                          <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-near-black truncate">
                            {user.displayName || "Anonymous Partner"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 truncate">
                            ID: {user.uid?.slice(0, 12).toUpperCase() || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                      <div className="flex items-center gap-2 text-xs text-gray-666">
                        <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-walnut flex-shrink-0" />
                        <span className="truncate max-w-[150px] sm:max-w-[200px]">
                          {user.email || "No email"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                      <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap ${
                          user.role === "admin"
                            ? "bg-near-black text-gold border border-gold"
                            : "bg-warm-beige text-walnut"
                        }`}
                      >
                        {user.role === "admin" && (
                          <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        )}
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() =>
                            toggleAdmin(user.uid, user.role || "user")
                          }
                          className="p-1.5 sm:p-2 text-near-black hover:text-gold transition-colors"
                          title={
                            user.role === "admin"
                              ? "Revoke Admin"
                              : "Make Admin"
                          }
                        >
                          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button className="p-1.5 sm:p-2 text-gray-400 hover:text-near-black transition-colors">
                          <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
